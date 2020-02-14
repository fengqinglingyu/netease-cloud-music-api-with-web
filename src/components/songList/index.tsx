import React, { useContext } from 'react';
import { highlight, parsePath, parsePoiter, req } from '../../util';
import Store from '../../store';

export interface SongListProps {
  /** 歌曲列表 */
  songs: any[];
  /** 是否显示排名 */
  showRate?: boolean;
  /** 排名最小长度，不足签名补零，默认为2，需要显示排名的时候才有用 */
  rateMinLength?: number;
  /** 排名前几才会标记红，默认为3，需要显示排名才有用 */
  topRateMarked?: number;
  /** 对象实行名，如果是二级属性以上，传 xx.xxx */
  artists?: string;
  /** 对象实行名，如果是二级属性以上，传 xx.xxx */
  album?: string;
  alias?: string;
  /** 用于高亮的关键词 */
  keyword?: string;
  /** 歌曲点击回调函数 */
  onSongClick?: (item: any) => void;
}

/**
 * 组件用于抽取 songlist 相同的部分
 */
const SongList = ({
  songs,
  showRate = false,
  rateMinLength = 2,
  topRateMarked = 3,
  artists = 'artists',
  album = 'album',
  keyword = '',
  onSongClick,
  alias = 'alias',
}: SongListProps) => {
  const store = useContext(Store);
  const dispatch = store!.dispatch;
  const artistsPath = parsePath(artists);
  const albumPath = parsePath(album);
  const aliasPath = parsePath(alias);
  /**
   *
   * @param item 歌曲的全部信息
   * @paramartistsObj 艺术家信息
   * @param aliasList 歌曲的别名信息
   */
  const onItemClick = async (item: any, artistsList: string[] = [], aliasList: string[]) => {
    let name = item.name;
    if (aliasList?.length) {
      name += `（${aliasList.join('')}）`;
    }
    const artists = artistsList.join('/');
    const songUrl: any = await req(`/song/url?id=${item.id}`);
    const url = songUrl?.data[0]?.url || '';
    if (!url) {
      alert('无版权！请登录再试');
    }
    const [songInfo, lrcInfo] = await Promise.all([
      req(`/song/detail?ids=${item.id}`),
      req(`/lyric?id=${item.id}`),
    ]);
    const info = {
      name,
      artists,
      id: item.id,
      picUrl: songInfo?.songs[0]?.al?.picUrl || '',
      songUrl: url,
      lyric: lrcInfo?.lrc?.lyric,
    };
    sessionStorage.setItem('songInfo', JSON.stringify(info));
    dispatch({ type: 'setSongInfo', info });
    window.location.hash = `/play?id=${item.id}`;
    if (typeof onSongClick === 'function') {
      onSongClick(item);
    }
  };
  const renderAuthorAlbum = (artistsList: string[], album: any): string => {
    if (!artistsList || !artistsList.length) {
      return '';
    }
    let str = '';
    str += artistsList.join(' / ');
    if (album) {
      str += ' - ';
      str += album.name;
    }
    if (!keyword) {
      return str;
    }
    return highlight(str, keyword);
  };
  const renderRate = (idx: number) => {
    if (!showRate) {
      return null;
    }
    if (idx < topRateMarked) {
      return (
        <div className="new-songs-rate rate-top-marked">
          {(idx + 1).toString().padStart(rateMinLength, '0')}
        </div>
      );
    }
    return (
      <div className="new-songs-rate">{(idx + 1).toString().padStart(rateMinLength, '0')}</div>
    );
  };
  const renderAlias = (aliasList: string[] | undefined) => {
    if (!aliasList || !aliasList.length) {
      return null;
    }
    return <span className="new-songs-alias">({aliasList.join('')})</span>;
  };
  const renderSongs = () =>
    songs.map((item: any, idx: number) => {
      const artistsObj = parsePoiter(item, artistsPath);
      const artistsList: string[] = artistsObj.map((i: any) => i.name);
      const albumObj = parsePoiter(item, albumPath);
      const aliasObj: string[] = parsePoiter(item, aliasPath);
      return (
        <div
          className="new-songs-item"
          key={idx}
          onClick={() => onItemClick(item, artistsList, aliasObj)}
        >
          {renderRate(idx)}
          <div className="new-songs-info">
            {keyword ? (
              <div
                className="new-songs-title"
                dangerouslySetInnerHTML={{ __html: highlight(item.name, keyword) }}
              ></div>
            ) : (
              <div className="new-songs-title">
                {item.name} {renderAlias(aliasObj)}
              </div>
            )}
            {keyword ? (
              <div
                className="new-songs-extra"
                dangerouslySetInnerHTML={{ __html: renderAuthorAlbum(artistsList, albumObj) }}
              ></div>
            ) : (
              <div className="new-songs-extra">{renderAuthorAlbum(artistsList, albumObj)}</div>
            )}
          </div>
          <div className="play-button">
            <span className="btn-icon"></span>
          </div>
        </div>
      );
    });

  if (!songs || !songs.length) {
    return null;
  }
  return <section className="new-songs">{renderSongs()}</section>;
};

export default SongList;
