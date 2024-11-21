import { NgModule } from '@angular/core';
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { AuthGuard } from './guards/auth.guard';
import { RegisterPage } from './pages/register/register.page';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard] ,
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'create-product',
    canActivate: [AuthGuard] ,
    loadChildren: () => import('./pages/create-product/create-product.module').then( m => m.CreateProductPageModule)
  },
  {
    path: 'product-details',
    canActivate: [AuthGuard] ,
    loadChildren: () => import('./pages/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'address',
    loadChildren: () => import('./pages/address/address.module').then( m => m.AddressPageModule)
  },
  {
    path: 'payment-method',
    canActivate: [AuthGuard] ,
    loadChildren: () => import('./pages/payment-method/payment-method.module').then( m => m.PaymentMethodPageModule)
  },
  {
    path: 'edit-profile',
    canActivate: [AuthGuard] ,
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'my-purchased-products',
    canActivate: [AuthGuard] ,
    loadChildren: () => import('./pages/my-purchased-products/my-purchased-products.module').then( m => m.MyPurchasedProductsPageModule)
  },
  {
    path: 'my-sold-products',
    canActivate: [AuthGuard] ,
    loadChildren: () => import('./pages/my-sold-products/my-sold-products.module').then( m => m.MySoldProductsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
