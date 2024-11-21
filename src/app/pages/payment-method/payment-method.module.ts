import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMethodPageRoutingModule } from './payment-method-routing.module';

import { PaymentMethodPage } from './payment-method.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentMethodPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PaymentMethodPage]
})
export class PaymentMethodPageModule {}
