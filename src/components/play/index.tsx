import React, { useState, useRef, useContext } from 'react';
import Progress from './progress';
import { matrix2Deg } from '../../util';
import Store from '../../store';
import './play.less';

const Play = () => {
  const store = useContext(Store);
  const state = store!.state;
  const [parsed, setParsed] = useState<boolean>(false);
  /** 用于控制圆盘是否转动，播放的时候圆盘是转动的，暂停的时候不是 */
  const [imgClass, setImgClass] = useState('song-img');
  /** 上次暂停停止的角度，默认是0 */
  const [lastDeg, setLastDeg] = useState<number>(0);
  /** Audio 标签的引用 */
  const audioTag = useRef<HTMLAudioElement | null>(null);
  /** 下一个歌词所在行 */
  const nextLrc = useRef<HTMLDivElement | null>(null);
  /** 歌曲长度 */
  const [duration, setDuration] = useState<number | undefined>(void 0);
  /** 当前播放时间 */
  const [current, setCurrent] = useState<number>(0);
  const [scrollTranslate, setScrollTranslate] = useState<number>(0);
  const picStyle = { backgroundImage: `url(${state.songInfo.picUrl})` };
  /**
   * 切换播放和暂停状态
   */
  const toggle = () => {
    if (audioTag.current!.paused) {
      setImgClass('song-img circling');
      audioTag.current!.play();
      setParsed(false);
    } else {
      setImgClass('song-img');
      const imgTag = document.querySelector<HTMLDivElement>('.song-img');
      const rollTag = document.querySelector<HTMLDivElement>('.song-roll-wrap');
      const eleTransform = window.getComputedStyle(imgTag!).transform;
      const matrix = eleTransform.match(/-?(\d+\.?\d*)/g);
      const matrixParams = [].slice.call(matrix!, 0, 4).map(Number);
      const offsetDeg = matrix2Deg(
        matrixParams[0],
        matrixParams[1],
        matrixParams[2],
        matrixParams[3]
      );
      const deg = offsetDeg + lastDeg;
      const finalDeg = deg >= 360 ? deg - 360 : deg;
      setLastDeg(finalDeg);
      rollTag!.style.transform = eleTransform;
      audioTag.current!.pause();
      setParsed(true);
    }
  };
  /**
   * 音频准备完成
   */
  const audioReady = () => {
    setImgClass('song-img circling');
    const dur = audioTag.current?.duration;
    setDuration(dur);
    const lyric: string = state.songInfo.lyric;
    if (lyric) {
      const firstLrc = document.querySelector<HTMLDivElement>('.lrc-item');
      firstLrc!.style.color = 'white';
      const nextEle = firstLrc!.nextElementSibling;
      nextLrc.current = nextEle as HTMLDivElement | null;
    }
  };
  /**
   * audio 的时间更新事件，用于动态更新歌词
   * @param e React的合成事件
   */
  const timeUpdate = (e: React.SyntheticEvent) => {
    const currentTime = (e.target as HTMLAudioElement).currentTime;
    let nextLrcTime = nextLrc.current?.getAttribute('data-timeline');
    if (nextLrcTime) {
      const compareTime = Number(nextLrcTime);
      // 因为动画有 .3秒，所以不能等时间线到的时候才滚歌曲，会有延迟的感觉
      if (compareTime - currentTime <= 0.3) {
        const ele = nextLrc.current!;
        const prevEle = ele.previousElementSibling as HTMLDivElement;
        const height = prevEle.offsetHeight;
        prevEle.style.color = null;
        ele.style.color = 'white';
        const nextEle = ele.nextElementSibling as HTMLDivElement | null;
        nextLrc.current = nextEle;
        setScrollTranslate(x => x + height);
      }
    }
    setCurrent(currentTime);
  };
  const renderLyric = () => {
    const lyric: string = state.songInfo.lyric;
    if (!lyric) {
      return null;
    }
    const lyricList = lyric
      .split('\n')
      .slice(0, -1)
      .map(i => {
        const item = i.split(']');
        const time = item[0].slice(1);
        const [min, sec] = time.split(':').map(Number);
        const totalSec = (min * 60 + sec).toFixed(3);
        return [totalSec, item[1].trim()];
      });
    return lyricList.map((i: string[], idx: number) =>
      i[1] ? (
        <div className="lrc-item" data-timeline={i[0]} key={idx}>
          {i[1]}
        </div>
      ) : (
        <div className="lrc-item" data-timeline={i[0]} key={idx}>
          &nbsp;
        </div>
      )
    );
  };

  return (
    <section className="play" onClick={toggle}>
      <section className="recorder"></section>
      <section className="play-bg" style={picStyle}></section>
      <section className="play-zone">
        <div className="song-disc">
          <div className="song-roll-wrap" style={{ transform: `rotate(${lastDeg}deg)` }}>
            <div className={imgClass} style={picStyle}></div>
          </div>
          <div className="parse-icon" style={{ display: parsed ? undefined : 'none' }}></div>
        </div>
        <div className="song-info">
          <div className="song-title">
            <span className="song-name">{state.songInfo.name}</span>
            <span className="song-gap">-</span>
            <span className="artists">{state.songInfo.artists}</span>
          </div>
          <div className="lyric">
            <div className="song-scroll" style={{ transform: `translateY(-${scrollTranslate}px)` }}>
              {renderLyric()}
            </div>
          </div>
        </div>
        <div className="progress-bar">
          <Progress current={current} duration={duration!}></Progress>
        </div>
      </section>
      {state.songInfo.songUrl && (
        <audio
          src={state.songInfo.songUrl}
          autoPlay
          ref={audioTag}
          onCanPlay={audioReady}
          onTimeUpdate={timeUpdate}
        ></audio>
      )}
    </section>
  );
};

export default Play;
