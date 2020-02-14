import React, { useEffect, useState } from 'react';
import { req } from '../../util';
import SongList from '../songList';

export default () => {
  const [newSongs, setNewSongs] = useState<any[]>([]);
  const [songsList, setSongsList] = useState<any[]>([]);
  useEffect(() => {
    const fetchSongsList = async () => {
      const res = await req('/personalized?limit=6');
      if (res && res.result) {
        setSongsList(res.result);
      }
    };
    const fetchNewSongs = async () => {
      const res = await req('/personalized/newsong');
      if (res && res.result) {
        setNewSongs(res.result);
      }
    };
    fetchSongsList();
    fetchNewSongs();
  }, []);
  const formatPlayCount = (count: number): string => {
    const num = (count / 10000).toFixed(1);
    return num + '万';
  };
  const clickPlayList = (id: string): void => {
    window.location.hash = `/playList?id=${id}`;
  };
  const renderPlayList = () => {
    return songsList.map(item => (
      <div className="remd-li" key={item.id} onClick={() => clickPlayList(item.id)}>
        <div className="remd-img">
          <img src={item.picUrl} alt={item.name} className="u-img" />
          <span className="u-earp remd_lnum">{formatPlayCount(item.playCount)}</span>
        </div>
        <div className="remd-text">{item.name}</div>
      </div>
    ));
  };
  return (
    <div className="recommend">
      <div className="remd-tl">推荐歌单</div>
      <section className="remd-songs">
        <div className="remd-list">{renderPlayList()}</div>
      </section>
      <div className="remd-tl">最新音乐</div>
      <SongList
        songs={newSongs}
        artists="song.artists"
        album="song.album"
        alias="song.alias"
      ></SongList>
    </div>
  );
};
