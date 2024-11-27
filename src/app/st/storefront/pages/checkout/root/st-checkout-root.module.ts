import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfigFactory } from '@spartacus/core';
import { ST_CHECKOUT_FEATURE_NAME } from './st-checkout-feature-name';

export const ST_CHECKOUT_CMS_COMPONENTS: string[] = [
  'CheckoutDeliveryAddress',
];

export function defaultStCheckoutComponentsConfig() {
  const config: CmsConfig = {
    featureModules: {
      [ST_CHECKOUT_FEATURE_NAME]: {
        cmsComponents: ST_CHECKOUT_CMS_COMPONENTS,
      },
    },
  };
  return config;
}

@NgModule({
  providers: [provideDefaultConfigFactory(defaultStCheckoutComponentsConfig)],
})
export class StCheckoutRootModule {}
