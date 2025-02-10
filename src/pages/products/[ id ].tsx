import { GetServerSideProps } from 'next';
import { fetchProductDetails } from '@/lib/api'; // Fetch single product by ID
import { ProductsType } from '@/lib/types';
import Layout from '@/components/Layout';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  let product: ProductsType | null = null;
  try {
    product = await fetchProductDetails(Number(id)); // Fetch product by ID
  } catch (error) {
    console.error('Error fetching product:', error);
  }

  return {
    props: {
      product,
    },
  };
};

interface ProductDetailProps {
  product: ProductsType | null;
}

const ProductDetailPage = ({ product }: ProductDetailProps) => {
  if (!product) return <div>Product not found</div>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-bold mb-6">{product.title}</h2>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-auto aspect-square object-cover rounded-lg"
        />
        <p className="text-lg mb-4">{product.description}</p>
        <p className="text-xl font-semibold mb-4">${product.price}</p>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
