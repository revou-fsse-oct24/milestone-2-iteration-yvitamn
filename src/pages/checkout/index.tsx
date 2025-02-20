
import { useAuth } from '@/hooks/useAuth';
import CheckoutPage from '@/components/CheckoutPage';
import CheckoutAuth from '@/components/CheckoutAuth';
//import { useRouter } from 'next/router';

const Checkout = () => {
  const { isAuthenticated } = useAuth(); // Use authentication context to check if user is authenticated
  //const router = useRouter();

  if (!isAuthenticated) {
    // If not authenticated, show CheckoutAuth component
    return <CheckoutAuth />;
  }
  
  
  // If user is not authenticated, show login or signup page
  return (
   <CheckoutPage />
  );
};


export default Checkout;