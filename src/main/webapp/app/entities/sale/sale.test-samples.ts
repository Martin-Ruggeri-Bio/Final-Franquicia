import dayjs from 'dayjs/esm';

import { ISale, NewSale } from './sale.model';

export const sampleWithRequiredData: ISale = {
  id: 89826,
};

export const sampleWithPartialData: ISale = {
  id: 19735,
  date: dayjs('2023-02-21'),
};

export const sampleWithFullData: ISale = {
  id: 2520,
  total: 78708,
  date: dayjs('2023-02-21'),
};

export const sampleWithNewData: NewSale = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
