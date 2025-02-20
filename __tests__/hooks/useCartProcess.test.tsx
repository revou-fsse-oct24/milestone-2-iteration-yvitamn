import { renderHook, act } from '@testing-library/react';
import { useCartProcess } from '@/hooks/useCartProcess';
import { useCart } from '@/hooks/useCart';

// Mocking the useCart hook
jest.mock('@/hooks/useCart', () => ({
  useCart: jest.fn()
}));

describe('useCartProcess', () => {
  let mockSetCheckout: jest.Mock;
  let mockUpdateProductQuantity: jest.Mock;
  let mockRemoveProductFromCart: jest.Mock;
  let mockClearCart: jest.Mock;

  beforeEach(() => {
    mockSetCheckout = jest.fn();
    mockUpdateProductQuantity = jest.fn();
    mockRemoveProductFromCart = jest.fn();
    mockClearCart = jest.fn();

    // Setting up mock values for useCart
    (useCart as jest.Mock).mockReturnValue({
      addedProducts: [{ id: 1, title: 'Product 1', price: 100, quantity: 1 }],
      removeProductFromCart: mockRemoveProductFromCart,
      updateProductQuantity: mockUpdateProductQuantity,
      setCheckout: mockSetCheckout,
      clearCart: mockClearCart,
    });
  });

  it('should handle quantity change', () => {
    const { result } = renderHook(() => useCartProcess());

    // Initial quantity is 1
    expect(result.current.addedProducts[0].quantity).toBe(1);

    // Simulate incrementing quantity
    act(() => {
      result.current.handleQuantityChange(1, true);
    });
    expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, 2); // The new quantity should be 2

    // Simulate decrementing quantity
    act(() => {
      result.current.handleQuantityChange(1, false);
    });
    expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, 1); // The new quantity should be 1 (minimum)
  });

  it('should handle remove product', () => {
    const { result } = renderHook(() => useCartProcess());

    // Simulate removing a product
    act(() => {
      result.current.handleRemoveProduct(1);
    });

    expect(mockRemoveProductFromCart).toHaveBeenCalledWith(1);
  });

  it('should handle checkout', async () => {
    const { result } = renderHook(() => useCartProcess());

    // Simulate checkout
    act(() => {
      result.current.handleCheckout();
    });

    // Check if loading state is set and checkout is triggered
    expect(result.current.isCheckoutLoading).toBe(true);

    // Since handleCheckout involves async, we simulate the waiting for API call
    await act(async () => {
      // Wait for the async operation to finish
      await Promise.resolve();
    });

    // After the async operation, check if checkout was set and loading state is false
    expect(mockSetCheckout).toHaveBeenCalledWith(true);
    expect(result.current.isCheckoutLoading).toBe(false);
  });

  it('should handle clear cart', () => {
    const { result } = renderHook(() => useCartProcess());

    // Simulate clearing the cart
    act(() => {
      result.current.handleClearCart();
    });

    expect(mockClearCart).toHaveBeenCalled();
  });
});
