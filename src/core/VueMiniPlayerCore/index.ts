import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

export default defineComponent({
  name: 'VueMiniPlayerCore',
  setup() {
    const isPlaying = ref(false);
    const currentTime = ref(0);
    const volume = ref(1);
    const isMuted = ref(false);
    const playerRef = ref<HTMLVideoElement | null>(null);

    const togglePlayPause = () => {
      if (!playerRef.value) return;
      isPlaying.value ? playerRef.value.pause() : playerRef.value.play();
      isPlaying.value = !isPlaying.value;
    };

    const seek = (seconds: number) => {
      if (!playerRef.value) return;
      playerRef.value.currentTime += seconds;
      currentTime.value = playerRef.value.currentTime;
    };

    const adjustVolume = (delta: number) => {
      volume.value = Math.min(1, Math.max(0, volume.value + delta));
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
      // Ignore if focused on input elements
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

    onMounted(() => {
      window.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });

    return {
      isPlaying,
      currentTime,
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