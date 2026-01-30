import { defineComponent, ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useSettingsStore } from '@/stores/settings';
import { useAudio } from '@/composables/useAudio';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts';

export default defineComponent({
  name: 'VueMiniPlayerCore',
  setup() {
    const playerStore = usePlayerStore();
    const settingsStore = useSettingsStore();
    const { audioRef, currentTime, duration, volume, isPlaying, isMuted } = useAudio();

    // Keyboard shortcuts composable
    const { registerShortcuts, unregisterShortcuts } = useKeyboardShortcuts({
      ' ': () => playerStore.togglePlay(),
      ArrowRight: () => playerStore.seek(5),
      ArrowLeft: () => playerStore.seek(-5),
      ArrowUp: () => playerStore.adjustVolume(0.1),
      ArrowDown: () => playerStore.adjustVolume(-0.1),
      m: () => playerStore.toggleMute(),
      M: () => playerStore.toggleMute(),
    });

    onMounted(() => {
      registerShortcuts();
    });

    onUnmounted(() => {
      unregisterShortcuts();
    });

    return {
      audioRef,
      currentTime,
      duration,
      volume,
      isPlaying,
      isMuted,
      togglePlay: playerStore.togglePlay,
      seek: playerStore.seek,
      adjustVolume: playerStore.adjustVolume,
      toggleMute: playerStore.toggleMute,
    };
  },
});