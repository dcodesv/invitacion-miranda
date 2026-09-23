import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Users, MessageSquare, Ticket, Sparkles, Send } from 'lucide-react';
import { updateGuestRsvp } from '../services/guestService';

export default function RsvpForm({ guest, onRsvpUpdated }) {
  const [status, setStatus] = useState(guest.status === 'pending' ? 'confirmed' : guest.status);
  const [attendingPasses, setAttendingPasses] = useState(guest.attendingPasses || guest.passes);
  const [notes, setNotes] = useState(guest.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(guest.status !== 'pending');

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0F3885', '#F5C623', '#4A6B52', '#FFFFFF']
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const updated = updateGuestRsvp(guest.code, status, status === 'confirmed' ? attendingPasses : 0, notes);
      setIsSubmitting(false);
      setSubmitted(true);

      if (status === 'confirmed') {
        triggerConfetti();
      }

      if (onRsvpUpdated) {
        onRsvpUpdated(updated);
      }
    }, 600);
  };

  const handleEditClick = () => {
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="bg-porcelain-pure rounded-3xl p-6 md:p-8 shadow-chinoiserie border-2 border-sage/30 text-center relative overflow-hidden">
        {/* Decorative Top Banner */}
        <div className="w-full h-2 bg-gradient-to-r from-cobalt via-lemon to-sage rounded-t-full mb-6"></div>

        {guest.status === 'confirmed' ? (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-serif text-2xl md:text-3xl text-cobalt font-bold">
              ¡Asistencia Confirmada!
            </h3>

            <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto">
              Muchas gracias, <strong className="text-cobalt font-semibold">{guest.name}</strong>. Hemos reservado <strong className="text-sage-dark font-semibold">{guest.attendingPasses} de {guest.passes} pase(s)</strong> para ti.
            </p>

            {/* Digital Pass Ticket Card */}
            <div className="my-6 p-5 bg-gradient-to-br from-porcelain to-porcelain-dark rounded-2xl border-2 border-dashed border-cobalt/30 text-left relative shadow-sm">
              <div className="flex items-center justify-between border-b border-sage/20 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-cobalt" />
                  <span className="font-serif text-sm font-bold text-cobalt uppercase tracking-wider">Pase de Entrada Digital</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-lemon/30 text-cobalt font-semibold">
                  {guest.attendingPasses} {guest.attendingPasses === 1 ? 'Persona' : 'Personas'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px]">Titular:</span>
                  <p className="font-semibold text-slate-800 text-sm truncate">{guest.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px]">Código:</span>
                  <p className="font-mono font-bold text-cobalt uppercase text-sm">{guest.code}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px]">Fecha:</span>
                  <p className="font-semibold text-slate-800">15 de Noviembre, 2026</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px]">Hora:</span>
                  <p className="font-semibold text-slate-800">2:00 PM</p>
                </div>
              </div>

              {guest.notes && (
                <div className="mt-3 pt-3 border-t border-sage/20 text-xs text-slate-600">
                  <span className="font-medium text-slate-700">Nota:</span> "{guest.notes}"
                </div>
              )}
            </div>

            <button
              onClick={handleEditClick}
              className="text-xs text-sage hover:text-cobalt underline transition-colors"
            >
              ¿Necesitas modificar tu respuesta? Haz clic aquí
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              <XCircle className="w-10 h-10 text-slate-400" />
            </div>

            <h3 className="font-serif text-2xl text-slate-700 font-bold">
              Respuesta Registrada
            </h3>

            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Lamentamos que no puedas acompañarnos, <strong className="text-slate-800">{guest.name}</strong>. ¡Agradecemos mucho que nos lo hayas hecho saber!
            </p>

            <button
              onClick={handleEditClick}
              className="text-xs text-sage hover:text-cobalt underline transition-colors pt-2 inline-block"
            >
              Cambiar respuesta a "Asistiré"
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="rsvp-section" className="bg-porcelain-pure rounded-3xl p-6 md:p-8 shadow-chinoiserie border-2 border-sage/30 relative">
      <div className="text-center mb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-sage bg-sage/10 px-3 py-1 rounded-full border border-sage/20">
          Confirmación de Asistencia
        </span>

        <h3 className="font-serif text-2xl md:text-3xl text-cobalt font-bold mt-2">
          Completa el Formulario
        </h3>

        <p className="text-slate-600 text-xs md:text-sm mt-1">
          Por favor confirma tu presencia antes del <strong className="text-cobalt">1 de Agosto, 2026</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Attendance Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStatus('confirmed')}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${status === 'confirmed'
              ? 'border-cobalt bg-cobalt/5 text-cobalt shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
          >
            <CheckCircle2 className={`w-7 h-7 mb-1.5 ${status === 'confirmed' ? 'text-cobalt' : 'text-slate-400'}`} />
            <span className="font-semibold text-sm">¡Sí asistiré!</span>
          </button>

          <button
            type="button"
            onClick={() => setStatus('declined')}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${status === 'declined'
              ? 'border-red-400 bg-red-50 text-red-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
          >
            <XCircle className={`w-7 h-7 mb-1.5 ${status === 'declined' ? 'text-red-500' : 'text-slate-400'}`} />
            <span className="font-semibold text-sm">No podré asistir</span>
          </button>
        </div>

        {/* Number of Passes Selection (If Attending) */}
        {status === 'confirmed' && (
          <div className="bg-porcelain p-4 rounded-2xl border border-sage/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-cobalt flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sage" />
                <span>¿Cuántas personas asistirán?</span>
              </label>
              <span className="text-xs text-slate-500">
                Máximo: {guest.passes} {guest.passes === 1 ? 'pase' : 'pases'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 py-2">
              <button
                type="button"
                onClick={() => setAttendingPasses(Math.max(1, attendingPasses - 1))}
                disabled={attendingPasses <= 1}
                className="w-10 h-10 rounded-full bg-white border border-sage/30 text-cobalt font-bold text-lg flex items-center justify-center hover:bg-sage/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                -
              </button>

              <div className="px-5 py-1.5 bg-cobalt text-white font-serif font-bold text-xl rounded-xl shadow-sm">
                {attendingPasses}
              </div>

              <button
                type="button"
                onClick={() => setAttendingPasses(Math.min(guest.passes, attendingPasses + 1))}
                disabled={attendingPasses >= guest.passes}
                className="w-10 h-10 rounded-full bg-white border border-sage/30 text-cobalt font-bold text-lg flex items-center justify-center hover:bg-sage/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            <p className="text-center text-xs text-sage font-medium">
              Asignados a tu invitación: {guest.passes} {guest.passes === 1 ? 'pase' : 'pases'}
            </p>
          </div>
        )}

        {/* Optional Comments / Dietary Restrictions */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-sage" />
            <span>Notas especiales o canción sugerida (Opcional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Restricciones alimenticias, alergias o la canción que no puede faltar..."
            rows={3}
            className="w-full p-3 bg-white rounded-2xl border border-sage/30 text-sm focus:ring-2 focus:ring-cobalt focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-sage hover:bg-sage-dark text-white font-semibold text-base shadow-lg shadow-sage/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Guardando respuesta...</span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Confirmar Respuesta</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
