import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  let shortcuts: Record<string, () => void>;
  let { registerShortcuts, unregisterShortcuts } = useKeyboardShortcuts(shortcuts);

  beforeEach(() => {
    shortcuts = {
      ' ': vi.fn(),
      ArrowRight: vi.fn(),
      ArrowLeft: vi.fn(),
      ArrowUp: vi.fn(),
      ArrowDown: vi.fn(),
      m: vi.fn(),
      M: vi.fn(),
    };

    ({ registerShortcuts, unregisterShortcuts } = useKeyboardShortcuts(shortcuts));
  });

  afterEach(() => {
    unregisterShortcuts();
    vi.restoreAllMocks();
  });

  it('should register and unregister shortcuts', () => {
    registerShortcuts();
    expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

    unregisterShortcuts();
    expect(window.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should not trigger shortcuts when input is focused', () => {
    registerShortcuts();

    // Mock input element
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    // Trigger keydown event
    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);

    expect(shortcuts[' ']).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it('should trigger space shortcut', () => {
    registerShortcuts();

    const event = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(event);

    expect(shortcuts[' ']).toHaveBeenCalled();
  });

  it('should trigger arrow right shortcut', () => {
    registerShortcuts();

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    window.dispatchEvent(event);

    expect(shortcuts['ArrowRight']).toHaveBeenCalled();
  });

  it('should trigger arrow left shortcut', () => {
    registerShortcuts();

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(event);

    expect(shortcuts['ArrowLeft']).toHaveBeenCalled();
  });

  it('should trigger arrow up shortcut', () => {
    registerShortcuts();

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    window.dispatchEvent(event);

    expect(shortcuts['ArrowUp']).toHaveBeenCalled();
  });

  it('should trigger arrow down shortcut', () => {
    registerShortcuts();

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    window.dispatchEvent(event);

    expect(shortcuts['ArrowDown']).toHaveBeenCalled();
  });

  it('should trigger m shortcut', () => {
    registerShortcuts();

    const event = new KeyboardEvent('keydown', { key: 'm' });
    window.dispatchEvent(event);

    expect(shortcuts['m']).toHaveBeenCalled();
  });

  it('should trigger M shortcut', () => {
    registerShortcuts();

    const event = new KeyboardEvent('keydown', { key: 'M' });
    window.dispatchEvent(event);

    expect(shortcuts['M']).toHaveBeenCalled();
  });
});