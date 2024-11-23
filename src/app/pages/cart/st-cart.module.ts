import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import {
  FormErrorsModule,
  ItemCounterModule,
  MediaModule,
  OutletModule,
  PromotionsModule,
  SpinnerModule
} from '@spartacus/storefront';

import { StCartComponent } from './containers';
import { StCartItemsComponent, StCartItemComponent, StCartActionsComponent } from './components';

@NgModule({
  declarations: [
    StCartComponent,
    StCartItemsComponent,
    StCartItemComponent,
    StCartActionsComponent
  ],
  imports: [
    CommonModule,
    I18nModule,
    UrlModule,
    SpinnerModule,
    FormErrorsModule,
    ReactiveFormsModule,
    RouterModule,
    PromotionsModule,
    OutletModule,
    ItemCounterModule,
    MediaModule
  ]
})
export class StCartModule { }
