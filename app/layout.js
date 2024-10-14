import { Fugaz_One, Open_Sans } from 'next/font/google'

import "./globals.css";
import Link from 'next/link';
import { AuthProvider } from '@/context/AuthContext';
import Logout from '@/components/Logout';

const OpenSans = Open_Sans({ subsets: ['latin'] })
const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] })


export const metadata = {
  title: "Broodl",
  description: "A tool to help you monitor and manage your daily activities",
};

const header = (

  <header className=" p-4 sm:p-8 flex items-center justify-between gap-4">
    <Link href={'/'}>
      <h1 className={'text-gradient text-base sm:text-lg  ' + fugaz.className}>Broodl</h1>
    </Link>
    <Logout />
  </header>
)

const footer = (
  <footer className=' p-4 sm:p-8 grid place-items-center '>
    <p className={'text-indigo-400  ' + fugaz.className}>Created with ❤ </p>
  </footer>
)


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={` w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-800 ` + OpenSans.className} >
          {header}
          {children}
          {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
