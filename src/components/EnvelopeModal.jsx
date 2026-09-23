import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

// Image assets matching InvitationCard & HomePage
import lemonBranch from '../images/decoracion2.webp';
import lemonDecor from '../images/decoracion1.webp';
import florero from '../images/florero.webp';
import envelopeImg from '../images/envelope.webp';
import carton from '../images/carton.webp';
export default function EnvelopeModal({ guestName, onOpen }) {
  const [isOpening, setIsOpening] = useState(false);

  const triggerLemonConfetti = () => {
    try {
      // Create custom emoji confetti shapes
      const lemon = confetti.shapeFromText({ text: '🍋', scalar: 3 });
      const leaf = confetti.shapeFromText({ text: '🍃', scalar: 3 });
      const greenHeart = confetti.shapeFromText({ text: '💚', scalar: 3 });
      const flower = confetti.shapeFromText({ text: '🌼', scalar: 3 });
      const sparkle = confetti.shapeFromText({ text: '✨', scalar: 3 });

      const customShapes = [lemon, leaf, greenHeart, flower, sparkle];

      // Left blast
      confetti({
        particleCount: 30,
        spread: 80,
        origin: { x: 0.2, y: 0.5 },
        shapes: customShapes,
        scalar: 2.8,
      });

      // Right blast
      confetti({
        particleCount: 30,
        spread: 80,
        origin: { x: 0.8, y: 0.5 },
        shapes: customShapes,
        scalar: 2.8,
      });

      // Center explosion burst
      setTimeout(() => {
        confetti({
          particleCount: 45,
          spread: 120,
          origin: { x: 0.5, y: 0.4 },
          shapes: customShapes,
          scalar: 3.2,
        });
      }, 250);
    } catch (e) {
      console.log('Confetti error:', e);
    }
  };

  const handleOpenClick = () => {
    setIsOpening(true);
    triggerLemonConfetti();
    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, type: 'spring' }}
        style={{
          background: `url(${carton})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="relative w-full max-w-md rounded-t-[4rem] sm:rounded-t-[5rem] rounded-b-[2.5rem] shadow-2xl gold-double-border p-4 sm:p-6 text-center text-slate-800 overflow-hidden my-4"
      >
        {/* Corner Asset 1: Top-Left Lemon Decor */}
        <img
          src={lemonBranch}
          alt="Decoración de limones"
          className="absolute -top-4 -left-4 w-28 sm:w-36 select-none pointer-events-none z-20 drop-shadow-md rotate-180"
        />

        {/* Corner Asset 2: Bottom-Right Lemon Branch */}
        <img
          src={lemonDecor}
          alt="Rama de limones"
          className="absolute -bottom-6 -right-6 w-28 sm:w-36 select-none pointer-events-none z-20 drop-shadow-md"
        />

        {/* Inner Filigree Border Frame */}
        <div className="border-2 border-[#98A98B] rounded-t-[3.2rem] sm:rounded-t-[4.2rem] rounded-b-[2rem] p-5 sm:p-7 relative z-10 bg-white/40 backdrop-blur-xs">

          {/* Top Ornament Vase */}
          <img
            src={florero}
            alt="Florero"
            className="w-20 h-auto mx-auto mb-2 select-none drop-shadow-xs"
          />
          <h2 className="font-script text-4xl text-[#C59B27] px-2 drop-shadow-xs">
            Invitación Especial
          </h2>

          {/* Envelope Asset Action */}
          <motion.div
            animate={isOpening ? { scale: [1, 1.15, 0], rotate: [0, 5, -5, 0] } : { scale: 1 }}
            transition={{ duration: 0.9 }}
            onClick={handleOpenClick}
            className="group relative cursor-pointer inline-flex flex-col items-center justify-center my-6"
          >
            {/* Envelope Graphic Image */}
            <img
              src={envelopeImg}
              alt="Sobre de Invitación"
              className="w-80 h-auto drop-shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:cursor-pointer select-none"
            />

            <div className="flex items-center gap-1 text-sm text-[#C59B27] font-semibold mt-3 bg-[#FFF9E5] px-3.5 py-1 rounded-full border border-[#C59B27]/40 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Toca para abrir</span>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
