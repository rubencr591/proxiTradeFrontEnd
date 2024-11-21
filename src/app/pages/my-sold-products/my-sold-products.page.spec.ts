import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MySoldProductsPage } from './my-sold-products.page';

describe('MySoldProductsPage', () => {
  let component: MySoldProductsPage;
  let fixture: ComponentFixture<MySoldProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MySoldProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
