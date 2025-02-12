'use client';

import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProductDetails, fetchProducts } from '@/lib/api'; // Fetch single product by ID
import { ProductsType } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { useState, useEffect } from 'react';


interface ProductDetailProps {
    onAddToCart: () => void;
    product: ProductsType | null; 
  }

// This will fetch all product IDs during build time
export const getStaticPaths: GetStaticPaths = async () => {
    try {
      const products = await fetchProducts();
      console.log('Products fetched in getStaticPaths:', products); // Debugging

      if (!Array.isArray(products)) {
        throw new Error('Products data is not an array');
      }
      const paths = products.map((product) => ({
        params: { id: product.id.toString() },
      }));
      console.log('Generated paths:', paths); 
  
      return {
        paths,
        fallback: 'blocking', // Can be 'true', 'false', or 'blocking'
      };
    } catch (error) {
      console.error('Error fetching product paths:', error);
      return { paths: [], fallback: 'blocking' };
    }
  };
  
  // Fetch the product details at build time
  export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params || {};  // Get the ID parameter
    
    if (!id) {
        console.error('ID is missing in params:', params);
        return {
          notFound: true, // Return 404 if `id` is missing
        };
      }
    
      try {
        const product = await fetchProductDetails(id.toString()); // Fetch product details by ID
        console.log('Product fetched in getStaticProps:', product);
        if (!product) {
            console.error('Product not found for ID:', id); 
          return {
            notFound: true, // Return 404 if product is not found
          };
        }
  
    return {
      props: {
        product,
      },
      revalidate: 60, // Enable Incremental Static Regeneration (ISR) every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    return {
      notFound: true, // Return 404 if there's an error
    };
  }
};



const ProductDetailPage = ({ product, onAddToCart }: ProductDetailProps) => {
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const { addProductToCart } = useCart();
    const [error, setError] = useState<string | null>(null);
    //const [productDetail, setProductDetail] = useState<ProductsType | null>(null);

    // If product is not found, show error message
  useEffect(() => {
    if (!product) {
      setError('Product not found');
    }
  }, [product]);

  // Handler to add product to cart and open the modal
  const handleAddToCart = async () => {
    if (product) {
      setIsAdding(true); // Set loading state to true before adding
      try {
        await addProductToCart(product);  // Assuming `addProductToCart` might be an async function
        setIsAdding(false);  // Set loading state to false once product is added
        onAddToCart();  // Trigger the modal to show after product is added
      } catch (error) {
        console.error("Error adding product to cart:", error);
        setIsAdding(false); // Set loading state to false even if there's an error
      }
    }
  };
  

  
    if (!product) {
      return <div>Product not found</div>;
    }

  
  if (error) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-100 rounded-lg">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (!product){
  return (
    <div className="text-center p-6">
        <h1 className="text-xl font-semibold">Product Not Found</h1>
        <p>The product you are looking for could not be found.</p>
      </div>
    );
  }

  return(
  <div className="container mx-auto p-6">
    
    {/* <button
      onClick={() => navigate(-1)}
      className="mb-6 bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600"
    >
      Back
    </button> */}

    <h2 className="text-4xl font-bold mb-6">{product.title}</h2>
    <img 
    src={product.imageUrl} 
    alt={product.title} 
    className="mb-4 w-full max-w-md mx-auto aspect-square object-cover rounded-lg shadow-lg"/>
    <p className="text-lg mb-4">{product.description}</p>
    <p className="text-xl font-semibold mb-4">${product.price}</p>

    <button
      onClick={handleAddToCart}
      disabled={isAdding} // Disable if product is not loaded
      className="bg-blue-500
                text-white py-2 
                px-6 rounded-md
                hover:bg-blue-600
                disabled:bg-gray-300 
                disabled:cursor-not-allowed"
                aria-label="Add to Cart"
                role="button"
                tabIndex={0}
    >
     {isAdding ? 'Adding...' : 'Add to Cart'} {/* Display "Adding..." when loading */}
     </button>
      
    </div>

  );
};

export default ProductDetailPage;
