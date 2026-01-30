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
    const toggleSpy = vi.spyOn(wrapper.vm, 'togglePlayPause');
    window.dispatchEvent(createEvent(' '));
    expect(toggleSpy).toHaveBeenCalled();
  });

  it('seeks forward 5s when ArrowRight is pressed', async () => {
    const seekSpy = vi.spyOn(wrapper.vm, 'seek');
    window.dispatchEvent(createEvent('ArrowRight'));
    expect(seekSpy).toHaveBeenCalledWith(5);
  });

  it('seeks backward 5s when ArrowLeft is pressed', async () => {
    const seekSpy = vi.spyOn(wrapper.vm, 'seek');
    window.dispatchEvent(createEvent('ArrowLeft'));
    expect(seekSpy).toHaveBeenCalledWith(-5);
  });

  it('increases volume when ArrowUp is pressed', async () => {
    const volumeSpy = vi.spyOn(wrapper.vm, 'adjustVolume');
    window.dispatchEvent(createEvent('ArrowUp'));
    expect(volumeSpy).toHaveBeenCalledWith(0.1);
  });

  it('decreases volume when ArrowDown is pressed', async () => {
    const volumeSpy = vi.spyOn(wrapper.vm, 'adjustVolume');
    window.dispatchEvent(createEvent('ArrowDown'));
    expect(volumeSpy).toHaveBeenCalledWith(-0.1);
  });

  it('toggles mute when M is pressed', async () => {
    const muteSpy = vi.spyOn(wrapper.vm, 'toggleMute');
    window.dispatchEvent(createEvent('m'));
    expect(muteSpy).toHaveBeenCalled();
  });

  it('ignores shortcuts when focused on input', async () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const toggleSpy = vi.spyOn(wrapper.vm, 'togglePlayPause');
    window.dispatchEvent(createEvent(' '));
    expect(toggleSpy).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });
});