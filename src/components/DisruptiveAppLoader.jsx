import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import cartonDark from '../images/carton_dark.webp';
import elemento1 from '../images/elemento1.png'; // Silver star balloon
import elemento5 from '../images/elemento5.png'; // Vinyl record Limited Edition
import elemento6 from '../images/elemento6.png'; // Electric guitar sticker

export default function DisruptiveAppLoader({ progress = 0, message = "Getting your VIP Tour Passes ready..." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0d11] transition-opacity duration-500 font-mansalva">
      <div
        style={{
          backgroundImage: `url(${cartonDark})`,
          backgroundColor: '#1f1f24',
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
          backgroundPosition: 'center',
        }}
        className="relative w-full max-w-sm rounded-3xl shadow-2xl shadow-rockPink/20 border-4 border-rockPink/80 p-6 text-center text-slate-100 overflow-hidden space-y-4 bg-zinc-900"
      >
        <div className="bg-zinc-950/90 rounded-2xl p-5 border-2 border-rockPink/40 shadow-md space-y-4">

          {/* Animated Vinyl & Guitar Graphics instead of banner */}
          <div className="relative flex justify-center items-center py-4 min-h-[160px]">
            <div className="absolute w-32 h-32 rounded-full bg-rockPink-500/15 animate-ping"></div>

            {/* Rotating Vinyl Record (Elemento 5) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="relative z-10 w-28 h-28 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
            >
              <img
                src={elemento5}
                alt="Miranda Vinyl Record"
                className="w-full h-full object-contain select-none"
              />
            </motion.div>

            {/* Rock Electric Guitar crossing over the vinyl (Elemento 6) */}
            <motion.div
              animate={{
                y: [0, -6, 0, 5, 0],
                rotate: [-20, -14, -20, -25, -20],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute z-20 -bottom-1 -right-1 w-24 h-24 drop-shadow-[0_10px_16px_rgba(250,163,182,0.4)] pointer-events-none"
            >
              <img
                src={elemento6}
                alt="Miranda Rock Guitar"
                className="w-full h-full object-contain select-none"
              />
            </motion.div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-rockPink text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE OFFICIAL TOUR</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-2xl text-white font-extrabold font-mansalva drop-shadow-[0_2px_8px_rgba(250,163,182,0.6)]">
              Miranda's 10th Birthday Tour
            </h2>
          </div>

          {/* Message */}
          <p className="text-sm text-rockPink-300 font-bold">
            {message}
          </p>

          {/* Progress Bar */}
          <div className="space-y-1.5 max-w-xs mx-auto">
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-rockPink/40 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-rockPink via-rockPink-300 to-rockPink-200 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(10, progress)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-rockPink font-bold px-1">
              <span>0% 🎸</span>
              <span>{progress}% 💖</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
