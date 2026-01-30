import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const volume = ref(0.5);
  const isMuted = ref(false);
  const previousVolume = ref(0.5);

  const togglePlay = () => {
    isPlaying.value = !isPlaying.value;
  };

  const seek = (seconds: number) => {
    currentTime.value = Math.max(0, Math.min(duration.value, currentTime.value + seconds));
  };

  const adjustVolume = (delta: number) => {
    volume.value = Math.max(0, Math.min(1, volume.value + delta));
    if (volume.value === 0) {
      isMuted.value = true;
    } else {
      isMuted.value = false;
    }
  };

  const toggleMute = () => {
    if (isMuted.value) {
      volume.value = previousVolume.value;
    } else {
      previousVolume.value = volume.value;
      volume.value = 0;
    }
    isMuted.value = !isMuted.value;
  };

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    adjustVolume,
    toggleMute,
  };
});