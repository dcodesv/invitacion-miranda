import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Navigation, Sparkles, Heart, Volume2, VolumeX } from 'lucide-react';
import { EVENT_DETAILS } from '../data/initialGuests';
import CountdownTimer from './CountdownTimer';

// Image assets matching ejemplo.jpg
import lemonBranch from '../images/decoracion2.webp';
import lemonDecor from '../images/decoracion1.webp';
import lemonFruit from '../images/lemon.webp';
import florero from '../images/florero.webp';
import carton from '../images/carton.webp';

export default function InvitationCard({ guest }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  // Lazy load audio source on-demand
  const ensureAudioSource = () => {
    if (!audioRef.current) return null;
    const audioEl = audioRef.current;
    if (!audioEl.src || !audioEl.src.includes('music_background.webm')) {
      audioEl.src = '/audio/music_background.webm';
      audioEl.load();
    }
    audioEl.volume = 1;
    return audioEl;
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const audioEl = audioRef.current;

    // Reiniciar el audio al llegar exactamente a 1 min 31 seg (91 segundos)
    const MAX_AUDIO_SECONDS = 91; // 1:31 min

    const handleTimeUpdate = () => {
      if (audioEl.currentTime >= MAX_AUDIO_SECONDS) {
        audioEl.currentTime = 0;
        audioEl.play().catch(() => { });
      }
    };

    audioEl.addEventListener('timeupdate', handleTimeUpdate);

    // Non-blocking lazy audio trigger after render idle
    const lazyAudioTimer = setTimeout(() => {
      const el = ensureAudioSource();
      if (el) {
        el.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
            const handleUserGesture = () => {
              const activeEl = ensureAudioSource();
              if (activeEl) {
                activeEl.play().then(() => setIsPlaying(true)).catch(() => { });
              }
              window.removeEventListener('click', handleUserGesture);
              window.removeEventListener('touchstart', handleUserGesture);
            };
            window.addEventListener('click', handleUserGesture);
            window.addEventListener('touchstart', handleUserGesture);
          });
      }
    }, 400);

    return () => {
      clearTimeout(lazyAudioTimer);
      audioEl.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const el = ensureAudioSource();
      if (el) {
        el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const generateGoogleCalendarLink = () => {
    const title = encodeURIComponent("¡Cumpleaños de Miranda (10 años)! 🎸🖤💖");
    const details = encodeURIComponent(`Celebración de Cumpleaños de Miranda en ${EVENT_DETAILS.locationName}`);
    const location = encodeURIComponent(EVENT_DETAILS.locationFull);
    const dates = "20260815T213000Z/20260816T033000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${carton})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px',
        backgroundPosition: 'center',
      }}
      className="relative w-full max-w-2xl mx-auto rounded-t-[5rem] sm:rounded-t-[8rem] md:rounded-t-[10rem] rounded-b-[2.5rem] shadow-2xl gold-double-border my-6 md:my-10 mb-0 md:mb-10 p-4 sm:p-8 md:p-10 text-center text-slate-800 relative overflow-hidden">

      {/* Lazy-loaded non-blocking Background Audio */}
      <audio
        ref={audioRef}
        loop
        preload="none"
      />

      {/* Corner Asset 1: Top-Left Lemon Decor (decoración.png) */}
      <img
        src={lemonBranch}
        alt="Decoración de limones"
        className="absolute -top-4 -left-4 sm:-top-4 sm:-left-4 w-28 sm:w-44 md:w-48 select-none pointer-events-none z-20 drop-shadow-md rotate-180"
      />

      {/* Corner Asset 2: Bottom-Right Lemon Branch (decoración2.png) */}
      <img
        src={lemonDecor}
        alt="Rama de limones"
        className="absolute -bottom-8 -right-10 sm:-bottom-14 sm:-right-14 w-28 sm:w-44 md:w-48 select-none pointer-events-none z-20 drop-shadow-md"
      />

      {/* Inner Filigree Border Frame */}
      <div className="border-2 border-[#98A98B] rounded-t-[4.2rem] sm:rounded-t-[7.2rem] md:rounded-t-[9.2rem] rounded-b-[2rem] p-4 sm:p-6 md:p-8 relative z-10 bg-white/40">

        {/* Top Right Music Control Button */}
        <button
          type="button"
          onClick={toggleAudio}
          className={`absolute top-0 right-2 sm:top-4 sm:right-4 z-30 px-3 py-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs border cursor-pointer ${isPlaying
            ? 'bg-[#FFF9E5] text-[#0F3885] border-[#C59B27]/60 shadow-sm'
            : 'bg-white text-[#4A6B52] border-slate-300 hover:text-slate-800'
            }`}
          title={isPlaying ? "Desactivar Música" : "Activar Música"}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#4A6B52] animate-pulse" />
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            </>
          )}
        </button>

        {/* Top Center Potted Lemon Tree Ornament */}
        <div className="my-2 flex gap-2 select-none justify-center items-center">
          <img
            src={florero}
            alt="Florero"
            className="w-32 sm:w-32 h-auto drop-shadow-xs"
          />
        </div>

        {/* Main Title Section */}
        <div className="space-y-1 my-2">
          <p className="font-serif text-xs sm:text-sm uppercase tracking-[0.25em] text-[#4A6B52] font-bold">
            TE INVITO A MI
          </p>

          <h1 className="font-serif text-2xl font-bold text-[#4A6B52] leading-tight">
            Celebración de
          </h1>

          <h2 className="font-script text-5xl md:text-6xl text-[#C59B27] -mt-3 sm:-mt-4 leading-none drop-shadow-xs">
            Cumpleaños!
          </h2>

          {/* Heartfelt appreciation message */}
          <p className="font-serif italic text-lg text-[#4A6B52] max-w-md mx-auto my-4 leading-normal px-2 font-normal">
            "Tu presencia significa mucho para mí y me encantaría que me acompañes a celebrar este día tan importante."
          </p>
        </div>

        {/* Event Details Card styled as in ejemplo.jpg */}
        <div className="my-6 py-4 px-3 bg-[#C59B27]/5 rounded-2xl border border-[#C59B27]/30 shadow-sm space-y-4 max-w-md mx-auto">

          {/* Top Gold Ornament Line */}
          <div className="flex items-center justify-center gap-3 text-[#C59B27] text-xs">
            <span className="h-px w-12 bg-[#C59B27]/40"></span>
            <img src={lemonFruit} alt="Limones" className="w-8 sm:w-10 h-auto drop-shadow-xs" />
            <span className="h-px w-12 bg-[#C59B27]/40"></span>
          </div>

          {/* Big Date Showcase (NOVIEMBRE 15 - 2:00 PM) */}
          <div className="flex items-center justify-center gap-4 py-2 border-y border-[#C59B27]/20">
            <div className="text-right">
              <span className="font-serif text-base uppercase tracking-widest text-[#4A6B52] font-bold block">NOVIEMBRE</span>
              <span className="font-serif text-base text-[#90997A] font-semibold block">DOMINGO</span>
            </div>

            <div className="font-serif text-4xl sm:text-5xl font-bold text-[#C59B27] px-3 border-x border-[#C59B27]/30">
              15
            </div>

            <div className="text-left">
              <span className="font-serif text-base uppercase tracking-widest text-[#4A6B52] font-bold block">2:00 PM</span>
              <span className="font-serif text-base text-[#90997A] font-semibold block">2026</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-0.5 pt-1">
            <div className="flex items-center justify-center gap-1 text-[#4A6B52] font-serif font-bold text-base sm:text-lg">
              <MapPin className="w-4 h-4 text-[#4A6B52]" />
              <span>MI CASA</span>
            </div>
          </div>

          {/* Quick Location & Calendar Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <a
              href={generateGoogleCalendarLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F3] hover:bg-lemon-light text-[#4A6B52] border border-[#0F3885]/20 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-[#4A6B52]" />
              <span>Agendar</span>
            </a>

            <a
              href={EVENT_DETAILS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F3] hover:bg-lemon-light text-[#4A6B52] border border-[#0F3885]/20 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[#4A6B52]" />
              <span>Maps</span>
            </a>

            <a
              href={EVENT_DETAILS.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F3] hover:bg-lemon-light text-[#4A6B52] border border-[#0F3885]/20 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Navigation className="w-3.5 h-3.5 text-[#4A6B52]" />
              <span>Waze</span>
            </a>
          </div>

        </div>

        {/* Action Button: Completa el formulario */}
        <div className="pt-2 space-y-3">
          {/*<button
            onClick={scrollToRsvp}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#4A6B52] hover:bg-[#98A98B] text-white text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all mx-auto cursor-pointer border"
          >
            <img src={lemonFruit} alt="Lima" className="w-6 h-6" />
            <span>Confirma tu asistencia</span>
          </button>*/}

          <div className="font-script text-3xl text-[#4A6B52]">
            ¡Muchas Gracias!
          </div>
        </div>

        {/* Countdown Timer Section */}
        <div className="mt-6 pt-4 border-t border-[#C59B27]/20 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#4A6B52]">
            TIEMPO RESTANTE PARA LA FIESTA
          </p>
          <CountdownTimer />
        </div>

      </div>
    </div>
  );
}
