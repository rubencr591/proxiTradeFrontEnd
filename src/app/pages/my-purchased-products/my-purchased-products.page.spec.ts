import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPurchasedProductsPage } from './my-purchased-products.page';

describe('MyPurchasedProductsPage', () => {
  let component: MyPurchasedProductsPage;
  let fixture: ComponentFixture<MyPurchasedProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPurchasedProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
