import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue';
import MusicPlayerCore from '../MusicPlayerCore';
import execSecTime from '../../utils/execSecTime';
import DraggableDirective from '../../directives/draggable';
import AdsorbDirective from '../../directives/wrapperAdsorb';
import defaultIcon from '../../assets/icon.jpg';
import '../../css/index.css';
import '../../assets/fonts/iconfont/iconfont.css';

interface SongInfo {
  id: string;
  name: string;
  img?: string;
}

export default defineComponent({
  name: 'VueMiniPlayerCore',
  directives: {
    draggable: DraggableDirective,
    'wrapper-adsorb': AdsorbDirective
  },
  setup() {
    const store = reactive({
      IsPlaying: false,
      IsMute: false,
      PlayMode: 1 as 1 | 2 | 3 | 4,
      CurrentSongId: '',
      SongIdList: [] as string[],
      SongIdMap: {} as Record<string, SongInfo>,
      PlayerCore: null as MusicPlayerCore | null,
      defaultIconPath: defaultIcon
    });

    const mediaCurrentTime = ref('00:00');
    const mediaDuration = ref('00:00');
    const showupPrecentage = ref(0);
    const dragging = ref(false);
    const onRight = ref(false);
    const hidden = ref(false);
    const hover = ref(false);
    const showList = ref(false);
    const hiddenTimer = ref<number | null>(null);
    const playerRef = ref<HTMLAudioElement | null>(null);

    const currentSongInfo = reactive({
      name: 'No Song',
      id: '',
      img: ''
    });

    const songInfoList = ref<SongInfo[]>([]);

    // Core methods
    const CorePlay = async () => {
      if (store.PlayerCore) {
        await store.PlayerCore.Play();
        store.IsPlaying = true;
      }
    };

    const CorePause = () => {
      if (store.PlayerCore) {
        store.PlayerCore.Pause();
        store.IsPlaying = false;
      }
    };

    const CorePlaySelectSong = (id: string) => {
      store.PlayerCore?.PlaySelectSong(id);
      updateCurrentSongInfo();
    };

    // Event handlers
    const wrapperMouseDown = () => {
      dragging.value = true;
    };

    const wrapperMouseUp = () => {
      dragging.value = false;
    };

    const wrapperMouseEnter = () => {
      hover.value = true;
      clearHiddenTimer();
    };

    const wrapperMouseLeave = () => {
      hover.value = false;
      startHiddenTimer();
    };

    const clickShow = () => {
      onRight.value = !onRight.value;
    };

    const switchListShow = () => {
      showList.value = !showList.value;
    };

    const clearHiddenTimer = () => {
      if (hiddenTimer.value) {
        clearTimeout(hiddenTimer.value);
        hiddenTimer.value = null;
      }
      hidden.value = false;
    };

    const startHiddenTimer = () => {
      hiddenTimer.value = window.setTimeout(() => {
        hidden.value = true;
      }, 2000);
    };

    const jumpTime = (e: MouseEvent) => {
      if (!playerRef.value || !store.PlayerCore) return;
      
      const track = e.currentTarget as HTMLElement;
      const rect = track.getBoundingClientRect();
      const percentage = (e.clientX - rect.left) / rect.width;
      const newTime = percentage * playerRef.value.duration;
      
      store.PlayerCore.ChangeCurrentSongTime(newTime);
      updateTimeDisplay();
    };

    // Update methods
    const updateCurrentSongInfo = () => {
      if (!store.PlayerCore) return;
      
      const currentSong = store.PlayerCore.QuerySongInfo(store.PlayerCore.CurrentSongId);
      if (currentSong) {
        currentSongInfo.name = currentSong.name;
        currentSongInfo.id = currentSong.id;
        currentSongInfo.img = currentSong.img || store.defaultIconPath;
      }
    };

    const updateTimeDisplay = () => {
      if (!playerRef.value) return;
      
      mediaCurrentTime.value = execSecTime(playerRef.value.currentTime);
      mediaDuration.value = execSecTime(playerRef.value.duration);
      showupPrecentage.value = (playerRef.value.currentTime / playerRef.value.duration) * 100;
    };

    const updateSongList = () => {
      songInfoList.value = store.SongIdList.map(id => store.SongIdMap[id]).filter(Boolean);
    };

    // Lifecycle hooks
    onMounted(() => {
      if (!playerRef.value) return;

      // Initialize player core with actual implementation
      store.PlayerCore = new MusicPlayerCore({ 
        defaultIconPath: store.defaultIconPath 
      });

      playerRef.value.addEventListener('timeupdate', updateTimeDisplay);
      playerRef.value.addEventListener('loadedmetadata', updateTimeDisplay);
      playerRef.value.addEventListener('ended', handleSongEnded);
      window.addEventListener('keydown', handleKeyDown);
      startHiddenTimer();
    });

    onUnmounted(() => {
      if (!playerRef.value) return;

      playerRef.value.removeEventListener('timeupdate', updateTimeDisplay);
      playerRef.value.removeEventListener('loadedmetadata', updateTimeDisplay);
      playerRef.value.removeEventListener('ended', handleSongEnded);
      window.removeEventListener('keydown', handleKeyDown);
      clearHiddenTimer();
    });

    const handleSongEnded = () => {
      if (!store.PlayerCore) return;

      switch (store.PlayerCore.PlayMode) {
        case 1: // Sequential
          if (store.SongIdList.indexOf(store.CurrentSongId) === store.SongIdList.length - 1) {
            CorePause();
          } else {
            store.PlayerCore.NextSong();
          }
          break;
        case 2: // Loop all
          store.PlayerCore.NextSong();
          break;
        case 3: // Loop single
          playerRef.value?.play();
          break;
        case 4: // Random
          let newIndex;
          const currentIndex = store.SongIdList.indexOf(store.CurrentSongId);
          do {
            newIndex = Math.floor(Math.random() * store.SongIdList.length);
          } while (newIndex === currentIndex);
          CorePlaySelectSong(store.SongIdList[newIndex]);
          break;
      }
    };

    // Keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement && ['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          store.IsPlaying ? CorePause() : CorePlay();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (playerRef.value) {
            const newTime = Math.min(
              playerRef.value.currentTime + 5,
              playerRef.value.duration
            );
            store.PlayerCore?.ChangeCurrentSongTime(newTime);
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (playerRef.value) {
            const newTime = Math.max(
              playerRef.value.currentTime - 5,
              0
            );
            store.PlayerCore?.ChangeCurrentSongTime(newTime);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (playerRef.value) {
            const newVolume = Math.min(playerRef.value.volume + 0.1, 1);
            playerRef.value.volume = newVolume;
            if (store.IsMute) {
              store.IsMute = false;
              playerRef.value.muted = false;
            }
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (playerRef.value) {
            const newVolume = Math.max(playerRef.value.volume - 0.1, 0);
            playerRef.value.volume = newVolume;
            if (store.IsMute) {
              store.IsMute = false;
              playerRef.value.muted = false;
            }
          }
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          if (playerRef.value) {
            store.IsMute = !store.IsMute;
            playerRef.value.muted = store.IsMute;
          }
          break;
      }
    };

    return {
      store,
      mediaCurrentTime,
      mediaDuration,
      showupPrecentage,
      dragging,
      onRight,
      hidden,
      hover,
      showList,
      currentSongInfo,
      songInfoList,
      playerRef,
      wrapperMouseDown,
      wrapperMouseUp,
      wrapperMouseEnter,
      wrapperMouseLeave,
      clickShow,
      switchListShow,
      clearHiddenTimer,
      CorePlay,
      CorePause,
      CorePlaySelectSong,
      jumpTime,
      handleKeyDown
    };
  }
});