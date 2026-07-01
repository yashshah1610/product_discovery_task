/* src/types/index.ts */

export interface Product {
  id: number;
  title: string;
  brand: string | null;
  category: string | null;
  tags: string[];
  price: number | string | null;
  rating: number | null;
  reviews: number;
  inStock: boolean;
  releasedAt: string | null;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  description: string | null;
  cleanPrice?: number | null;
}

export interface FilterState {
  category: string;
  selectedBrands: string[];
  minPrice: number | '';
  maxPrice: number | '';
  minRating: number;
  inStockOnly: boolean;
}
