export interface IPost {
  id?: string;
  title: string;
  categoryId: string;
  description: string;
  categoryName?: string;
}

export interface CRUDAction<T> {
  action: 'add' | 'update' | 'delete';
  data: T;
}
