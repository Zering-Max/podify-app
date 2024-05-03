import TrackPlayer, {Event} from 'react-native-track-player';
import {getClient} from './api/client';

let timeoutId: any;
// Empêcher multiple request de sendHistory
const debounce = (func: Function, delay: number) => {
  return (...args: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

interface StaleAudio {
  audio: string;
  progress: number;
  date: Date;
}

const sendHistory = async (staleAudio: StaleAudio) => {
  const client = await getClient();
  await client
    .post('/history', {
      ...staleAudio,
    })
    .catch(err => console.log(err));
};

const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async e => {
    const lists = await TrackPlayer.getQueue();
    const audio = lists[e.track];

    const staleAudio = {
      audio: audio.id,
      progress: e.position,
      date: new Date(Date.now()),
    };
    const debounceHistory = debounce(sendHistory, 200);
    debounceHistory(staleAudio);
  });
};

export default playbackService;
