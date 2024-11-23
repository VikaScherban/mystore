import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService, RoutingService } from '@spartacus/core';
import {ActiveCartService, CartConfigService, SelectiveCartService} from '@spartacus/cart/base/core';
import { Cart, OrderEntry, PromotionLocation } from '@spartacus/cart/base/root'
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'st-cart',
  templateUrl: './st-cart.component.html',
  styleUrls: ['./st-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StCartComponent implements OnInit {

  cart$: Observable<Cart> = this.activeCartService.getActive();
  entries$: Observable<OrderEntry[]> = this.activeCartService
    .getEntries()
    .pipe(filter((entries) => entries.length > 0));
  loggedIn = false;
  promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;
  selectiveCartEnabled: boolean = this.cartConfig.isSelectiveCartEnabled();
  cartLoaded$: Observable<boolean> = combineLatest([
    this.activeCartService.isStable(),
    this.selectiveCartEnabled
      ? this.selectiveCartService.isStable()
      : of(false),
    this.authService.isUserLoggedIn(),
  ]).pipe(
    tap(([, , loggedIn]) => (this.loggedIn = loggedIn)),
    map(([cartLoaded, sflLoaded, loggedIn]) =>
      loggedIn && this.selectiveCartEnabled
        ? cartLoaded && sflLoaded
        : cartLoaded
    )
  );

  constructor(
    private activeCartService: ActiveCartService,
    private selectiveCartService: SelectiveCartService,
    private authService: AuthService,
    private routingService: RoutingService,
    private cartConfig: CartConfigService
  ) { }

  ngOnInit(): void { }

  saveForLater(item: OrderEntry) {
    if (this.loggedIn) {
      if (item.product?.code && item.quantity) {
        this.activeCartService.removeEntry(item);
        this.selectiveCartService.addEntry(item.product?.code, item.quantity);
      }
    } else {
      this.routingService.go({ cxRoute: 'login' });
    }
  }
}
