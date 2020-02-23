import React from 'react';

export interface SongInfo {
  id: string;
  name: string;
  picUrl: string;
}

export interface RootState {
  clientWidth: number;
  loading: boolean;
  songInfo?: SongInfo;
}
export const initState: RootState = {
  clientWidth: 0,
  loading: false,
  songInfo: sessionStorage.songInfo ? JSON.parse(sessionStorage.songInfo) : void 0,
};

export const reducer = (state: RootState, action: any): RootState => {
  switch (action.type) {
    case 'setClientWidth':
      return { ...state, clientWidth: action.width }
    case 'showLoading':
      return { ...state, loading: true };
    case 'hideLoading':
      return { ...state, loading: false };
    case 'setSongInfo':
      return { ...state, songInfo: action.info };
    default:
      return state;
  }
};

const Store = React.createContext<{ state: any; dispatch: React.Dispatch<any> } | null>(null);

export default Store;
