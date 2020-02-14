import React, { useEffect, useState } from 'react';
import { req, parseHashParam } from '../../util';
import { Icon } from 'antd-mobile';
import './playList.less';
import SongList from '../songList';

const PlayList = () => {
  const [id, setId] = useState<string | null>('');
  const [res, setRes] = useState<any>({});
  const [isFolded, setIsFolded] = useState<boolean>(true);
  const renderIntroDtl = () => {
    if (!res.description) {
      return null;
    }
    const strArr: string[] = res.description.split('\n');
    return strArr.map((str: string, idx: number) => (
      <span key={idx}>
        {idx ? str : '简介：' + str}
        <br />
      </span>
    ));
  };
  const changeFold = () => {
    setIsFolded(i => !i);
  };
  const foldClassName = () => (isFolded ? 'intro-dtl line-3' : 'intro-dtl');
  const formatPlayCount = (count: number): string => {
    if (!count) {
      return '0.0万';
    }
    const num = (count / 10000).toFixed(1);
    return num + '万';
  };
  useEffect(() => {
    const playListId = parseHashParam('id');
    setId(playListId);
  }, []);
  useEffect(() => {
    const getDetail = async () => {
      const result = await req(`/playlist/detail?id=${id}&s=0`);
      setRes(result?.playlist);
    };
    if (id) {
      getDetail();
    }
  }, [id]);
  return (
    <div id="play-list">
      <section id="play-list-header">
        <section
          className="play-list-bg"
          style={{ backgroundImage: `url(${res.coverImgUrl})` }}
        ></section>
      </section>
      <section id="play-list-detail">
        <div className="cover" style={{ backgroundImage: `url(${res.coverImgUrl})` }}>
          <span className="list-icon">歌单</span>
          <span className="list-play-count">{formatPlayCount(res.playCount)}</span>
        </div>
        <div className="play-list-info">
          <div className="play-list-name line-2">{res.name}</div>
          <div className="play-list-author">
            <div
              className="avatar"
              style={{ backgroundImage: `url(${res.creator?.avatarUrl})` }}
            ></div>
            <span className="author-name">{res.creator?.nickname}</span>
          </div>
        </div>
      </section>
      <section id="play-list-intro">
        <div className="play-list-tags">
          标签：
          {res.tags &&
            res.tags.map((item: string) => (
              <div key={item} className="play-list-tag">
                {item}
              </div>
            ))}
        </div>
        <div className="intro-dtl-box">
          <div className={foldClassName()}>{renderIntroDtl()}</div>
          {isFolded ? (
            <Icon type="down" className="icon-btn" size="xs" onClick={changeFold} />
          ) : (
            <Icon type="up" className="icon-btn" size="xs" onClick={changeFold} />
          )}
        </div>
      </section>
      <h3 className="title">歌曲列表</h3>
      <SongList songs={res.tracks} artists="ar" album="al" alias="alia" showRate></SongList>
    </div>
  );
};

export default PlayList;
