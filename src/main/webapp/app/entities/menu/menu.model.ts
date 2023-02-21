export interface IMenu {
  id: number;
  nombre?: string | null;
  descripcion?: string | null;
  precio?: number | null;
  urlImagen?: string | null;
  activo?: boolean | null;
  creado?: string | null;
  actualizado?: string | null;
}

export type NewMenu = Omit<IMenu, 'id'> & { id: null };
