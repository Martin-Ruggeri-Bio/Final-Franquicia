import dayjs from 'dayjs/esm';
import { IClient } from 'app/entities/client/client.model';

export interface ISale {
  id: number;
  total?: number | null;
  date?: dayjs.Dayjs | null;
  client?: Pick<IClient, 'id'> | null;
}

export type NewSale = Omit<ISale, 'id'> & { id: null };
