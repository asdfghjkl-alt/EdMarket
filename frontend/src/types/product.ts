export interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  image: string;
}
export interface Product extends ProductFormData {
  _id: string;
}
