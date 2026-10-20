import { products } from '../data/products';

// Local data keeps the demo reliable and still gives the UI a real loading/error lifecycle.
export async function getProducts() {
  await new Promise((resolve) => window.setTimeout(resolve, 420));
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('The product catalogue is currently unavailable.');
  }
  return products;
}
