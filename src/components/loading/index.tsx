import React from 'react';
import { Icon } from 'antd-mobile';
// import { rootState } from '../../App';

// setTimeout(() => {
//   rootState.loading = false;
//   console.log(rootState.loading);
// }, 3000);

export default ({ loading }: { loading: boolean }) => {
  console.log(loading);
  if (!loading) {
    return <div></div>;
  }
  return (
    <div className="loading">
      <Icon type="loading"></Icon>
    </div>
  );
};
