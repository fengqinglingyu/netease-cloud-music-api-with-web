import React from 'react';

interface ProgressProps {
  /** 当前播放时间 */
  current: number;
  /** 音乐总长 */
  duration: number;
  /** 客户端宽度 */
  width: number;
  /** 设置播放时间 */
  setPlayTime: (time: number) => void;
}

/**
 * 播放进度条
 */
const Progress = ({ current, duration, width, setPlayTime }: ProgressProps) => {
  const percent = ((current / duration) * 100).toFixed(2);
  const click = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const offset = 10.769 * width / 100;
    const long = (100 - 2 * 10.769) * width / 100;
    const { pageX } = e
    const percent = (pageX - offset) / long;
    const time = duration * percent;
    setPlayTime(time)
  };
  const formatCurrent = () => {
    const time = Math.floor(current);
    const min = (time / 60) >>> 0;
    const sec = time % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }
  const formatDuration = React.useMemo(() => {
    const time = Math.floor(duration);
    const min = (time / 60) >>> 0;
    const sec = time % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }, [duration])
  return (
    <>
      <div className="progress" onClick={click}>
        <div className="finish" style={{ width: `${percent}%` }}></div>
      </div>
      <div className="play-time">
        {formatCurrent()} / {formatDuration}
      </div>
    </>
  );
};

export default React.memo(Progress);
