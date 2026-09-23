import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-porcelain/95 backdrop-blur-md border-b border-sage/20 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Admin Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sage text-white flex items-center justify-center text-sm font-serif font-bold shadow-xs">
            🍋
          </div>
          <div>
            <span className="font-serif font-bold text-sage text-base md:text-lg block leading-none">
              Panel de Administración
            </span>
            <span className="text-[10px] text-sage font-sans tracking-wider uppercase block">
              Gestión de Invitados · 15 de Noviembre 2026
            </span>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-sage/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Sitio</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
