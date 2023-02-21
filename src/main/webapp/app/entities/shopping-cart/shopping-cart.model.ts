import { IMenu } from 'app/entities/menu/menu.model';
import { IClient } from 'app/entities/client/client.model';

export interface IShoppingCart {
  id: number;
  amount?: number | null;
  menu?: Pick<IMenu, 'id'> | null;
  client?: Pick<IClient, 'id'> | null;
}

export type NewShoppingCart = Omit<IShoppingCart, 'id'> & { id: null };
