"use client";

import Image from 'next/image'

const logos = [
  { src: '/logos/Amazon.svg', alt: 'Amazon' },
  { src: '/logos/ETH Barcelón.svg', alt: 'ETH Barcelona' },
  { src: '/logos/Forbes.svg', alt: 'Forbes' },
  { src: '/logos/Metafactory.svg', alt: 'Metafactory' },
  { src: '/logos/Polygon.svg', alt: 'Polygon' },
  { src: '/logos/Polygonal Mind.svg', alt: 'Polygonal Mind' },
  { src: '/logos/Rarible.svg', alt: 'Rarible' },
]

export default function LogoSlider() {
  return (
    <div className="w-full bg-black pt-4 pb-12 sm:pt-6 sm:pb-16 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] sm:text-xs font-mono mb-4 sm:mb-6 text-white/40 uppercase tracking-[0.2em]">
          Trusted by industry leaders
        </p>
        <div className="relative w-screen left-[calc(-50vw+50%)] right-[calc(-50vw+50%)] overflow-hidden px-4 sm:px-8">
          <div className="flex space-x-8 sm:space-x-16 animate-slide md:hover:[animation-play-state:paused]">
            {/* Original set */}
            {logos.map((logo, i) => (
              <Image
                key={`logo-${i}`}
                src={logo.src}
                alt={logo.alt}
                width={112}
                height={112}
                className="h-24 sm:h-32 md:h-28 w-auto md:opacity-50 md:hover:opacity-100 opacity-100 transition-duration-300"
              />
            ))}
            {/* Duplicated set for continuous scroll */}
            {logos.map((logo, i) => (
              <Image
                key={`logo-dup-${i}`}
                src={logo.src}
                alt={logo.alt}
                width={112}
                height={112}
                className="h-24 sm:h-32 md:h-28 w-auto md:opacity-50 md:hover:opacity-100 opacity-100 transition-duration-300"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
