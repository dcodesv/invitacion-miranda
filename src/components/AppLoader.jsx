import React from 'react';
import { Sparkles } from 'lucide-react';
import florero from '../images/florero.webp';
import lemon from '../images/lemon.webp';

export default function AppLoader({ progress = 0, message = "Cargando experiencia..." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F3885] azulejo-pattern transition-opacity duration-500">
      <div className="relative w-full max-w-sm rounded-t-[4rem] rounded-b-[2.5rem] bg-[#FAF8F3] shadow-2xl gold-double-border p-6 text-center text-slate-800 overflow-hidden space-y-5">
        
        {/* Top Vase Graphic with Pulse Effect */}
        <div className="relative flex justify-center items-center py-2">
          <div className="absolute w-24 h-24 rounded-full bg-[#C59B27]/10 animate-ping"></div>
          <img
            src={florero}
            alt="Cargando..."
            className="w-20 h-auto relative z-10 drop-shadow-md animate-bounce duration-1000"
          />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[#C59B27] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebración de Cumpleaños</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-serif text-xl text-[#4A6B52] font-bold">
            Miranda · 10 Años
          </h2>
        </div>

        {/* Message */}
        <p className="text-xs text-[#4A6B52] font-sans font-medium">
          {message}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5 max-w-xs mx-auto">
          <div className="w-full h-2.5 bg-[#98A98B]/20 rounded-full overflow-hidden border border-[#98A98B]/30 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#C59B27] to-[#4A6B52] rounded-full transition-all duration-300"
              style={{ width: `${Math.max(10, progress)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-[#4A6B52] font-semibold px-1">
            <span>Amalfi Style</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
