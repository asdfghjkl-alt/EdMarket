interface ProductBase {
  name: string;
  price: number;
  quantity: number;
  description: string;
}

export interface ProductFormData extends ProductBase {
  images: File[];
}

export interface Product extends ProductBase {
  _id: string;
  images: {
    url: string;
    thumbnail: string;
    main: string;
    display: string;
    filename: string;
    size: number;
  }[];
}
