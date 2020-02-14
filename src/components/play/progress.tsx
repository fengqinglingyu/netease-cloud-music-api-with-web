import React from 'react';

/**
 * 进度条组件
 * @param param0
 */
const Progress = ({ current, duration }: { current: number; duration: number }) => {
  const percent = ((current / duration) * 100).toFixed(2);
  const mouseOver = (e: any) => {
    console.log('over');
  };
  const mouseMove = (e: any) => {
    console.log('move');
  };
  const click = (e: any) => {
    console.log('click');
  };
  return (
    <div className="progress" onMouseOver={mouseOver} onMouseMove={mouseMove} onClick={click}>
      <div className="finish" style={{ width: `${percent}%` }}></div>
      <i className="dot"></i>
    </div>
  );
};

export default Progress;
