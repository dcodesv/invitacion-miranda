import React from 'react';
import elemento1 from '../images/elemento1.png'; // Estrella plateada
import elemento2 from '../images/elemento2.png'; // Moño rosa
import elemento3 from '../images/elemento3.png'; // Corazón rosa metálico
import elemento4 from '../images/elemento4.png'; // Disco ball con moño
import elemento5 from '../images/elemento5.png'; // Vinilo
import elemento6 from '../images/elemento6.png'; // Guitarra eléctrica

export default function MirandaPatternBackground() {
  // Pre-configured distributed items across the grid for a natural aesthetic wallpaper pattern
  const patternItems = [
    // Column 1
    { src: elemento1, alt: 'Estrella', top: '4%', left: '5%', size: 'w-10 sm:w-12', rotate: '-15deg', opacity: 'opacity-40' },
    { src: elemento2, alt: 'Moño', top: '18%', left: '8%', size: 'w-11 sm:w-14', rotate: '12deg', opacity: 'opacity-35' },
    { src: elemento6, alt: 'Guitarra', top: '34%', left: '4%', size: 'w-12 sm:w-16', rotate: '-25deg', opacity: 'opacity-40' },
    { src: elemento3, alt: 'Corazón', top: '48%', left: '7%', size: 'w-10 sm:w-12', rotate: '15deg', opacity: 'opacity-40' },
    { src: elemento4, alt: 'Disco ball', top: '64%', left: '5%', size: 'w-11 sm:w-14', rotate: '-10deg', opacity: 'opacity-35' },
    { src: elemento5, alt: 'Vinilo', top: '78%', left: '8%', size: 'w-10 sm:w-12', rotate: '30deg', opacity: 'opacity-35' },
    { src: elemento1, alt: 'Estrella', top: '92%', left: '4%', size: 'w-10 sm:w-12', rotate: '20deg', opacity: 'opacity-35' },

    // Intermediate left
    { src: elemento4, alt: 'Disco ball', top: '10%', left: '16%', size: 'w-9 sm:w-11', rotate: '8deg', opacity: 'opacity-25' },
    { src: elemento5, alt: 'Vinilo', top: '26%', left: '18%', size: 'w-8 sm:w-10', rotate: '-15deg', opacity: 'opacity-25' },
    { src: elemento1, alt: 'Estrella', top: '42%', left: '15%', size: 'w-9 sm:w-11', rotate: '18deg', opacity: 'opacity-30' },
    { src: elemento2, alt: 'Moño', top: '58%', left: '17%', size: 'w-9 sm:w-12', rotate: '-12deg', opacity: 'opacity-25' },
    { src: elemento6, alt: 'Guitarra', top: '72%', left: '16%', size: 'w-10 sm:w-14', rotate: '22deg', opacity: 'opacity-25' },
    { src: elemento3, alt: 'Corazón', top: '86%', left: '18%', size: 'w-8 sm:w-10', rotate: '-8deg', opacity: 'opacity-30' },

    // Intermediate right
    { src: elemento3, alt: 'Corazón', top: '8%', right: '17%', size: 'w-9 sm:w-11', rotate: '-12deg', opacity: 'opacity-25' },
    { src: elemento6, alt: 'Guitarra', top: '24%', right: '15%', size: 'w-10 sm:w-14', rotate: '28deg', opacity: 'opacity-25' },
    { src: elemento4, alt: 'Disco ball', top: '40%', right: '18%', size: 'w-9 sm:w-11', rotate: '-20deg', opacity: 'opacity-25' },
    { src: elemento5, alt: 'Vinilo', top: '56%', right: '16%', size: 'w-8 sm:w-10', rotate: '15deg', opacity: 'opacity-25' },
    { src: elemento1, alt: 'Estrella', top: '70%', right: '18%', size: 'w-9 sm:w-11', rotate: '-15deg', opacity: 'opacity-30' },
    { src: elemento2, alt: 'Moño', top: '88%', right: '16%', size: 'w-9 sm:w-12', rotate: '10deg', opacity: 'opacity-25' },

    // Column right edge
    { src: elemento5, alt: 'Vinilo', top: '3%', right: '6%', size: 'w-10 sm:w-12', rotate: '-20deg', opacity: 'opacity-35' },
    { src: elemento4, alt: 'Disco ball', top: '16%', right: '5%', size: 'w-11 sm:w-14', rotate: '15deg', opacity: 'opacity-35' },
    { src: elemento1, alt: 'Estrella', top: '32%', right: '7%', size: 'w-10 sm:w-12', rotate: '-8deg', opacity: 'opacity-40' },
    { src: elemento2, alt: 'Moño', top: '46%', right: '4%', size: 'w-11 sm:w-14', rotate: '18deg', opacity: 'opacity-35' },
    { src: elemento6, alt: 'Guitarra', top: '62%', right: '6%', size: 'w-12 sm:w-16', rotate: '-22deg', opacity: 'opacity-40' },
    { src: elemento3, alt: 'Corazón', top: '76%', right: '5%', size: 'w-10 sm:w-12', rotate: '12deg', opacity: 'opacity-40' },
    { src: elemento4, alt: 'Disco ball', top: '90%', right: '7%', size: 'w-10 sm:w-13', rotate: '-10deg', opacity: 'opacity-35' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dark gradient base layer with subtle pink/purple ambient flares */}
      <div className="absolute inset-0 bg-[#0d0d11]" />

      {/* Subtle glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px]" />
      <div className="absolute top-2/3 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-[90px]" />

      {/* Floating mini element stickers in pattern layout */}
      {patternItems.map((item, index) => {
        const style = {
          position: 'absolute',
          top: item.top,
          ...(item.left ? { left: item.left } : {}),
          ...(item.right ? { right: item.right } : {}),
          transform: `rotate(${item.rotate})`,
        };

        return (
          <img
            key={index}
            src={item.src}
            alt={item.alt}
            style={style}
            className={`${item.size} h-auto ${item.opacity} transition-opacity duration-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter`}
            loading="lazy"
          />
        );
      })}
    </div>
  );
}
