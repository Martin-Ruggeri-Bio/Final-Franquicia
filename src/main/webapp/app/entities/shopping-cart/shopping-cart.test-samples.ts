import { IShoppingCart, NewShoppingCart } from './shopping-cart.model';

export const sampleWithRequiredData: IShoppingCart = {
  id: 126,
};

export const sampleWithPartialData: IShoppingCart = {
  id: 58349,
};

export const sampleWithFullData: IShoppingCart = {
  id: 14283,
  amount: 7878,
};

export const sampleWithNewData: NewShoppingCart = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
