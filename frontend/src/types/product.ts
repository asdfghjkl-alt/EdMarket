export interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
}
export interface Product extends ProductFormData {
  _id: string;
}
