import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'menu',
        data: { pageTitle: 'finalfranquiciaApp.menu.home.title' },
        loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule),
      },
      {
        path: 'sale',
        data: { pageTitle: 'finalfranquiciaApp.sale.home.title' },
        loadChildren: () => import('./sale/sale.module').then(m => m.SaleModule),
      },
      {
        path: 'details',
        data: { pageTitle: 'finalfranquiciaApp.details.home.title' },
        loadChildren: () => import('./details/details.module').then(m => m.DetailsModule),
      },
      {
        path: 'shopping-cart',
        data: { pageTitle: 'finalfranquiciaApp.shoppingCart.home.title' },
        loadChildren: () => import('./shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule),
      },
      {
        path: 'client',
        data: { pageTitle: 'finalfranquiciaApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
