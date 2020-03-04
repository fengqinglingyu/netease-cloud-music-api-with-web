import React from 'react';

export interface SongInfo {
  id: string;
  name: string;
  picUrl: string;
  songUrl: string;
}

export interface playingInfo {
  /** 当前播放时间 */
  current: number;
  /** 当前是否暂停 */
  parsed: boolean;
  /** 修改播放时间 */
  changeCurrent: (tiem: number) => void;
}

export interface RootState {
  clientWidth: number;
  loading: boolean;
  songInfo?: SongInfo;
}
export const initState: RootState = {
  clientWidth: 0,
  loading: false,
  songInfo: sessionStorage.songInfo
    ? JSON.parse(sessionStorage.songInfo)
    : void 0,
};

export const reducer = (state: RootState, action: any): RootState => {
  switch (action.type) {
    case 'setClientWidth':
      return { ...state, clientWidth: action.width };
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

const Store = React.createContext<{
  state: any;
  dispatch: React.Dispatch<any>;
} | null>(null);

export default Store;
