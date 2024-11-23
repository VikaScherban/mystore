import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ContextService, LAUNCH_CALLER, LaunchDialogService} from '@spartacus/storefront';
import {Observable, of, Subscription} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {ExportOrderEntriesToCsvService} from "@spartacus/cart/import-export/components";
import {ORDER_ENTRIES_CONTEXT, OrderEntriesContext} from "@spartacus/cart/base/root";
// @ts-ignore
import {Cart, OrderEntry} from "@spartacus/core";

@Component({
  selector: 'st-cart-actions',
  templateUrl: './st-cart-actions.component.html',
  styleUrls: ['./st-cart-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StCartActionsComponent implements OnDestroy {

  private _subscription = new Subscription();
  private _orderEntriesContext$: Observable<OrderEntriesContext | undefined> = this._contextService.get<OrderEntriesContext>(ORDER_ENTRIES_CONTEXT);

  @ViewChild('element') element!: ElementRef;

  @Input()
  cart$!: Observable<Cart>;

  entries$: Observable<OrderEntry[] | undefined> =
    this._orderEntriesContext$.pipe(
      switchMap(
        (orderEntriesContext) =>
          orderEntriesContext?.getEntries?.() ?? of(undefined)
      )
    );

  constructor(
    private _vcr: ViewContainerRef,
    private _launchDialogService: LaunchDialogService,
    private _exportEntriesService: ExportOrderEntriesToCsvService,
    private _contextService: ContextService
  ) { }

  saveCart(cart: Cart): void {
    this.openDialog(cart);
  }

  openDialog(cart: Cart) {
    const dialog = this._launchDialogService.openDialog(
      LAUNCH_CALLER.SAVED_CART,
      this.element,
      this._vcr,
      { cart, layoutOption: 'save' }
    );

    if (dialog) {
      this._subscription.add(dialog.pipe(take(1)).subscribe());
    }
  }

  exportCsv(entries: any): void {
    this._exportEntriesService.downloadCsv(entries);
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }
}
