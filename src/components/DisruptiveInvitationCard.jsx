import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Navigation, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { EVENT_DETAILS } from '../data/initialGuests';
import mirandaBanner from '../images/miranda_lite.webp';
import cartonDark from '../images/carton_dark.webp';
import elemento1 from '../images/elemento1.png'; // Silver star balloon
import elemento2 from '../images/elemento2.png'; // Pink bow
import elemento3 from '../images/elemento3.png'; // Pink metallic heart balloon
import elemento4 from '../images/elemento4.png'; // Disco ball with pink bow
import elemento5 from '../images/elemento5.png'; // Vinyl record Limited Edition
import elemento6 from '../images/elemento6.png'; // Electric guitar sticker

export default function DisruptiveInvitationCard({ guest }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(EVENT_DETAILS.dateISO).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Lazy load audio source on-demand
  const ensureAudioSource = () => {
    if (!audioRef.current) return null;
    const audioEl = audioRef.current;
    if (!audioEl.src || !audioEl.src.includes('madness.m4a')) {
      audioEl.src = '/audio/madness.m4a';
      audioEl.load();
    }
    audioEl.volume = 1;
    return audioEl;
  };

  useEffect(() => {
    if (!audioRef.current) return;

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

  const generateGoogleCalendarLink = () => {
    const title = encodeURIComponent("Miranda's 10th Birthday! 🎸🖤💖");
    const details = encodeURIComponent(`Limo Ride (2:00 PM - 4:00 PM) & Pizza Time (4:00 PM onwards) at ${EVENT_DETAILS.locationFull}`);
    const location = encodeURIComponent(EVENT_DETAILS.locationFull);
    const dates = "20261115T200000Z/20261116T020000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${cartonDark})`,
        backgroundColor: '#1f1f24',
        backgroundRepeat: 'repeat',
        backgroundSize: '450px',
        backgroundPosition: 'center',
      }}
      className="relative w-full max-w-xl mx-auto rounded-3xl shadow-2xl shadow-black/80 my-4 sm:my-8 p-3 sm:p-5 text-center text-slate-100 border-4 border-pink-400/80 bg-zinc-950 overflow-visible"
    >
      {/* Elemento 1: Silver Star Balloon (Top-Left Corner) */}
      <motion.img
        src={elemento1}
        alt="Estrella plateada"
        animate={{
          y: [0, -8, 0, 6, 0],
          rotate: [-12, -6, -12, -18, -12],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-8 -left-6 sm:-top-10 sm:-left-8 w-20 sm:w-28 select-none pointer-events-none z-40 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
      />

      {/* Elemento 2: Pink Watercolor Bow (Top-Right Accent near audio button) */}
      <motion.img
        src={elemento2}
        alt="Moño rosa"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [12, 16, 12, 8, 12],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-7 right-14 sm:-top-8 sm:right-16 w-16 sm:w-24 select-none pointer-events-none z-40 drop-shadow-[0_8px_12px_rgba(244,114,182,0.3)]"
      />

      {/* Elemento 6: Electric Guitar (Bottom-Left Decorative Accent) */}
      <motion.img
        src={elemento6}
        alt="Guitarra eléctrica rock"
        animate={{
          y: [0, -6, 0, 5, 0],
          rotate: [-24, -20, -24, -28, -24],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-8 -left-6 sm:-bottom-10 sm:-left-8 w-24 sm:w-32 select-none pointer-events-none z-40 drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
      />

      {/* Elemento 3: Pink Metallic Heart (Bottom-Right Decorative Accent) */}
      <motion.img
        src={elemento3}
        alt="Corazón rosa metálico"
        animate={{
          y: [0, 6, 0, -6, 0],
          scale: [1, 1.06, 1],
          rotate: [15, 20, 15, 10, 15],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
        className="absolute -bottom-8 -right-6 sm:-bottom-10 sm:-right-8 w-20 sm:w-28 select-none pointer-events-none z-40 drop-shadow-[0_10px_20px_rgba(244,114,182,0.4)]"
      />

      {/* Background Audio */}
      <audio ref={audioRef} loop preload="none" />

      {/* Floating Audio Button */}
      <button
        type="button"
        onClick={toggleAudio}
        className={`absolute top-4 right-4 z-40 p-2.5 rounded-full text-xs font-semibold flex items-center justify-center transition-all shadow-lg border-2 cursor-pointer ${isPlaying
          ? 'bg-zinc-900/90 text-pink-400 border-pink-500 shadow-pink-500/20'
          : 'bg-zinc-800 text-zinc-400 border-zinc-600'
          }`}
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-pink-400 animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-zinc-400" />
        )}
      </button>

      {/* 1. Hero Banner: Miranda 10 años Graphic with floating subtle motion */}
      <motion.div
        animate={{
          y: [0, -6, 0, 5, 0],
          scale: [1, 1.01, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.02 }}
        className="relative w-full overflow-hidden rounded-2xl mb-4 p-1 cursor-pointer bg-black/60 border border-pink-500/30 shadow-inner"
      >
        <img
          src={mirandaBanner}
          alt="Miranda 10th Birthday Banner"
          className="w-full h-auto object-cover rounded-xl drop-shadow-2xl select-none"
        />
      </motion.div>

      {/* Decorative Middle Stickers Row (Elemento 4: Disco Ball & Elemento 5: Vinyl Record) */}
      <div className="relative w-full flex justify-center items-center gap-6 my-2">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative"
        >
          <img
            src={elemento5}
            alt="Limited Edition Vinyl"
            className="w-14 sm:w-16 h-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] select-none"
          />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [-4, 4, -4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <img
            src={elemento4}
            alt="Disco Ball with pink bow"
            className="w-14 sm:w-16 h-auto drop-shadow-[0_4px_12px_rgba(244,114,182,0.4)] select-none"
          />
        </motion.div>
      </div>

      {/* 2. Middle Event Details Card - Miranda Rock-Chic Dark & Pink Theme */}
      <div className="relative bg-zinc-900/90 rounded-3xl p-5 sm:p-6 border-2 border-pink-500/40 shadow-xl shadow-black/40 my-4 text-center space-y-4 font-mansalva text-slate-100">

        {/* Date Row */}
        <div className="flex items-center justify-between px-2 sm:px-6 py-2 border-b border-dashed border-pink-500/30">
          <div className="text-center">
            <span className="font-mansalva font-bold text-pink-400 text-base sm:text-lg tracking-wider block uppercase">
              NOVEMBER
            </span>
            <span className="text-xs text-pink-200/80 uppercase font-mansalva tracking-wider block">
              SUNDAY
            </span>
          </div>

          {/* Big Day 15 */}
          <div className="flex items-center justify-center gap-1">
            <span className="font-mansalva text-6xl sm:text-7xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(244,114,182,0.6)]">
              15
            </span>
          </div>

          <div className="text-center">
            <span className="font-mansalva font-bold text-pink-400 text-base sm:text-lg tracking-wider block">
              2:00 PM
            </span>
            <span className="text-xs text-pink-200/80 uppercase font-mansalva tracking-wider block">
              2026
            </span>
          </div>
        </div>

        {/* Itinerary Schedule: Limo Ride & Pizza Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-1">
          <div className="bg-pink-950/40 border border-pink-500/40 rounded-2xl p-3 flex items-center gap-3 text-left">
            <div className="text-2xl p-2 rounded-xl bg-pink-500/20 border border-pink-500/30">
              🚘
            </div>
            <div>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">
                LIMO RIDE
              </span>
              <span className="text-sm font-extrabold text-white block">
                2:00 PM to 4:00 PM
              </span>
            </div>
          </div>

          <div className="bg-pink-950/40 border border-pink-500/40 rounded-2xl p-3 flex items-center gap-3 text-left">
            <div className="text-2xl p-2 rounded-xl bg-pink-500/20 border border-pink-500/30">
              🍕
            </div>
            <div>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">
                PIZZA TIME
              </span>
              <span className="text-sm font-extrabold text-white block">
                4:00 PM onwards
              </span>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-1.5 pt-2 border-t border-dashed border-pink-500/30">
          <div className="flex items-center justify-center gap-1.5 text-pink-300 font-bold text-lg sm:text-xl font-mansalva">
            <MapPin className="w-5 h-5 text-pink-400 fill-pink-400/20 shrink-0" />
            <span className="tracking-wide uppercase">LOCATION: MY HOME</span>
          </div>
          <p className="text-xs sm:text-sm text-pink-200/90 font-mono tracking-tight px-2 leading-relaxed">
            18610 Porthaven Rose Ln<br />
            Tomball, TX 77377-2789
          </p>
        </div>

        {/* Pill Action Buttons (Calendar & Google Maps only) */}
        <div className="grid grid-cols-2 gap-3 pt-2 max-w-sm mx-auto font-mansalva">
          <a
            href={generateGoogleCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 rounded-2xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Calendar className="w-4 h-4 text-pink-400" />
            <span>CALENDAR</span>
          </a>

          <a
            href={EVENT_DETAILS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 rounded-2xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <MapPin className="w-4 h-4 text-pink-400" />
            <span>GOOGLE MAPS</span>
          </a>
        </div>

      </div>

      {/* 3. Countdown Section with Rock-Chic Paperclip Hanging Cards */}
      <div className="relative mt-2 rounded-3xl overflow-hidden p-4 sm:p-6 font-mansalva mb-4 bg-zinc-900/60 border border-white/10">

        {/* Countdown Ribbon */}
        <div className="inline-block text-pink-400 font-bold text-sm px-6 py-1 rounded-full shadow-md tracking-widest uppercase mb-4 font-mansalva border border-pink-500/40 bg-pink-950/40">
          ⚡ COUNTDOWN ⚡
        </div>

        {/* Paperclip Hanging Countdown Cards Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto font-mansalva">

          {/* Days Card */}
          <div className="relative bg-zinc-900/90 rounded-2xl p-2 sm:p-3 border border-pink-400/40 shadow-lg shadow-black/40 text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-pink-300">
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 5.5V14.5C4.5 15.8807 5.61929 17 7 17C8.38071 17 9.5 15.8807 9.5 14.5V3.5C9.5 1.84315 8.15685 0.5 6.5 0.5C4.84315 0.5 3.5 1.84315 3.5 3.5V15.5C3.5 17.9853 5.51472 20 8 20C10.4853 20 12.5 17.9853 12.5 15.5V6" stroke="#F472B6" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-mansalva text-3xl sm:text-4xl font-extrabold text-white block mt-1">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-pink-400 uppercase tracking-wider block font-mansalva">
              DAYS
            </span>
          </div>

          {/* Hours Card */}
          <div className="relative bg-zinc-900/90 rounded-2xl p-2 sm:p-3 border border-pink-400/40 shadow-lg shadow-black/40 text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-pink-300">
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 5.5V14.5C4.5 15.8807 5.61929 17 7 17C8.38071 17 9.5 15.8807 9.5 14.5V3.5C9.5 1.84315 8.15685 0.5 6.5 0.5C4.84315 0.5 3.5 1.84315 3.5 3.5V15.5C3.5 17.9853 5.51472 20 8 20C10.4853 20 12.5 17.9853 12.5 15.5V6" stroke="#F472B6" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-mansalva text-3xl sm:text-4xl font-extrabold text-white block mt-1">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-pink-400 uppercase tracking-wider block font-mansalva">
              HOURS
            </span>
          </div>

          {/* Minutes Card */}
          <div className="relative bg-zinc-900/90 rounded-2xl p-2 sm:p-3 border border-pink-400/40 shadow-lg shadow-black/40 text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-pink-300">
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 5.5V14.5C4.5 15.8807 5.61929 17 7 17C8.38071 17 9.5 15.8807 9.5 14.5V3.5C9.5 1.84315 8.15685 0.5 6.5 0.5C4.84315 0.5 3.5 1.84315 3.5 3.5V15.5C3.5 17.9853 5.51472 20 8 20C10.4853 20 12.5 17.9853 12.5 15.5V6" stroke="#F472B6" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-mansalva text-3xl sm:text-4xl font-extrabold text-white block mt-1">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-pink-400 uppercase tracking-wider block font-mansalva">
              MINS
            </span>
          </div>

          {/* Seconds Card */}
          <div className="relative bg-zinc-900/90 rounded-2xl p-2 sm:p-3 border border-pink-400/40 shadow-lg shadow-black/40 text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-pink-300">
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 5.5V14.5C4.5 15.8807 5.61929 17 7 17C8.38071 17 9.5 15.8807 9.5 14.5V3.5C9.5 1.84315 8.15685 0.5 6.5 0.5C4.84315 0.5 3.5 1.84315 3.5 3.5V15.5C3.5 17.9853 5.51472 20 8 20C10.4853 20 12.5 17.9853 12.5 15.5V6" stroke="#F472B6" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-mansalva text-3xl sm:text-4xl font-extrabold text-pink-400 block mt-1">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-pink-400 uppercase tracking-wider block font-mansalva">
              SECS
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
