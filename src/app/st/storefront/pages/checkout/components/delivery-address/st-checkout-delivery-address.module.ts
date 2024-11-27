import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, FeaturesConfigModule, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { CartNotEmptyGuard, CheckoutAuthGuard } from '@spartacus/checkout/base/components';
import { CartValidationGuard } from '@spartacus/cart/base/core';
import { CardModule, SpinnerModule } from '@spartacus/storefront';
import { AddressFormModule } from '@spartacus/user/profile/components';

import { StCheckoutDeliveryAddressComponent } from './st-checkout-delivery-address.component';
import {
  StCheckoutLayoutHeaderComponent
} from '../../core/layouts/st-checkout-layout-header/st-checkout-layout-header.component';

@NgModule({
  declarations: [
    StCheckoutDeliveryAddressComponent
  ],
  imports: [
    CommonModule,
    I18nModule,
    SpinnerModule,
    FeaturesConfigModule,
    AddressFormModule,
    CardModule,
    StCheckoutLayoutHeaderComponent
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutDeliveryAddress: {
          component: StCheckoutDeliveryAddressComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, CartValidationGuard],
        },
      },
    }),
  ],
  exports: [StCheckoutDeliveryAddressComponent],
})
export class StCheckoutDeliveryAddressModule { }
