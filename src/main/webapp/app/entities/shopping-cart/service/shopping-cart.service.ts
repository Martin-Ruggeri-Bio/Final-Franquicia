import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShoppingCart, NewShoppingCart } from '../shopping-cart.model';

export type PartialUpdateShoppingCart = Partial<IShoppingCart> & Pick<IShoppingCart, 'id'>;

export type EntityResponseType = HttpResponse<IShoppingCart>;
export type EntityArrayResponseType = HttpResponse<IShoppingCart[]>;

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shopping-carts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shoppingCart: NewShoppingCart): Observable<EntityResponseType> {
    return this.http.post<IShoppingCart>(this.resourceUrl, shoppingCart, { observe: 'response' });
  }

  update(shoppingCart: IShoppingCart): Observable<EntityResponseType> {
    return this.http.put<IShoppingCart>(`${this.resourceUrl}/${this.getShoppingCartIdentifier(shoppingCart)}`, shoppingCart, {
      observe: 'response',
    });
  }

  partialUpdate(shoppingCart: PartialUpdateShoppingCart): Observable<EntityResponseType> {
    return this.http.patch<IShoppingCart>(`${this.resourceUrl}/${this.getShoppingCartIdentifier(shoppingCart)}`, shoppingCart, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShoppingCart>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShoppingCart[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShoppingCartIdentifier(shoppingCart: Pick<IShoppingCart, 'id'>): number {
    return shoppingCart.id;
  }

  compareShoppingCart(o1: Pick<IShoppingCart, 'id'> | null, o2: Pick<IShoppingCart, 'id'> | null): boolean {
    return o1 && o2 ? this.getShoppingCartIdentifier(o1) === this.getShoppingCartIdentifier(o2) : o1 === o2;
  }

  addShoppingCartToCollectionIfMissing<Type extends Pick<IShoppingCart, 'id'>>(
    shoppingCartCollection: Type[],
    ...shoppingCartsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const shoppingCarts: Type[] = shoppingCartsToCheck.filter(isPresent);
    if (shoppingCarts.length > 0) {
      const shoppingCartCollectionIdentifiers = shoppingCartCollection.map(
        shoppingCartItem => this.getShoppingCartIdentifier(shoppingCartItem)!
      );
      const shoppingCartsToAdd = shoppingCarts.filter(shoppingCartItem => {
        const shoppingCartIdentifier = this.getShoppingCartIdentifier(shoppingCartItem);
        if (shoppingCartCollectionIdentifiers.includes(shoppingCartIdentifier)) {
          return false;
        }
        shoppingCartCollectionIdentifiers.push(shoppingCartIdentifier);
        return true;
      });
      return [...shoppingCartsToAdd, ...shoppingCartCollection];
    }
    return shoppingCartCollection;
  }
}
