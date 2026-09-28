import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { globalAudio } from '../services/audioManager';

import cartonDark from '../images/carton_dark.webp';
import elemento1 from '../images/elemento1.png'; // Silver star balloon
import elemento2 from '../images/elemento2.png'; // Pink bow
import elemento5 from '../images/elemento5.png'; // Vinyl record Limited Edition
import elemento6 from '../images/elemento6.png'; // Electric guitar sticker

export default function DisruptiveEnvelopeModal({ guestName, onOpen }) {
  const [isOpening, setIsOpening] = useState(false);

  const triggerRockConfetti = () => {
    try {
      const star = confetti.shapeFromText({ text: '⭐', scalar: 3 });
      const pinkHeart = confetti.shapeFromText({ text: '💖', scalar: 3 });
      const guitar = confetti.shapeFromText({ text: '🎸', scalar: 3 });
      const blackHeart = confetti.shapeFromText({ text: '🖤', scalar: 3 });
      const lightning = confetti.shapeFromText({ text: '⚡', scalar: 3 });
      const disc = confetti.shapeFromText({ text: '🪩', scalar: 3 });

      const customShapes = [star, pinkHeart, guitar, blackHeart, lightning, disc];

      // Left burst
      confetti({
        particleCount: 35,
        spread: 90,
        origin: { x: 0.25, y: 0.5 },
        shapes: customShapes,
        scalar: 3,
        colors: ['#FAA3B6', '#F47B95', '#FFFFFF', '#000000', '#FFAFBF'],
      });

      // Right burst
      confetti({
        particleCount: 35,
        spread: 90,
        origin: { x: 0.75, y: 0.5 },
        shapes: customShapes,
        scalar: 3,
        colors: ['#FAA3B6', '#F47B95', '#FFFFFF', '#000000', '#FFAFBF'],
      });

      // Center explosion
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 130,
          origin: { x: 0.5, y: 0.4 },
          shapes: customShapes,
          scalar: 3.5,
          colors: ['#FAA3B6', '#F47B95', '#FFFFFF', '#000000', '#FFAFBF'],
        });
      }, 200);
    } catch (e) {
      console.log('Confetti error:', e);
    }
  };

  const handleOpenClick = () => {
    // Unconditionally unlock and play audio synchronously within user touch/click gesture
    globalAudio.unlockAndPlay();
    setIsOpening(true);
    triggerRockConfetti();
    setTimeout(() => {
      onOpen();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, type: 'spring' }}
        style={{
          backgroundImage: `url(${cartonDark})`,
          backgroundColor: '#1f1f24',
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
          backgroundPosition: 'center',
        }}
        className="relative w-full max-w-md rounded-3xl shadow-2xl shadow-rockPink/20 border-4 border-rockPink/80 p-4 sm:p-6 text-center text-slate-100 overflow-visible my-4 font-mansalva bg-zinc-950"
      >
        {/* Floating Star in modal corner */}
        <motion.img
          src={elemento1}
          alt="Estrella"
          animate={{ rotate: [-10, 10, -10], y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6 -left-5 w-16 sm:w-20 select-none pointer-events-none z-20 drop-shadow-lg"
        />

        {/* Floating Bow in modal corner */}
        <motion.img
          src={elemento2}
          alt="Moño"
          animate={{ scale: [1, 1.08, 1], rotate: [5, -5, 5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6 -right-5 w-16 sm:w-20 select-none pointer-events-none z-20 drop-shadow-lg"
        />

        {/* Inner Card Container */}
        <div className="bg-zinc-900/95 rounded-2xl p-5 sm:p-6 border-2 border-rockPink/40 shadow-xl relative z-10 space-y-4">

          {/* Header Title */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-rockPink uppercase tracking-widest block">
              ⚡ YOU'RE INVITED TO THE TOUR! ⚡
            </span>
            <h2 className="text-3xl sm:text-4xl text-white font-extrabold font-mansalva drop-shadow-[0_2px_10px_rgba(250,163,182,0.6)]">
              Miranda's 10th Birthday Tour
            </h2>
          </div>

          {/* Rock Vinyl & Guitar Interactive Action Asset (Elemento 5 & 6) */}
          <motion.div
            animate={
              isOpening
                ? { scale: [1, 1.25, 0], rotate: [0, -10, 20, 360] }
                : {
                  y: [0, -6, 0, 5, 0],
                  scale: [1, 1.02, 1],
                }
            }
            transition={
              isOpening
                ? { duration: 0.9, ease: 'backIn' }
                : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenClick}
            className="group relative cursor-pointer inline-flex flex-col items-center justify-center my-3 w-full"
          >
            {/* Vinyl & Guitar interactive stage */}
            <div className="relative flex items-center justify-center w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-b from-rockPink-500/20 via-black/80 to-purple-950/40 border-2 border-rockPink/40 p-4 shadow-2xl group-hover:border-rockPink group-hover:shadow-[0_0_25px_rgba(250,163,182,0.5)] transition-all">
              
              {/* Rotating Vinyl Record (Elemento 5) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-40 h-40 sm:w-44 sm:h-44 select-none"
              >
                <img
                  src={elemento5}
                  alt="Miranda Vinyl Record"
                  className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] group-hover:brightness-110 transition-all"
                />
              </motion.div>

              {/* Electric Guitar overlay (Elemento 6) */}
              <motion.img
                src={elemento6}
                alt="Miranda Rock Electric Guitar"
                animate={{
                  rotate: [-24, -18, -24, -28, -24],
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -right-2 sm:-right-4 -bottom-1 w-32 sm:w-36 drop-shadow-[0_10px_16px_rgba(250,163,182,0.5)] select-none pointer-events-none group-hover:scale-105 transition-transform"
              />

              {/* Central Glow */}
              <div className="absolute inset-0 rounded-full bg-rockPink/10 blur-xl group-hover:bg-rockPink/20 transition-all pointer-events-none"></div>
            </div>

            {/* Action Pill Badge */}
            <div className="flex items-center gap-1.5 text-sm sm:text-base text-rockPink-200 font-bold mt-4 bg-rockPink-500/30 px-6 py-2.5 rounded-full border border-rockPink-400/60 shadow-lg group-hover:bg-rockPink-500/50 group-hover:text-white group-hover:shadow-rockPink/30 transition-all">
              <Sparkles className="w-4 h-4 text-rockPink animate-spin" />
              <span>Tap here to open your invitation! 🎸</span>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
