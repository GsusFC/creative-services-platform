import type { Metadata } from 'next';
import '../../styles/main.css';
import './styles/variables.css';
import { inter, drukText, geistMono, robotoMono } from '../fonts';

export const metadata: Metadata = {
  title: 'Graphic Flag System',
  description: 'Text to nautical flags transformation using international code',
};

export default function FlagSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-black text-white min-h-screen antialiased relative overflow-hidden ${inter.variable} ${geistMono.variable} ${drukText.variable} ${robotoMono.variable}`}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-70"></div>
      
      <main className="min-h-screen py-8">
        {children}
      </main>
      <footer className="py-4 text-center text-gray-400 text-sm">
        <p>NAUTICAL FLAG SYSTEM © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
