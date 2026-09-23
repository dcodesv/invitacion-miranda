import React, { useState, useEffect } from 'react';
import { EVENT_DETAILS } from '../data/initialGuests';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const target = new Date(EVENT_DETAILS.dateISO).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isPast) {
    return (
      <div className="text-center py-3 px-6 bg-lemon-light border border-lemon/40 rounded-full text-cobalt font-semibold text-sm">
        🎉 ¡El evento ha comenzado!
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 md:gap-4 my-6">
      <div className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#FAF8F3] rounded-2xl border border-sage/20 shadow-tile">
        <span className="font-serif text-2xl md:text-3xl font-bold text-[#4A6B52]">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-wider text-sage font-medium">Días</span>
      </div>

      <span className="font-serif text-2xl text-sage/40 pb-2">:</span>

      <div className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#FAF8F3] rounded-2xl border border-sage/20 shadow-tile">
        <span className="font-serif text-2xl md:text-3xl font-bold text-[#4A6B52]">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-wider text-sage font-medium">Horas</span>
      </div>

      <span className="font-serif text-2xl text-sage/40 pb-2">:</span>

      <div className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#FAF8F3] rounded-2xl border border-sage/20 shadow-tile">
        <span className="font-serif text-2xl md:text-3xl font-bold text-[#4A6B52]">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-wider text-sage font-medium">Min</span>
      </div>

      <span className="font-serif text-2xl text-sage/40 pb-2">:</span>

      <div className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-lemon-light rounded-2xl border border-sage/20 shadow-tile">
        <span className="font-serif text-2xl md:text-3xl font-bold text-lemon-dark">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-wider text-lemon-dark font-medium">Seg</span>
      </div>
    </div>
  );
}
