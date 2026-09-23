import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { getGuests } from '../services/guestService';
import { EVENT_DETAILS } from '../data/initialGuests';
import { useImagePreloader } from '../hooks/useImagePreloader';
import AppLoader from '../components/AppLoader';

// Image assets matching InvitationCard
import lemonBranch from '../images/decoracion2.webp';
import lemonDecor from '../images/decoracion1.webp';
import florero from '../images/florero.webp';

export default function HomePage() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const { imagesLoaded, progress } = useImagePreloader();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    navigate(`/invitacion/${code.trim().toLowerCase()}`);
  };

  if (!imagesLoaded) {
    return <AppLoader progress={progress} message="Cargando experiencia..." />;
  }

  return (
    <div className="min-h-screen azulejo-pattern py-12 px-4 flex flex-col items-center justify-center">
      <div className="relative max-w-2xl w-full rounded-t-[5rem] sm:rounded-t-[8rem] md:rounded-t-[10rem] rounded-b-[2.5rem] bg-[#FFFDF9] shadow-2xl gold-double-border p-4 sm:p-8 md:p-10 text-center text-slate-800 overflow-hidden my-6">

        {/* Corner Asset 1: Top-Left Lemon Decor */}
        <img
          src={lemonBranch}
          alt="Decoración de limones"
          className="absolute -top-4 -left-4 sm:-top-4 sm:-left-4 w-28 sm:w-44 md:w-48 select-none pointer-events-none z-20 drop-shadow-md rotate-180"
        />

        {/* Corner Asset 2: Bottom-Right Lemon Branch */}
        <img
          src={lemonDecor}
          alt="Rama de limones"
          className="absolute -bottom-8 -right-10 sm:-bottom-14 sm:-right-14 w-28 sm:w-44 md:w-48 select-none pointer-events-none z-20 drop-shadow-md"
        />

        {/* Inner Filigree Border Frame */}
        <div className="border-2 border-[#98A98B] rounded-t-[4.2rem] sm:rounded-t-[7.2rem] md:rounded-t-[9.2rem] rounded-b-[2rem] p-6 sm:p-8 md:p-10 relative z-10 bg-white/40 backdrop-blur-xs space-y-6">

          {/* Top Vase Ornament */}
          <div className="flex justify-center items-center select-none">
            <img
              src={florero}
              alt="Florero"
              className="w-24 sm:w-28 h-auto drop-shadow-xs"
            />
          </div>

          {/* Title Section */}
          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#4A6B52]">
              ¡Celebración De Cumpleaños!
            </h1>
            <p className="font-script text-4xl sm:text-6xl text-[#C59B27] drop-shadow-xs my-1">
              Miranda · 10 Años
            </p>
            <p className="text-xs sm:text-sm text-[#4A6B52] font-sans font-semibold mt-2">
              15 de Noviembre, 2026 · 2:00 PM · Mi Casa
            </p>
          </div>

          {/* Code Input Box */}
          <div className="bg-[#FAF8F3]/90 p-5 sm:p-6 rounded-2xl border border-[#C59B27]/30 shadow-sm max-w-md mx-auto space-y-4">
            <h3 className="font-serif text-base sm:text-lg text-[#4A6B52] font-semibold">
              ¿Tienes un código de invitación?
            </h3>
            <form onSubmit={handleSearch} className="flex items-center gap-2 flex-col sm:flex-row">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingresa tu código"
                className="w-full sm:w-auto flex-1 px-4 py-3 bg-white rounded-xl border border-[#4A6B52]/30 text-sm outline-none focus:ring-2 focus:ring-[#4A6B52]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto text-center justify-center px-5 py-3 rounded-xl bg-[#4A6B52] hover:bg-[#3A4E42] text-white text-sm shadow-md flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>Ver invitación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Admin Link Footer */}
          <div className="pt-4 border-t border-[#C59B27]/20 flex items-center justify-center gap-4 text-xs text-[#4A6B52]">
            <Link to="/admin" className="hover:text-[#3A4E42] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#4A6B52]" />
              <span>Acceso Administrador</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
