import React from "react";
import Link from "next/link";
import { Satisfy } from 'next/font/google';

const navigation = [
  { name: "About", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Licensing", href: "#" },
  { name: "Contact", href: "#" },
];

const satisfy = Satisfy({
  subsets: ['latin'],
  weight: '400',
});

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-4 md:rounded-t-2xl xl:py-6">
        <div className="space-y-4 sm:space-y-4">
          <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
            <Link href="/" className="flex items-center space-x-2">
              <p className={`${satisfy.className} text-gray-800 text-2xl text-center drop-shadow-md dark:text-gray-50`}>
                CodeScribe ai
              </p>
            </Link>
            <ul className="mb-2 flex flex-wrap items-center font-medium sm:mb-0">
              {navigation.map((item) => {
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="me-4 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 md:me-6"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-center uppercase mt-20 text-5xl md:text-9xl lg:text-[12rem] xl:text-[13rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 dark:from-neutral-950 to-neutral-200 dark:to-neutral-800 inset-x-0">
            CodeScribe
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
