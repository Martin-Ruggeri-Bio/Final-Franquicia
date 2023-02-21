import { IUser } from 'app/entities/user/user.model';

export interface IClient {
  id: number;
  userName?: string | null;
  client?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
