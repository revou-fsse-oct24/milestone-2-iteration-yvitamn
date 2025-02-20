import { renderHook } from '@testing-library/react';
import { useNavbar } from '@/hooks/useNavbar';
import { fetchCategories } from '@/lib/api';
import { usePathname } from 'next/navigation';
import { waitFor } from '@testing-library/react'; // Import waitFor

// Mock fetchCategories and usePathname
jest.mock('@/lib/api', () => ({
  fetchCategories: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('useNavbar', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    (fetchCategories as jest.Mock).mockReset();
    (usePathname as jest.Mock).mockReset();
  });

  it('should fetch categories on mount and update state', async () => {
    // Mocking the fetchCategories to return some mock categories
    const mockCategories = [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ];
    (fetchCategories as jest.Mock).mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useNavbar());

    // Wait for categories to be fetched
    await waitFor(() => {
      // Check that categories were updated
      expect(result.current.categories).toEqual(mockCategories);
    });
  });

  it('should handle pathname and return correct active class', () => {
    // Mocking the pathname
    (usePathname as jest.Mock).mockReturnValue('/products');

    const { result } = renderHook(() => useNavbar());

    // Test isActive function when path matches
    expect(result.current.isActive('/products')).toBe('text-gray-300');
    expect(result.current.isActive('/categories')).toBe('hover:text-gray-300');
  });

  it('should not update categories if fetching fails', async () => {
    // Mock fetchCategories to throw an error
    (fetchCategories as jest.Mock).mockRejectedValue(new Error('Failed to fetch categories'));

    const { result } = renderHook(() => useNavbar());

    // Wait for the next update (error scenario)
    await waitFor(() => {
      // After the error, categories should remain empty
      expect(result.current.categories).toEqual([]);
    });
  });
});
