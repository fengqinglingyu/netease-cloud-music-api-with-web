import React, { useEffect, useState, useReducer, useRef } from 'react';
import FixHeader from './header';
import Tabs from './header/tabs';
import PlayList from './components/recommend/playList';
import Playing from './components/playing';
import './index.less';
import Store, { reducer, initState } from './store';
import { debounce } from './util';

export interface AudioInfo {
  duration: number;
  current: number;
  isParsed: boolean;
  isEnd: boolean;
  toggle: () => void;
  setTime: (val: number) => void;
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  const [page, setPage] = useState('/');
  /** audio 相关代码 从 playing 中拆分出来 */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** 歌曲长度 */
  const [duration, setDuration] = useState<number>(0);
  /** 当前播放时间 */
  const [current, setCurrent] = useState<number>(0);
  /** 是否暂停 */
  const [isParsed, setIsParsed] = useState<boolean>(true);
  /** 是否结束 */
  const [isEnd, setIsEnd] = useState<boolean>(false);
  /** 歌曲播放完了 */
  const songEnd = () => {
    setIsEnd(true);
    setIsParsed(true);
  };
  /** 歌曲准备好 */
  const audioReady = () => {
    const dur = audioRef.current?.duration || 0;
    setDuration(dur);
  };
  /** 时间更新 */
  const timeUpdate = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const currentTime = (e.target as HTMLAudioElement).currentTime;
    setCurrent(currentTime);
  };
  /** 修改播放进度 */
  const changeCurrent = (time: number) => {
    setCurrent(time);
    audioRef.current!.currentTime = time;
  };
  /** 修改播放状态 */
  const toggle = () => {
    let nextState;
    setIsParsed(p => {
      nextState = !p;
      return nextState;
    });
    if (nextState) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  };
  /** 重置播放状态 */
  const reset = () => {
    setDuration(0);
    setCurrent(0);
    setIsParsed(true);
    setIsEnd(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  /** audio 部分结束 */
  const jump = () => {
    const { location } = window;
    const { hash } = location;
    if (hash.includes('/playList')) {
      setPage('/playList');
    } else if (hash.includes('/play')) {
      setPage('/play');
    } else {
      setPage('/');
    }
  };
  const renderPage = () => {
    switch (page) {
      case '/playList':
        return <PlayList />;
      case '/play':
        return (
          <Playing
            toggle={toggle}
            duration={duration}
            current={current}
            isParsed={isParsed}
            isEnd={isEnd}
            setTime={changeCurrent}
          />
        );
      case '/':
      default:
        return (
          <>
            <FixHeader />
            <main id="main">
              <Tabs />
            </main>
          </>
        );
    }
  };
  useEffect(() => {
    jump();
    window.addEventListener(
      'hashchange',
      () => {
        jump();
        reset();
      },
      false
    );
  }, []);
  useEffect(() => {
    const getClientWidth = () => {
      const width = document.documentElement.clientWidth;
      dispatch({ type: 'setClientWidth', width });
    };
    window.addEventListener(
      'resize',
      debounce(() => {
        getClientWidth();
      }, 300),
      false
    );
    getClientWidth();
  }, []);
  return (
    <div className="App">
      <Store.Provider value={{ state, dispatch }}>
        {renderPage()}
        {state.songInfo?.songUrl && (
          <audio
            src={state.songInfo?.songUrl}
            ref={audioRef}
            onEnded={songEnd}
            onCanPlay={audioReady}
            onTimeUpdate={timeUpdate}
          ></audio>
        )}
      </Store.Provider>
    </div>
  );
};

export default App;
