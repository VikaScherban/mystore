import { NgModule } from '@angular/core';
import {BaseStorefrontModule, PDFModule, VideoModule} from "@spartacus/storefront";
import { SpartacusConfigurationModule } from './spartacus-configuration.module';
import { SpartacusFeaturesModule } from './spartacus-features.module';
import {SpartacusTrainingModule} from "./spartacus-training.module";

@NgModule({
  declarations: [],
  imports: [
    BaseStorefrontModule,
    SpartacusFeaturesModule,
    SpartacusConfigurationModule,
    SpartacusTrainingModule,
    VideoModule,
    PDFModule
  ],
  exports: [BaseStorefrontModule]
})
export class SpartacusModule { }
