import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePlayerStore } from '@/stores/player';

describe('usePlayerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should toggle play state', () => {
    const store = usePlayerStore();
    expect(store.isPlaying).toBe(false);

    store.togglePlay();
    expect(store.isPlaying).toBe(true);

    store.togglePlay();
    expect(store.isPlaying).toBe(false);
  });

  it('should seek forward and backward', () => {
    const store = usePlayerStore();
    store.duration = 100;

    store.seek(5);
    expect(store.currentTime).toBe(5);

    store.seek(-3);
    expect(store.currentTime).toBe(2);

    // Should not go below 0
    store.seek(-10);
    expect(store.currentTime).toBe(0);

    // Should not exceed duration
    store.currentTime = 95;
    store.seek(10);
    expect(store.currentTime).toBe(100);
  });

  it('should adjust volume', () => {
    const store = usePlayerStore();
    expect(store.volume).toBe(0.5);

    store.adjustVolume(0.1);
    expect(store.volume).toBe(0.6);

    store.adjustVolume(-0.2);
    expect(store.volume).toBe(0.4);

    // Should not go below 0
    store.adjustVolume(-1);
    expect(store.volume).toBe(0);
    expect(store.isMuted).toBe(true);

    // Should not exceed 1
    store.volume = 0.9;
    store.adjustVolume(0.2);
    expect(store.volume).toBe(1);
  });

  it('should toggle mute', () => {
    const store = usePlayerStore();
    expect(store.isMuted).toBe(false);

    store.toggleMute();
    expect(store.isMuted).toBe(true);
    expect(store.volume).toBe(0);

    store.toggleMute();
    expect(store.isMuted).toBe(false);
    expect(store.volume).toBe(0.5);
  });
});