import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-0 py-8 border-t border-sky-500/20 bg-zinc-950 text-center text-xs text-sky-300/80 space-y-2">
      <div className="flex items-center justify-center gap-2">
        <span className="h-px w-10 bg-sky-500/30"></span>
        <span className="text-sm">🎸</span>
        <span className="h-px w-10 bg-sky-500/30"></span>
      </div>

      <p className="font-mansalva text-sm font-semibold text-sky-400">
        Miranda · 10th Birthday
      </p>

      <p className="flex items-center justify-center gap-1 text-[11px] font-mansalva text-zinc-400">
        <span>Made with</span>
        <Heart className="w-3.5 h-3.5 text-sky-400 fill-sky-400 inline" />
        <span>for you</span>
      </p>
    </footer>
  );
}
