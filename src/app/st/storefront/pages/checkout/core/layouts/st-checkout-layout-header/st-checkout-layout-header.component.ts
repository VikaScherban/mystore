import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslationService } from '@spartacus/core';
import { CheckoutStepService } from '@spartacus/checkout/base/components';
import { switchMap } from 'rxjs';

@Component({
  selector: 'st-checkout-layout-header',
  standalone: true,
  template: `
    <div class="mt-2 mb-4">
      <h2 class="cx-checkout-title d-none d-lg-block d-xl-block">
        <div class="mt-2 mb-4">
          <h2 class="cx-checkout-title d-none d-lg-block d-xl-block">
            {{ title() }}
          </h2>
        </div>
        <ng-content select="[st-checkout-layout-header-content]"></ng-content>
      </h2>
    </div>
  `,
})
export class StCheckoutLayoutHeaderComponent {

  title = toSignal<string>(
    this.checkoutStepService.activeStepIndex$
      .pipe(
        switchMap(activeStepIndex => {
          let title = 'checkoutAddress.';
          const allSteps = this.checkoutStepService.allSteps.map(step => step.id);
          switch (activeStepIndex) {
            case 0: title = title.concat('shippingAddress'); break;
            case 1: title = title.concat(allSteps[activeStepIndex]); break;
            case 2: title = title.concat(allSteps[activeStepIndex]); break;
            case 3: title = title.concat(allSteps[activeStepIndex]); break;
          }
          return this.translationService.translate(title);
        })
      )
  );

  constructor(
    private checkoutStepService: CheckoutStepService,
    private translationService: TranslationService
  ) {}
}
