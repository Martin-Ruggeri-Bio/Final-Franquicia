import { IDetails, NewDetails } from './details.model';

export const sampleWithRequiredData: IDetails = {
  id: 53202,
};

export const sampleWithPartialData: IDetails = {
  id: 99466,
  amount: 35727,
};

export const sampleWithFullData: IDetails = {
  id: 84170,
  amount: 65744,
};

export const sampleWithNewData: NewDetails = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
