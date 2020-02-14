import React, { useEffect, useState, useRef } from 'react';
import { Icon } from 'antd-mobile';
import { req } from '../../util';
import useDebounce from '../../util/hooks/debounce';
import Result from './result';

export interface SearchConfig {
  limit: number;
  offset: number;
  count: number;
  isEnd: boolean;
}

export default () => {
  // 用来计算搜索的次数，还有一个功能，如果搜索文字没有改变的话，不会触发 useEffect 搜索，通过这个改变强制触发搜索
  const [searchCount, setCount] = useState(0);
  // input 输入框
  const searchBoxRef = useRef<HTMLInputElement>(null);
  // input 输入框的值
  const [text, setText] = useState('');
  // 热门推荐搜索词
  const [hotList, setHotList] = useState<any[]>([]);
  // 是否是输入法输入
  const [isCompositionInput, setIsCompositionInput] = useState(false);
  // 搜索建议列表
  const [suggest, setSuggest] = useState<any[]>([]);
  // 是否是搜索建议列表
  const [isSearchTips, setIsSearchTips] = useState(false);
  // 是否是搜索结果页
  const [isResultPage, setIsResultPage] = useState(false);
  // 搜索的关键词，改变的话，会触发搜索
  const [searchText, setSearchText] = useState('');
  // 搜索结果
  const [result, setResult] = useState<any>({});
  // 历史记录
  const [historyList, setHistoryList] = useState<string[]>([]);
  /** 这两个变量合并到 offsetConfig 这个对象里面 */
  // // 是否是下拉触发的搜索
  // const [isScrollTrigger, setIsScrollTrigger] = useState(false);
  // // 搜索的偏移
  // const [offset, setOffset] = useState(0);
  /** 发现如果 effect 同时依赖 isScrollTrigger offset 的时候，会由于改变这两个值的触发器在子组件，会导致触发两次 effect */
  const [offsetConfig, setOffsetConfig] = useState({
    offset: 0,
    isScrollTrigger: false,
  });
  // 防抖的 text，用于输入防抖
  const debounceText = useDebounce(text);
  // 搜索配置
  const searchConfig = useRef<SearchConfig>({
    limit: 20,
    offset: 0,
    count: 0,
    isEnd: false,
  });
  const textChange = (e: React.SyntheticEvent) => {
    const val = (e.target as HTMLInputElement).value;
    if (!isCompositionInput) {
      setText(val);
    }
  };
  const inputBegin = () => {
    setIsCompositionInput(true);
  };
  const inputEnded = (e: React.SyntheticEvent) => {
    const val = (e.target as HTMLInputElement).value;
    setText(val);
    setIsCompositionInput(false);
  };
  const recordSearchHistory = (songName: string) => {
    window.setTimeout(() => {
      const idx = historyList.indexOf(songName);
      if (idx !== -1) {
        historyList.splice(idx, 1);
      }
      historyList.unshift(songName);
      sessionStorage.setItem('history', historyList.toString());
      setHistoryList([...historyList]);
    }, 0);
  };
  const search = (e: React.SyntheticEvent) => {
    const which: number = (e as any).which;
    if (which === 13) {
      const val = (e.target as HTMLInputElement).value;
      setSearchText(val);
      setCount(c => c + 1);
      setOffsetConfig({
        offset: 0,
        isScrollTrigger: false,
      });
      searchBoxRef.current!.blur();
      recordSearchHistory(val);
    }
  };
  const clickHeadItem = () => {
    setSearchText(text);
    setCount(c => c + 1);
    setOffsetConfig({
      offset: 0,
      isScrollTrigger: false,
    });
    searchBoxRef.current!.blur();
    recordSearchHistory(text);
  };
  const clickItem = (e: React.SyntheticEvent) => {
    const innerText = (e.target as HTMLLIElement).innerText;
    searchBoxRef.current!.value = innerText;
    setText(innerText);
    setSearchText(innerText);
    setCount(c => c + 1);
    setOffsetConfig({
      offset: 0,
      isScrollTrigger: false,
    });
    searchBoxRef.current!.blur();
    recordSearchHistory(innerText);
  };
  const suggestList = () => {
    if (!suggest.length) {
      return null;
    }
    return suggest.map((item: any, index: number) => (
      <li className="tip" key={index} onClick={clickItem}>
        <Icon type="search" size="xs" className="icon" />
        <div className="tip-content">{item.keyword}</div>
      </li>
    ));
  };
  const clickHot = (e: React.SyntheticEvent) => {
    const innerText = (e.target as HTMLLIElement).innerText;
    searchBoxRef.current!.value = innerText;
    setText(innerText);
    setSearchText(innerText);
    setCount(c => c + 1);
    setOffsetConfig({
      offset: 0,
      isScrollTrigger: false,
    });
    recordSearchHistory(innerText);
  };
  const inputFocus = () => {
    setIsResultPage(false);
    // setNoNeepSuggest(false);
    setIsSearchTips(true);
  };
  const inputBlur = () => {
    if (!text) {
      setIsSearchTips(false);
    }
  };
  const clearInput = () => {
    setText('');
    setIsSearchTips(false);
    setIsResultPage(false);
    searchBoxRef.current!.value = '';
  };
  const clearIconVisible = (): React.CSSProperties => {
    if (!text) {
      return { visibility: 'hidden' };
    }
    return { visibility: 'visible' };
  };
  const holderVisible = (): React.CSSProperties => {
    if (text || isCompositionInput) {
      return { visibility: 'hidden' };
    }
    return { visibility: 'visible' };
  };
  useEffect(() => {
    const getHotList = async () => {
      const res = await req('/search/hot');
      if (res && res.result && res.result.hots) {
        setHotList(res.result.hots);
      }
    };
    getHotList();
  }, []);
  useEffect(() => {
    const history = localStorage.getItem('history');
    if (history) {
      setHistoryList(history.split(','));
    }
  }, []);
  useEffect(() => {
    const getSeggest = async () => {
      const res = await req(`/search/suggest?keywords=${debounceText}&type=mobile`);
      if (res && res.result && res.result.allMatch) {
        setSuggest(res.result.allMatch);
      } else {
        setSuggest([]);
      }
    };
    // 这里由于 debounceText 是延时改变的，如果直接搜索进入结果页面，这个值才改变，这会导致这里重新触发一次
    // 但是如果加入 isResultPage 判定, isResultPage 改变的时候也会触发这个，就会导致点删除掉输入框的时候，也会触发一次这个函数
    if (debounceText && !isResultPage) {
      setIsSearchTips(true);
      getSeggest();
    } else {
      setIsSearchTips(false);
    }
    // 删掉 isResultPage，避免上面注释的情况
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceText]);
  useEffect(() => {
    const getResult = async () => {
      const res = await req(
        `/search?limit=${searchConfig.current.limit}&keywords=${searchText}&offset=${searchConfig.current.offset}`
      );
      if (res && res.result) {
        let isEnd = false;
        const count = res.result.songCount;
        const songListCount = res.result.songs.length;
        if (!count || songListCount + searchConfig.current.offset >= count) {
          isEnd = true;
        }
        searchConfig.current.count = count;
        searchConfig.current.isEnd = isEnd;
        if (!offsetConfig.isScrollTrigger) {
          setResult(res.result);
        } else {
          const { songs } = result;
          const handledSongs = [...songs, ...res.result.songs];
          const handledResult = { ...result, songs: handledSongs };
          setResult(handledResult);
        }
        // setIsResultPage(true);
        // setNoNeepSuggest(false);
      }
    };
    if (searchText) {
      // 不是下拉触发的的搜索，重置搜索配置
      if (!offsetConfig.isScrollTrigger) {
        searchConfig.current.limit = 20;
        searchConfig.current.offset = 0;
        searchConfig.current.count = 0;
        searchConfig.current.isEnd = false;
        setIsResultPage(true);
        setResult({});
      } else {
        searchConfig.current.offset = offsetConfig.offset;
      }
      getResult();
    }
    // 这里如果设定了依赖 result，后果很严重
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, searchCount, offsetConfig]);
  return (
    <div className="search-page">
      <section className="input-box">
        <div className="input-cover">
          <Icon type="search" size="xxs" className="search-icon" />
          <label className="placeholder" style={holderVisible()}>
            搜索歌曲、歌手、专辑
          </label>
          <input
            type="search"
            name="search"
            className="input-content"
            autoComplete="off"
            onChange={textChange}
            onCompositionStart={inputBegin}
            onCompositionEnd={inputEnded}
            onKeyUp={search}
            onBlur={inputBlur}
            onFocus={inputFocus}
            defaultValue={text}
            ref={searchBoxRef}
            // 不能绑定 value，因为 onChange 如果没法改变 value 的话，会有无法输入的情况，
            // 中文的情况会导致这种情况
            // value
          ></input>
          <Icon
            type="cross-circle-o"
            className="clear-icon"
            size="xxs"
            onClick={clearInput}
            style={clearIconVisible()}
          ></Icon>
        </div>
      </section>
      <section style={{ display: isResultPage ? 'none' : 'block' }}>
        <section className="search-tip" style={{ display: isSearchTips ? 'block' : 'none' }}>
          <section className="search-info" onClick={clickHeadItem}>
            搜索“{text}”
          </section>
          <ul className="tips">{suggestList()}</ul>
        </section>
        <section className="search-default" style={{ display: isSearchTips ? 'none' : 'block' }}>
          <div className="search-hot">
            <div className="title">热门搜索</div>
            <ul className="list">
              {hotList.map(item => (
                <li className="list-item" key={item.first} onClick={clickHot}>
                  {item.first}
                </li>
              ))}
            </ul>
          </div>
          <div className="search-history">
            <ul className="list">
              {historyList.map((item: string, idx: number) => (
                <li className="list-item" onClick={clickItem} key={idx}>
                  <Icon type="right" size="xs" className="icon prefix-icon" />
                  <span className="item-content">{item}</span>
                  <Icon type="cross" size="xs" className="icon suffix-icon" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </section>
      <Result
        config={searchConfig.current}
        style={{ display: isResultPage ? 'block' : 'none' }}
        result={result}
        keyword={searchText}
        setOffsetConfig={setOffsetConfig}
      ></Result>
    </div>
  );
};
