import { useState, useRef, useEffect, useCallback } from 'react';
import { AUDIO_CONFIG, SCREENS } from '../constants';

/**
 * Audio management hook
 * Handles background music that changes based on meter state
 */
export function useAudio(meter, screen, isMuted) {
  const [userInteracted, setUserInteracted] = useState(false);
  const [activeTrack, setActiveTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRefs = useRef({
    fracturing: null,
    neutral: null,
    unity: null
  });
  
  const loadedTracks = useRef(new Set());

  /**
   * Initialize audio elements (lazy loaded)
   */
  const initializeAudio = useCallback(async () => {
    if (loadedTracks.current.size > 0) return; // Already loaded
    
    setIsLoading(true);
    
    try {
      // Dynamic imports for lazy loading
      const [fracturingModule, neutralModule, unityModule] = await Promise.all([
        import('../assets/fracturing.mp3'),
        import('../assets/neutral.mp3'),
        import('../assets/unity.mp3')
      ]);
      
      // Create audio elements
      audioRefs.current.fracturing = new Audio(fracturingModule.default);
      audioRefs.current.neutral = new Audio(neutralModule.default);
      audioRefs.current.unity = new Audio(unityModule.default);
      
      // Configure all tracks
      Object.values(audioRefs.current).forEach(audio => {
        audio.loop = AUDIO_CONFIG.LOOP;
        audio.volume = AUDIO_CONFIG.VOLUME;
        audio.preload = 'auto';
      });
      
      loadedTracks.current.add('fracturing');
      loadedTracks.current.add('neutral');
      loadedTracks.current.add('unity');
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load audio:', error);
      setIsLoading(false);
    }
  }, []);

  /**
   * Determine which track should play based on meter
   */
  const getTargetTrack = useCallback(() => {
    if (meter <= -2) return 'fracturing';
    if (meter >= 2) return 'unity';
    return 'neutral';
  }, [meter]);

  /**
   * Crossfade between tracks
   */
  const crossfade = useCallback(async (fromTrack, toTrack) => {
    const fromAudio = audioRefs.current[fromTrack];
    const toAudio = audioRefs.current[toTrack];
    
    if (!fromAudio || !toAudio) return;
    
    const fadeDuration = AUDIO_CONFIG.FADE_DURATION;
    const steps = 20;
    const stepDuration = fadeDuration / steps;
    
    // Start new track at volume 0
    toAudio.volume = 0;
    try {
      await toAudio.play();
    } catch (error) {
      console.error('Audio play failed:', error);
      return;
    }
    
    // Crossfade
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      
      if (fromAudio && !fromAudio.paused) {
        fromAudio.volume = AUDIO_CONFIG.VOLUME * (1 - progress);
      }
      
      if (toAudio && !toAudio.paused) {
        toAudio.volume = AUDIO_CONFIG.VOLUME * progress;
      }
      
      if (i < steps) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }
    }
    
    // Stop old track
    if (fromAudio) {
      fromAudio.pause();
      fromAudio.currentTime = 0;
    }
  }, []);

  /**
   * Switch to appropriate track based on game state
   */
  useEffect(() => {
    // Don't play audio if:
    // - User hasn't interacted yet (browser autoplay policy)
    // - Audio is muted
    // - Not on game or end screen
    // - Audio not loaded
    if (!userInteracted || isMuted || loadedTracks.current.size === 0) {
      // Stop all tracks
      Object.values(audioRefs.current).forEach(audio => {
        if (audio && !audio.paused) {
          audio.pause();
        }
      });
      setActiveTrack(null);
      return;
    }
    
    // Only play audio on game and end screens
    if (screen !== SCREENS.GAME && screen !== SCREENS.END) {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio && !audio.paused) {
          audio.pause();
        }
      });
      setActiveTrack(null);
      return;
    }
    
    const targetTrack = getTargetTrack();
    
    // If we need to switch tracks
    if (targetTrack !== activeTrack) {
      if (activeTrack) {
        // Crossfade from current to new
        crossfade(activeTrack, targetTrack);
      } else {
        // Start new track from silence
        const audio = audioRefs.current[targetTrack];
        if (audio) {
          audio.volume = AUDIO_CONFIG.VOLUME;
          audio.play().catch(err => console.error('Audio play failed:', err));
        }
      }
      setActiveTrack(targetTrack);
    }
  }, [meter, screen, isMuted, userInteracted, activeTrack, getTargetTrack, crossfade]);

  /**
   * Initialize audio when user first interacts
   */
  useEffect(() => {
    if (userInteracted && loadedTracks.current.size === 0) {
      initializeAudio();
    }
  }, [userInteracted, initializeAudio]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  return {
    userInteracted,
    setUserInteracted,
    isLoading,
    activeTrack
  };
}