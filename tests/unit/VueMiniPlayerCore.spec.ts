import { mount } from '@vue/test-utils';
import VueMiniPlayerCore from '@/core/VueMiniPlayerCore/index.ts';

describe('VueMiniPlayerCore Keyboard Shortcuts', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(VueMiniPlayerCore, {
      attachTo: document.body,
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  const createEvent = (key: string) => new KeyboardEvent('keydown', { key });

  it('toggles play/pause when Space is pressed', async () => {
    const initialPlayingState = wrapper.vm.isPlaying;
    window.dispatchEvent(createEvent(' '));
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isPlaying).toBe(!initialPlayingState);
  });

  it('seeks forward 5s when ArrowRight is pressed', async () => {
    const initialTime = wrapper.vm.currentTime;
    window.dispatchEvent(createEvent('ArrowRight'));
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentTime).toBe(initialTime + 5);
  });

  it('seeks backward 5s when ArrowLeft is pressed', async () => {
    wrapper.vm.currentTime = 10; // Set initial time
    window.dispatchEvent(createEvent('ArrowLeft'));
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentTime).toBe(5);
  });

  it('increases volume when ArrowUp is pressed', async () => {
    const initialVolume = wrapper.vm.volume;
    window.dispatchEvent(createEvent('ArrowUp'));
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.volume).toBe(parseFloat((initialVolume + 0.1).toFixed(1)));
  });

  it('decreases volume when ArrowDown is pressed', async () => {
    wrapper.vm.volume = 0.5;
    window.dispatchEvent(createEvent('ArrowDown'));
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.volume).toBe(0.4);
  });

  it('toggles mute when M is pressed', async () => {
    const initialMuteState = wrapper.vm.isMuted;
    window.dispatchEvent(createEvent('m'));
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isMuted).toBe(!initialMuteState);
  });

  it('ignores shortcuts when focused on input', async () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const initialPlayingState = wrapper.vm.isPlaying;
    window.dispatchEvent(createEvent(' '));
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isPlaying).toBe(initialPlayingState);

    document.body.removeChild(input);
  });
});