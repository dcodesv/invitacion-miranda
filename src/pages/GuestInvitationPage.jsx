import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuestByCode } from '../services/guestService';
import InvitationCard from '../components/InvitationCard';
import EnvelopeModal from '../components/EnvelopeModal';
import RsvpForm from '../components/RsvpForm';
import AppLoader from '../components/AppLoader';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function GuestInvitationPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const { imagesLoaded, progress } = useImagePreloader();

  useEffect(() => {
    const found = getGuestByCode(code);
    setGuest(found);
    setLoading(false);
  }, [code]);

  const handleRsvpUpdated = (updatedGuest) => {
    setGuest(updatedGuest);
  };

  if (loading || !imagesLoaded) {
    return <AppLoader progress={progress} message="Cargando tu invitación..." />;
  }

  if (!guest) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-porcelain azulejo-pattern">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-chinoiserie border-2 border-sage/30 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h2 className="font-serif text-2xl text-sage font-bold">
            Invitación No Encontrada
          </h2>

          <p className="text-sage text-sm">
            No encontramos ninguna invitación asociada al código "<strong className="text-sage-dark">{code}</strong>". Por favor verifica el enlace enviado.
          </p>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 rounded-2xl bg-sage hover:bg-sage-dark text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ir a la página principal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 azulejo-pattern px-6 sm:px-6">
      {/* Interactive Envelope Overlay */}
      {showEnvelope && (
        <EnvelopeModal
          guestName={guest.name}
          onOpen={() => setShowEnvelope(false)}
        />
      )}

      {/* Main Container */}
      <main className="max-w-4xl mx-auto space-y-8 pt-2 md:pt-4">

        {/* Main Invitation Card Component */}
        <InvitationCard guest={guest} />

      </main>
    </div>
  );
}
