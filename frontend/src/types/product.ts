interface ProductBase {
  name: string;
  price: number;
  unit: string;
  quantity: number;
  description: string;
}

export interface ProductFormData extends ProductBase {
  images: File[];
  category: string;
}

export interface Product extends ProductBase {
  category: {
    _id: string;
    name: string;
  };
  _id: string;
  seller: {
    _id: string;
    username: string;
    email: string;
  };
  images: {
    url: string;
    thumbnail: string;
    main: string;
    display: string;
    filename: string;
    size: number;
  }[];
}
