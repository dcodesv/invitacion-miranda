import { useState, useEffect } from 'react';

import decoracion1 from '../images/decoracion1.webp';
import decoracion2 from '../images/decoracion2.webp';
import florero from '../images/florero.webp';
import envelope from '../images/envelope.webp';
import carton from '../images/carton.webp';
import cartonDark from '../images/carton_dark.webp';
import background3 from '../images/background3.webp';
import lemon from '../images/lemon.webp';
import mirandaLite from '../images/miranda_lite.webp';
import elemento1 from '../images/elemento1.png';
import elemento2 from '../images/elemento2.png';
import elemento3 from '../images/elemento3.png';
import elemento5 from '../images/elemento5.png';
import elemento6 from '../images/elemento6.png';

export const ALL_CRITICAL_IMAGES = [
  mirandaLite,
  elemento1,
  elemento2,
  elemento3,
  elemento5,
  elemento6,
  cartonDark,
  carton,
  background3
];

export function useImagePreloader(images = ALL_CRITICAL_IMAGES) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) {
      setImagesLoaded(true);
      setProgress(100);
      return;
    }

    let loadedCount = 0;
    const total = images.length;

    const updateProgress = () => {
      loadedCount++;
      const currentProgress = Math.round((loadedCount / total) * 100);
      setProgress(currentProgress);
      if (loadedCount >= total) {
        // Small delay for smooth UI transition
        setTimeout(() => setImagesLoaded(true), 250);
      }
    };

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.complete) {
        updateProgress();
      } else {
        img.onload = updateProgress;
        img.onerror = updateProgress; // ensure fallback so it never hangs
      }
    });
  }, [images]);

  return { imagesLoaded, progress };
}
