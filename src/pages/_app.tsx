'use client';

import React from 'react';
import type { AppProps } from 'next/app';
import { AuthenticateProvider } from '@/lib/contexts/AuthenticateProvider';
import { CartProvider } from '@/lib/contexts/CartProvider';
import LayoutUser from '@/components/LayoutUser';
import '@/styles/globals.css'; 




function MyApp({ Component, pageProps }: AppProps) {
  

  return (
    <AuthenticateProvider>     
      <CartProvider>

        {/* <Navbar />
       <header className="flex flex-col min-h-screen">
        <Header />
       </header> */}
        <LayoutUser>
        {/* <main className="flex-grow"> */}
        <Component {...pageProps} />
        {/* </main> */}
        </LayoutUser>
        {/* <footer className="mt-auto">
        <Footer />
        </footer> */}

      </CartProvider>      
    </AuthenticateProvider>
  );
}

export default MyApp;