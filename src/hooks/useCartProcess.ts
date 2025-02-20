import { useState } from 'react';
import { useCart } from '@/hooks/useCart';


export const useCartProcess = () => {
    const {
      addedProducts,
      removeProductFromCart,
      updateProductQuantity,
      setCheckout,
      clearCart
    } = useCart();
  
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  
    // Handle quantity change
    const handleQuantityChange = (productId: string | number, increment: boolean) => {
      const product = addedProducts.find(item => item.id === productId);
      if (product) {
        const newQuantity = increment ? product.quantity + 1 : Math.max(product.quantity - 1, 1);
        updateProductQuantity(productId, newQuantity);
      }
    };
  
    // Handle remove product
    const handleRemoveProduct = (productId: string | number) => {
      removeProductFromCart(productId);
    };

  // Handle checkout
  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      // Simulating an API call or processing checkout
      // After processing, move to the checkout page or other post-checkout action
      setCheckout(true);
      // You can integrate real API call here to complete checkout
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Clear cart
  const handleClearCart = () => {
    clearCart();
  };

  return {
    addedProducts,
    handleQuantityChange,
    handleRemoveProduct,
    handleCheckout,
    isCheckoutLoading,
    handleClearCart
  };
};