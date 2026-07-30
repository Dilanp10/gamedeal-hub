export interface Deal {
  store: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  discountPercentage: number;
  dealUrl: string;
}
