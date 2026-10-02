import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGuestByCode } from '../services/guestService';
import DisruptiveInvitationCard from '../components/DisruptiveInvitationCard';
import DisruptiveEnvelopeModal from '../components/DisruptiveEnvelopeModal';
import DisruptiveAppLoader from '../components/DisruptiveAppLoader';
import { useImagePreloader } from '../hooks/useImagePreloader';

export default function LabInvitationPage() {
  const { code } = useParams();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [isLoaderDone, setIsLoaderDone] = useState(false);
  const { imagesLoaded, progress } = useImagePreloader();

  useEffect(() => {
    const defaultCode = code || 'MR1008';
    const found = getGuestByCode(defaultCode);
    setGuest(found || {
      id: 'lab-guest',
      code: 'MR1008',
      name: 'Special Guest',
      passes: 5,
      status: 'confirmed',
      attendingPasses: 1
    });
    setLoading(false);
  }, [code]);

  // Hold loader for at least 3 seconds after loading completes to allow viewing the animation
  useEffect(() => {
    if (!loading && imagesLoaded) {
      const timer = setTimeout(() => {
        setIsLoaderDone(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, imagesLoaded]);

  if (!isLoaderDone) {
    const isFinished = !loading && imagesLoaded;
    return (
      <DisruptiveAppLoader
        progress={isFinished ? 100 : progress}
        message={isFinished ? "Tour VIP Passes Unlocked! 🎸🩵✨" : "Getting your VIP Tour Passes ready..."}
      />
    );
  }

  return (
    <div className="min-h-screen overflow-hidden pb-12 bg-transparent px-3 sm:px-6 relative">
      {/* Subtle ambient light blue glow in background */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-rockBlue-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Interactive Disruptive Carita Modal Overlay */}
      {showEnvelope && (
        <DisruptiveEnvelopeModal
          guestName={guest.name}
          onOpen={() => setShowEnvelope(false)}
        />
      )}

      {/* Main Container */}
      <main className="max-w-4xl mx-auto pt-2 md:pt-4">

        {/* Disruptive Invitation Card Component */}
        <DisruptiveInvitationCard guest={guest} />

      </main>
    </div>
  );
}
