import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');  // Get the authentication token from cookies
  
  console.log('Intercepted path:', request.nextUrl.pathname);  // Debugging to see the requested path
  
  // If the user is not authenticated and is trying to access a restricted page (like /checkout),
  // redirect them to the login page.
  if (!token && request.nextUrl.pathname.startsWith('/checkout')) {
    return NextResponse.redirect(new URL('/login', request.url));  // Redirect to login if trying to access checkout without a token
  }

  // Allow access to public pages (login, products, homepage) without authentication.
  // These pages don't require the user to be logged in.
  if (!token && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.next();  // Allow access to the login page
  }

  if (!token && request.nextUrl.pathname.startsWith('/products')) {
    return NextResponse.next();  // Allow access to the products page
  }

  if (!token && request.nextUrl.pathname === '/') {
    return NextResponse.next();  // Allow access to the homepage
  }

  // If there's a token, let the user access any page, including restricted ones (checkout).
  // This ensures authenticated users can access the checkout page.
  if (token) {
    return NextResponse.next();  // Continue if the user is authenticated
  }

  // If no token is found and the user is not trying to access allowed pages, 
  // redirect them to login (this is a fallback, although not necessary in this case).
  return NextResponse.redirect(new URL('/login', request.url));  
}
