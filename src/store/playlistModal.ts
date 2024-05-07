import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '.';

interface PlaylistModal {
  visible: boolean;
  selectedListId?: string;
  isPrivate?: boolean;
  allowPlaylistAudioRemove?: boolean;
}

const initialState: PlaylistModal = {
  visible: false,
};

const slice = createSlice({
  name: 'playistModal',
  initialState,
  reducers: {
    updatePlaylistVisibility(playerState, {payload}: PayloadAction<boolean>) {
      playerState.visible = payload;
    },
    updateSelectedListId(playerState, {payload}: PayloadAction<string>) {
      playerState.selectedListId = payload;
    },
    updateIsPlaylistPrivate(playerState, {payload}: PayloadAction<boolean>) {
      playerState.isPrivate = payload;
    },
    updateAllowPlaylistAudioRemove(
      playerState,
      {payload}: PayloadAction<boolean>,
    ) {
      playerState.allowPlaylistAudioRemove = payload;
    },
  },
});

export const getPlaylistModalState = createSelector(
  (state: RootState) => state,
  state => state.playlistModal,
);

export const {
  updatePlaylistVisibility,
  updateSelectedListId,
  updateIsPlaylistPrivate,
  updateAllowPlaylistAudioRemove,
} = slice.actions;

export default slice.reducer;
