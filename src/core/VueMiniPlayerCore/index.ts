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
      const newTime = playerRef.value.currentTime + seconds;
      playerRef.value.currentTime = Math.max(0, Math.min(newTime, duration.value));
      currentTime.value = playerRef.value.currentTime;
    };

    const adjustVolume = (delta: number) => {
      const newVolume = volume.value + delta;
      volume.value = parseFloat(
        Math.min(1, Math.max(0, newVolume)).toFixed(1)
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

    // Store handler references for cleanup
    const keyDownHandler = (e: KeyboardEvent) => handleKeyDown(e);
    const timeUpdateHandler = () => handleTimeUpdate();
    const loadedMetadataHandler = () => handleLoadedMetadata();

    onMounted(() => {
      window.addEventListener('keydown', keyDownHandler);
      if (playerRef.value) {
        playerRef.value.addEventListener('timeupdate', timeUpdateHandler);
        playerRef.value.addEventListener('loadedmetadata', loadedMetadataHandler);
      }
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', keyDownHandler);
      if (playerRef.value) {
        playerRef.value.removeEventListener('timeupdate', timeUpdateHandler);
        playerRef.value.removeEventListener('loadedmetadata', loadedMetadataHandler);
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