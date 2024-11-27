import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Optional,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  CardWithAddress,
  CheckoutConfigService,
  CheckoutStepService
} from '@spartacus/checkout/base/components';
import {
  Address,
  FeatureConfigService,
  getLastValueSync,
  GlobalMessageService,
  GlobalMessageType,
  TranslationService,
  UserAddressService
} from '@spartacus/core';
import {
  CheckoutDeliveryAddressFacade,
  CheckoutDeliveryModesFacade
} from '@spartacus/checkout/base/root';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import {
  Card,
  getAddressNumbers
} from '@spartacus/storefront';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  switchMap,
  tap
} from 'rxjs';

@Component({
  selector: 'st-checkout-delivery-address',
  templateUrl: './st-checkout-delivery-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StCheckoutDeliveryAddressComponent {

  private checkoutConfigService = inject(CheckoutConfigService);
  @Optional() private featureConfigService = inject(FeatureConfigService, {
    optional: true,
  });
  private busy$ = new BehaviorSubject<boolean>(false);

  cards = toSignal<CardWithAddress[]>(this.createCards());
  isUpdating = toSignal<boolean>(this.createIsUpdating());
  doneAutoSelect = signal<boolean>(false);
  selectedAddress = signal<Address | undefined>(undefined);
  addressFormOpened = signal<boolean>(false);

  get selectedAddress$(): Observable<Address | undefined> {
    return this.checkoutDeliveryAddressFacade.getDeliveryAddressState().pipe(
      filter((state) => !state.loading),
      map((state) => state.data),
      distinctUntilChanged((prev, curr) => prev?.id === curr?.id)
    );
  }

  get backBtnText(): string {
    return this.checkoutStepService.getBackBntText(this.activatedRoute);
  }

  get isGuestCheckout(): boolean {
    return !!getLastValueSync(this.activeCartFacade.isGuestCart());
  }

  constructor(
    private userAddressService: UserAddressService,
    private checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
    private activatedRoute: ActivatedRoute,
    private translationService: TranslationService,
    private activeCartFacade: ActiveCartFacade,
    private checkoutStepService: CheckoutStepService,
    private checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    private globalMessageService: GlobalMessageService
  ) {}

  showNewAddressForm(): void {
    this.addressFormOpened.set(true);
  }

  hideNewAddressForm(goPrevious: boolean = false): void {
    this.addressFormOpened.set(false);
    if (goPrevious) {
      this.back();
    }
  }

  selectAddress(address: Address): void {
    if (address?.id === getLastValueSync(this.selectedAddress$)?.id) {
      return;
    }
    this.globalMessageService.add(
      {
        key: 'checkoutAddress.deliveryAddressSelected',
      },
      GlobalMessageType.MSG_TYPE_INFO
    );

    this.setAddress(address);
  }

  addAddress(address?: Address): void {
    if (
      !address &&
      this.shouldUseAddressSavedInCart() &&
      this.selectedAddress()
    ) {
      this.next();
    }
    if (!address) {
      return;
    }
    this.busy$.next(true);
    this.doneAutoSelect.set(true);
    this.checkoutDeliveryAddressFacade
      .createAndSetAddress(address)
      .pipe(
        switchMap(() =>
          this.checkoutDeliveryModesFacade.clearCheckoutDeliveryMode()
        )
      )
      .subscribe({
        complete: () => this.next(),
        error: () => {
          this.onError();
          this.doneAutoSelect.set(false);
        },
      });
  }

  next(): void {
    this.checkoutStepService.next(this.activatedRoute);
  }

  back(): void {
    this.checkoutStepService.back(this.activatedRoute);
  }

  private createCards(): Observable<CardWithAddress[]> {
    const addresses$ = combineLatest([
      this.getSupportedAddresses(),
      this.selectedAddress$,
    ]);
    const translations$ = combineLatest([
      this.translationService.translate(
        'checkoutAddress.defaultDeliveryAddress'
      ),
      this.translationService.translate('checkoutAddress.shipToThisAddress'),
      this.translationService.translate('addressCard.selected'),
      this.translationService.translate('addressCard.phoneNumber'),
      this.translationService.translate('addressCard.mobileNumber'),
    ]);

    return combineLatest([addresses$, translations$]).pipe(
      tap(([[addresses, selected]]) =>
        this.selectDefaultAddress(addresses, selected)
      ),
      map(
        ([
           [addresses, selected],
           [textDefault, textShipTo, textSelected, textPhone, textMobile],
         ]) =>
          addresses?.map((address) => ({
            address,
            card: this.getCardContent(
              address,
              selected,
              textDefault,
              textShipTo,
              textSelected,
              textPhone,
              textMobile
            ),
          }))
      )
    );
  }

  private getCardContent(
    address: Address,
    selected: any,
    textDefaultDeliveryAddress: string,
    textShipToThisAddress: string,
    textSelected: string,
    textPhone: string,
    textMobile: string
  ): Card {
    const hideSelectActionForSelected = this.featureConfigService?.isEnabled(
      'a11yHideSelectBtnForSelectedAddrOrPayment'
    );
    let region = '';
    if (address.region && address.region.isocode) {
      region = address.region.isocode + ', ';
    }

    const numbers = getAddressNumbers(address, textPhone, textMobile);
    const isSelected: boolean = selected && selected.id === address.id;

    return {
      role: 'region',
      title: address.defaultAddress ? textDefaultDeliveryAddress : '',
      textBold: address.firstName + ' ' + address.lastName,
      text: [
        address.line1,
        address.line2,
        address.town + ', ' + region + address.country?.isocode,
        address.postalCode,
        numbers,
      ],
      actions:
        hideSelectActionForSelected && isSelected
          ? []
          : [{ name: textShipToThisAddress, event: 'send' }],
      header: isSelected ? textSelected : '',
      label: address.defaultAddress
        ? 'addressBook.defaultDeliveryAddress'
        : 'addressBook.additionalDeliveryAddress',
    } as Card;
  }

  private getSupportedAddresses(): Observable<Address[]> {
    return this.userAddressService.getAddresses();
  }

  private selectDefaultAddress(
    addresses: Address[],
    selected: Address | undefined
  ): void {
    if (
      !this.doneAutoSelect() &&
      addresses?.length &&
      (!selected || Object.keys(selected).length === 0)
    ) {
      selected = addresses.find((address) => address.defaultAddress);
      if (selected) {
        this.setAddress(selected);
      }
      this.doneAutoSelect.set(true);
    } else if (selected && this.shouldUseAddressSavedInCart()) {
      this.selectedAddress.set(selected);
    }
  }

  private setAddress(address: Address): void {
    this.busy$.next(true);
    this.checkoutDeliveryAddressFacade
      .setDeliveryAddress(address)
      .pipe(
        switchMap(() =>
          this.checkoutDeliveryModesFacade.clearCheckoutDeliveryMode()
        )
      )
      .subscribe({
        complete: () => {
          this.onSuccess();
        },
        error: () => {
          this.onError();
        },
      });
  }

  private onSuccess(): void {
    this.busy$.next(false);
  }

  private onError(): void {
    this.busy$.next(false);
  }

  private shouldUseAddressSavedInCart(): boolean {
    return !!this.checkoutConfigService?.shouldUseAddressSavedInCart();
  }

  private createIsUpdating(): Observable<boolean> {
    return combineLatest([
      this.busy$,
      this.userAddressService.getAddressesLoading(),
      this.getAddressLoading(),
    ]).pipe(
      map(
        ([busy, userAddressLoading, deliveryAddressLoading]) =>
          busy || userAddressLoading || deliveryAddressLoading
      ),
      distinctUntilChanged()
    );
  }

  private getAddressLoading(): Observable<boolean> {
    return this.checkoutDeliveryAddressFacade.getDeliveryAddressState().pipe(
      map((state) => state.loading),
      distinctUntilChanged()
    );
  }
}
