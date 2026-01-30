import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VueMiniPlayerCore from '@/core/VueMiniPlayerCore/index.ts';

// Mock HTMLMediaElement methods
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('VueMiniPlayerCore Keyboard Shortcuts', () => {
  let wrapper: any;
  let playerMock: any;

  beforeEach(() => {
    playerMock = {
      play: jest.fn(),
      pause: jest.fn(),
      currentTime: 50,
      duration: 100,
      volume: 0.5,
      muted: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    wrapper = mount(VueMiniPlayerCore, {
      attachTo: document.body,
      global: {
        mocks: {
          playerRef: playerMock
        }
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
    jest.clearAllMocks();
  });

  const createEvent = (key: string) => new KeyboardEvent('keydown', { key });

  it('toggles play/pause when Space is pressed', async () => {
    wrapper.vm.store.IsPlaying = false;
    window.dispatchEvent(createEvent(' '));
    await nextTick();
    expect(wrapper.vm.store.IsPlaying).toBe(true);
    expect(playerMock.play).toHaveBeenCalled();

    wrapper.vm.store.IsPlaying = true;
    window.dispatchEvent(createEvent(' '));
    await nextTick();
    expect(wrapper.vm.store.IsPlaying).toBe(false);
    expect(playerMock.pause).toHaveBeenCalled();
  });

  it('seeks forward 5s when ArrowRight is pressed', async () => {
    window.dispatchEvent(createEvent('ArrowRight'));
    await nextTick();
    expect(playerMock.currentTime).toBe(55);
  });

  it('seeks backward 5s when ArrowLeft is pressed', async () => {
    playerMock.currentTime = 10;
    window.dispatchEvent(createEvent('ArrowLeft'));
    await nextTick();
    expect(playerMock.currentTime).toBe(5);
  });

  it('clamps seek values within duration bounds', async () => {
    playerMock.currentTime = 98;
    window.dispatchEvent(createEvent('ArrowRight'));
    await nextTick();
    expect(playerMock.currentTime).toBe(100);

    playerMock.currentTime = 2;
    window.dispatchEvent(createEvent('ArrowLeft'));
    await nextTick();
    expect(playerMock.currentTime).toBe(0);
  });

  it('increases volume when ArrowUp is pressed', async () => {
    wrapper.vm.store.volume = 0.5;
    window.dispatchEvent(createEvent('ArrowUp'));
    await nextTick();
    expect(wrapper.vm.store.volume).toBe(0.6);
    expect(playerMock.volume).toBe(0.6);
  });

  it('decreases volume when ArrowDown is pressed', async () => {
    wrapper.vm.store.volume = 0.5;
    window.dispatchEvent(createEvent('ArrowDown'));
    await nextTick();
    expect(wrapper.vm.store.volume).toBe(0.4);
    expect(playerMock.volume).toBe(0.4);
  });

  it('clamps volume between 0 and 1', async () => {
    wrapper.vm.store.volume = 0.95;
    window.dispatchEvent(createEvent('ArrowUp'));
    await nextTick();
    expect(wrapper.vm.store.volume).toBe(1);

    wrapper.vm.store.volume = 0.05;
    window.dispatchEvent(createEvent('ArrowDown'));
    await nextTick();
    expect(wrapper.vm.store.volume).toBe(0);
  });

  it('toggles mute when M is pressed', async () => {
    wrapper.vm.store.IsMuted = false;
    window.dispatchEvent(createEvent('m'));
    await nextTick();
    expect(wrapper.vm.store.IsMuted).toBe(true);
    expect(playerMock.muted).toBe(true);

    window.dispatchEvent(createEvent('M'));
    await nextTick();
    expect(wrapper.vm.store.IsMuted).toBe(false);
    expect(playerMock.muted).toBe(false);
  });

  it('ignores shortcuts when focused on input', async () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const initialPlayingState = wrapper.vm.store.IsPlaying;
    window.dispatchEvent(createEvent(' '));
    await nextTick();
    expect(wrapper.vm.store.IsPlaying).toBe(initialPlayingState);

    document.body.removeChild(input);
  });
});