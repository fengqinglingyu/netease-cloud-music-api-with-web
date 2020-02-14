import React, { useEffect, useState, useRef } from 'react';
import { req } from '../../util';
import SongList from '../songList';

let time: string = '';
(() => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  time = `${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`;
})();

const observedElementStyle = { height: 1, width: '100vw' };

export default () => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [end, setEnd] = useState<number>(20);
  const [songList, setSongList] = useState<any[]>([]);
  const [, setAllSongs] = useState<any[]>([]);
  // const onSongClick = (item: any) => {
  //   console.log(item);
  // };
  const initObserver = async () => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let songs: any[];
          let currEnd: number = 0;
          // 因为这个观察者是初始化第一个闭包的时候定义的
          // 这里拿到的 allSongs 永远都是第一个闭包环境的值
          // 所以要通过这种方式拿到最新的值
          setAllSongs(list => {
            songs = list;
            return list;
          });
          setEnd(e => {
            currEnd = e;
            return e + 20;
          });
          setSongList(songs!.slice(0, currEnd));
        }
      });
    });
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
  };
  useEffect(() => {
    const getSongList = async () => {
      const res = await req('/top/list?idx=1&limit=20');
      if (res && res.code === 200 && res.playlist && res.playlist.tracks) {
        initObserver();
        setAllSongs(res.playlist.tracks);
        setSongList(res.playlist.tracks.slice(0, end));
        setEnd(end + 20);
      }
    };
    getSongList();
    // 组件初始化的时候触发一次就好
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="top">
      <section className="top-header">
        <div className="top-logo"></div>
        <div className="top-time">更新时间：{time}</div>
      </section>
      <SongList songs={songList} artists="ar" album="al" alias="alia" showRate></SongList>
      <div ref={observerTarget} style={observedElementStyle}></div>
    </div>
  );
};
