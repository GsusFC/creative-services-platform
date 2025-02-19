'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/services', label: 'SERVICES' },
  { href: '/work', label: 'WORK' },
  { href: '/process', label: 'PROCESS' }
];

const rgbGradient = 'linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(255, 0, 0) 14.12%, rgb(0, 255, 0) 51.80%, rgb(0, 0, 255) 89.37%, rgb(0, 0, 0) 101.35%)';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className="relative group">
        <span 
          className={`text-[13px] font-medium font-mono uppercase transition-colors duration-300 ${isActive ? 'text-[#00ff00]' : 'text-white/75 group-hover:text-white'}`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-black'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: rgbGradient }} />
      
      <div className="w-full h-[80px] flex items-center justify-between pl-[40px]">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5"
        >
          <motion.span
            animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 6 : 0 }}
            className="w-6 h-0.5 bg-white transition-colors"
          />
          <motion.span
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            className="w-6 h-0.5 bg-white transition-colors"
          />
          <motion.span
            animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -6 : 0 }}
            className="w-6 h-0.5 bg-white transition-colors"
          />
        </button>

        {/* Logo */}
        <Link 
          href="/" 
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${isMenuOpen ? 'md:scale-100 scale-0' : 'scale-100'}`}
        >
          <Image
            src="/assets/icons/logo.svg"
            alt="FLOC Logo"
            width={40}
            height={40}
            priority
            className="transition-transform duration-300 hover:scale-110"
          />
        </Link>

        {/* Start Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/start"
            className="hidden md:flex justify-center items-center w-[200px] h-[80px] bg-[#00ff00] text-[13px] font-medium text-black font-mono uppercase gap-[10px] hover:bg-[#00ff00]/90 transition-all duration-300 hover:tracking-wider"
          >
            START
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black pt-[80px] z-40 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 pt-12">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NavLink {...link} />
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Link
                  href="/start"
                  className="inline-flex justify-center items-center px-8 py-4 bg-[#00ff00] text-[13px] font-medium text-black font-mono uppercase gap-[10px] hover:bg-[#00ff00]/90 transition-all duration-300 hover:tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  START
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
