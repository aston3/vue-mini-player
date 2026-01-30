import { ref, onMounted, onUnmounted } from 'vue';

type KeyboardShortcut = ' ' | 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown' | 'm' | 'M';

export function useKeyboardShortcuts(shortcuts: Record<KeyboardShortcut, () => void>) {
  const isRegistered = ref(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    // Skip if user is typing in an input field
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA'
    ) {
      return;
    }

    // Check if the key is in our shortcuts map
    if (shortcuts[event.key as KeyboardShortcut]) {
      event.preventDefault();
      try {
        shortcuts[event.key as KeyboardShortcut]();
      } catch (error) {
        console.error('Error executing keyboard shortcut:', error);
      }
    }
  };

  const registerShortcuts = () => {
    if (isRegistered.value) return;

    window.addEventListener('keydown', handleKeyDown);
    isRegistered.value = true;
  };

  const unregisterShortcuts = () => {
    if (!isRegistered.value) return;

    window.removeEventListener('keydown', handleKeyDown);
    isRegistered.value = false;
  };

  return {
    registerShortcuts,
    unregisterShortcuts,
  };
}