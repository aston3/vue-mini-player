import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

export default defineComponent({
  name: 'VueMiniPlayerCore',
  setup() {
    const isPlaying = ref(false);
    const currentTime = ref(0);
    const duration = ref(0);
    const volume = ref(1);
    const isMuted = ref(false);
    const playerRef = ref<HTMLVideoElement | null>(null);

    const togglePlayPause = () => {
      if (!playerRef.value) return;
      if (isPlaying.value) {
        playerRef.value.pause();
      } else {
        playerRef.value.play();
      }
      isPlaying.value = !isPlaying.value;
    };

    const seek = (seconds: number) => {
      if (!playerRef.value) return;
      playerRef.value.currentTime += seconds;
    };

    const adjustVolume = (delta: number) => {
      volume.value = parseFloat(
        Math.min(1, Math.max(0, volume.value + delta)).toFixed(1)
      );
      if (playerRef.value) {
        playerRef.value.volume = volume.value;
      }
    };

    const toggleMute = () => {
      isMuted.value = !isMuted.value;
      if (playerRef.value) {
        playerRef.value.muted = isMuted.value;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement && ['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          event.preventDefault();
          seek(5);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          seek(-5);
          break;
        case 'ArrowUp':
          event.preventDefault();
          adjustVolume(0.1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          adjustVolume(-0.1);
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          toggleMute();
          break;
      }
    };

    const handleTimeUpdate = () => {
      if (playerRef.value) {
        currentTime.value = playerRef.value.currentTime;
      }
    };

    const handleLoadedMetadata = () => {
      if (playerRef.value) {
        duration.value = playerRef.value.duration;
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleKeyDown);
      if (playerRef.value) {
        playerRef.value.addEventListener('timeupdate', handleTimeUpdate);
        playerRef.value.addEventListener('loadedmetadata', handleLoadedMetadata);
      }
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown);
      if (playerRef.value) {
        playerRef.value.removeEventListener('timeupdate', handleTimeUpdate);
        playerRef.value.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    });

    return {
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      playerRef,
      togglePlayPause,
      seek,
      adjustVolume,
      toggleMute
    };
  }
});