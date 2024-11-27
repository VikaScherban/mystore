import { NgModule } from '@angular/core';
import { CmsConfig, provideConfig } from '@spartacus/core';

import { ST_CHECKOUT_FEATURE_NAME, StCheckoutRootModule } from '../../../st/storefront/pages/checkout/root';

@NgModule({
  declarations: [],
  imports: [
    StCheckoutRootModule
  ],
  providers: [provideConfig(<CmsConfig>{
    featureModules: {
      [ST_CHECKOUT_FEATURE_NAME]: {
        module: () =>
          import('../../../st/storefront/pages/checkout/st-checkout.module').then((m) => m.StCheckoutModule),
      },
    }
  }),
  ]
})
export class StCheckoutFeatureModule { }
