import { GetServerSideProps } from 'next';
import { fetchProductsByCategory } from '@/lib/api'; // Fetch products by category
import { ProductsType } from '@/lib/types';
import { useCategories } from '@/hooks/useCategories';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  let products: ProductsType[] = [];

  try {
    products = await fetchProductsByCategory(id); // Fetch products for the selected category
  } catch (error) {
    console.error('Error fetching products by category:', error);
  }

  return {
    props: {
      products,
      categoryId: id,
    },
  };
};

interface CategoryPageProps {
  products: ProductsType[];
  categoryId: string;
}

const CategoryPage = ({ products, categoryId }: CategoryPageProps) => {
  const { data: categories, loading, error } = useCategories('all');
  const router = useRouter();

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-6">Products in Category</h2>

      <div className="mb-4">
        <select
          value={categoryId}
          onChange={(e) => {
            const categoryId = e.target.value;
            router.push(`/products/category/${categoryId}`);
          }}
        >
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg">
              <Link href={`/products/category/${categoryId}/${product.id}`}>
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-auto aspect-square object-cover rounded-lg"
                />
                <h3 className="text-xl mt-4">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
