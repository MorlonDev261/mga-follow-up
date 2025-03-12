import { useEffect, useState } from 'react';

/**
 * Hook personnalisé pour détecter la taille de l'écran et déterminer si c'est un mobile, une tablette ou un desktop.
 * 
 * @returns {Object} - Un objet contenant les états `isMobile`, `isTablet` et `isDesktop`.
 */
const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Définir les requêtes média
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const tabletQuery = window.matchMedia('(min-width: 769px) and (max-width: 1024px)');
    const desktopQuery = window.matchMedia('(min-width: 1025px)');

    // Fonction pour mettre à jour les états
    const updateState = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
      setIsDesktop(desktopQuery.matches);
    };

    // Mettre à jour l'état initial
    updateState();

    // Écouter les changements de taille d'écran
    mobileQuery.addEventListener('change', updateState);
    tabletQuery.addEventListener('change', updateState);
    desktopQuery.addEventListener('change', updateState);

    // Nettoyer les écouteurs d'événements
    return () => {
      mobileQuery.removeEventListener('change', updateState);
      tabletQuery.removeEventListener('change', updateState);
      desktopQuery.removeEventListener('change', updateState);
    };
  }, []);

  return { isMobile, isTablet, isDesktop };
};

export default useMediaQuery;
