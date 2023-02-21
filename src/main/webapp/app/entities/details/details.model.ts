import { IMenu } from 'app/entities/menu/menu.model';
import { ISale } from 'app/entities/sale/sale.model';

export interface IDetails {
  id: number;
  amount?: number | null;
  menu?: Pick<IMenu, 'id'> | null;
  sale?: Pick<ISale, 'id'> | null;
}

export type NewDetails = Omit<IDetails, 'id'> & { id: null };
