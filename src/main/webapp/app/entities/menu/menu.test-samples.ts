import { IMenu, NewMenu } from './menu.model';

export const sampleWithRequiredData: IMenu = {
  id: 56082,
};

export const sampleWithPartialData: IMenu = {
  id: 29833,
  nombre: 'sensor Algodón',
  descripcion: 'payment Sudán Guapo',
  activo: true,
};

export const sampleWithFullData: IMenu = {
  id: 27631,
  nombre: 'Gerente',
  descripcion: 'Futuro Ladrillo',
  precio: 3846,
  urlImagen: 'Especialista Especialista wireless',
  activo: true,
  creado: 'conjunto Directo fritas',
  actualizado: 'back Funcionario Adaptativo',
};

export const sampleWithNewData: NewMenu = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
