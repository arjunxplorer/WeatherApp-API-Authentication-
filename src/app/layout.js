'use client';
import {Inter} from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthContextProvider } from "./context/AuthContext";

const inter= Inter({subsets: ["latin"]});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthContextProvider>
          <Navbar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
