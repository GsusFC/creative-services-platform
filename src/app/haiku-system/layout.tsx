import type { Metadata } from 'next';
import '../globals.css';
import './styles/variables.css';

export const metadata: Metadata = {
  title: 'Haiku Flag System',
  description: 'Transform haikus into nautical flag compositions',
};

export default function HaikuSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white min-h-screen antialiased relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-70"></div>
      
      <main className="min-h-screen py-8">
        {children}
      </main>
      <footer className="py-4 text-center text-gray-400 text-sm">
        <p>HAIKU FLAG SYSTEM © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
