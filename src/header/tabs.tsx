import React from 'react';
import { Tabs } from 'antd-mobile';
import Recommend from '../components/recommend';
import Top from '../components/top';
import Search from '../components/search';

const tabs = [{ title: '推荐音乐' }, { title: '热歌榜' }, { title: '搜索' }];
export default () => {
  return (
    <Tabs tabs={tabs}>
      <Recommend></Recommend>
      <Top></Top>
      <Search></Search>
    </Tabs>
  );
};
