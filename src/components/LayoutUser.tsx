
import Navbar from '@/layout/Navbar';

import Footer from '@/layout/Footer';

const LayoutUser = ({ 
    children
 }: { 
    children: React.ReactNode
    
}) => {

  return (
    <div>
      {/* Pass categories to the Navbar */}
      <Navbar/>
      
      {/* <Header /> */}
      
      <main className="flex-grow">{children}</main>


      <Footer/>

    </div>
  );
};

export default LayoutUser;
