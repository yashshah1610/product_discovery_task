import ProductCatalog from '@/components/ProductCatalog';
import productsData from '@/data/items.json';
import { Product } from '@/types';

// Cast the JSON import to Product[] type
const products = productsData as Product[];

export default function Home() {
  return (
    <main>
      <ProductCatalog rawProducts={products} />
    </main>
  );
}
