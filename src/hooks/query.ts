import {useQuery} from '@tanstack/react-query';
import {useDispatch} from 'react-redux';
import {AudioData, CompletePlaylist, History, Playlist} from 'src/@types/audio';
import {PublicProfile} from 'src/@types/user';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {updateNotification} from 'src/store/notification';

const fetchLatestUploads = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['latest-uploads'],
    queryFn: () => fetchLatestUploads(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
  return query;
};

const fetchRecommended = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/profile/recommended');
  return data.audios;
};

export const useFetchRecommendedAudios = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['recommended'],
    queryFn: () => fetchRecommended(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
  return query;
};

export const fetchPlaylist = async (pageNumber = 0): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client(
    `/playlist/by-profile?limit=10&pageNumber=${pageNumber}`,
  );
  return data.playlist;
};

export const useFetchPlaylist = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['playlist'],
    queryFn: () => fetchPlaylist(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
  return query;
};

const fetchUploadsByProfile = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/profile/uploads');
  return data.audios;
};

export const useFetchUploadsByProfile = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['uploads-by-profile'],
    queryFn: () => fetchUploadsByProfile(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
  return query;
};

const fetchFavorites = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/favorite');
  return data.audios;
};

export const useFetchFavorites = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['favorite'],
    queryFn: () => fetchFavorites(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
  return query;
};

export const fetchHistories = async (pageNumber = 0): Promise<History[]> => {
  const client = await getClient();
  const {data} = await client(`/history?limit=15&pageNumber=${pageNumber}`);
  return data.histories;
};

export const useFetchHistories = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['histories'],
    queryFn: () => fetchHistories(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
  return query;
};

const fetchRecentlyPlayed = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/history/recently-played');
  return data.audios;
};

export const useFetchRecentlyPlayed = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['recently-played'],
    queryFn: () => fetchRecentlyPlayed(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
  return query;
};

const fetchRecommendedPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client('/profile/auto-generated-playlist');
  return data.playlist;
};

export const useFetchRecommendedPlaylist = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['recommended-playlist'],
    queryFn: () => fetchRecommendedPlaylist(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
  return query;
};

const fetchIsFavorite = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const {data} = await client(`/favorite/is-fav?audioId=${id}`);
  return data.result;
};

export const useFetchIsFavorite = (id: string) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['favorite', id],
    queryFn: () => fetchIsFavorite(id),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
    // Permet de déclencher le hook en 'async' si l'id n'est pas encore arrivé
    enabled: id ? true : false,
  });
  return query;
};

const fetchPublicProfile = async (id: string): Promise<PublicProfile> => {
  const client = await getClient();
  const {data} = await client(`/profile/info/${id}`);
  return data.profile;
};

export const useFetchPublicProfile = (id: string) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['profile', id],
    queryFn: () => fetchPublicProfile(id),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
    // Permet de déclencher le hook en 'async' si l'id n'est pas encore arrivé
    enabled: id ? true : false,
  });
  return query;
};

const fetchPublicUploads = async (id: string): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client(`/profile/uploads/${id}`);
  return data.audios;
};

export const useFetchPublicUploads = (id: string) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['uploads', id],
    queryFn: () => fetchPublicUploads(id),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
    // Permet de déclencher le hook en 'async' si l'id n'est pas encore arrivé
    enabled: id ? true : false,
  });
  return query;
};

const fetchPublicPlaylist = async (id: string): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client(`/profile/playlist/${id}`);
  return data.playlist;
};

export const useFetchPublicPlaylist = (id: string) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['playlist', id],
    queryFn: () => fetchPublicPlaylist(id),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
    // Permet de déclencher le hook en 'async' si l'id n'est pas encore arrivé
    enabled: id ? true : false,
  });
  return query;
};

const fetchPlaylistAudios = async (
  id: string,
  isPrivate: boolean,
): Promise<CompletePlaylist> => {
  const endpoint = isPrivate
    ? `/profile/private-playlist-audios/${id}`
    : `/profile/playlist-audios/${id}`;
  const client = await getClient();
  const {data} = await client(endpoint);
  return data.list;
};

export const useFetchPlaylistAudios = (id: string, isPrivate: boolean) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['playlist-audios', id],
    queryFn: () => fetchPlaylistAudios(id, isPrivate),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
    // Permet de déclencher le hook en 'async' si l'id n'est pas encore arrivé
    enabled: id ? true : false,
  });
  return query;
};

const fetchIsFollowing = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const {data} = await client(`/profile/is-following/${id}`);
  return data.status;
};

export const useFetchIsFollowing = (id: string) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['is-following', id],
    queryFn: () => fetchIsFollowing(id),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
    // Permet de déclencher le hook en 'async' si l'id n'est pas encore arrivé
    enabled: id ? true : false,
  });
  return query;
};
