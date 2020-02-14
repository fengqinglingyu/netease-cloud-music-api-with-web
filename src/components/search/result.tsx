import React, { useRef, useEffect } from 'react';
import { SearchConfig } from '.';
import SongList from '../songList';
// import HighLight from 'react-highlight-words';
// const types = ['artist', 'mv', 'album'];

const visible: React.CSSProperties = {};
const hidden: React.CSSProperties = { display: 'none' };
export interface SearchResultProps {
  style?: React.CSSProperties;
  result?: any;
  /** 用于 html 高亮的关键词 */
  keyword: string;
  config: SearchConfig;
  setOffsetConfig?: React.Dispatch<
    React.SetStateAction<{
      offset: number;
      isScrollTrigger: boolean;
    }>
  >;
}

export default function SearchResult({
  style,
  result,
  keyword,
  config,
  setOffsetConfig,
}: SearchResultProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const isLoadingVisible = (): React.CSSProperties => {
    if (!result.songs || config.isEnd) {
      return hidden;
    }
    return visible;
  };
  const isNoResultVisible = (): React.CSSProperties => {
    if (!result.songs || !config.isEnd) {
      return hidden;
    }
    return visible;
  };
  // 组件加载完成，添加监视器
  useEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (divRef.current) {
        entries.forEach(item => {
          if (item.isIntersecting) {
            if (typeof setOffsetConfig === 'function') {
              setOffsetConfig({
                offset: config.limit + config.offset,
                isScrollTrigger: true,
              });
            }
          }
        });
      }
    });
    if (divRef.current) {
      observer.observe(divRef.current);
    }
    // 只需要开头触发一次就好，如果后续每次都创建一个观察者，内存泄漏警告
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="search-result" style={style}>
      <SongList songs={result.songs} keyword={keyword}></SongList>
      <div ref={divRef} style={isLoadingVisible()} className="label">
        加载中……
      </div>
      <div style={isNoResultVisible()} className="label">
        全部加载完
      </div>
    </section>
  );
}
