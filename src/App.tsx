import React, { useEffect, useState, useReducer } from 'react';
import FixHeader from './header';
import Tabs from './header/tabs';
import PlayList from './components/recommend/playList';
import Play from './components/play';
import './index.less';
import Store, { reducer, initState } from './store';

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  const [page, setPage] = useState('/');
  const jump = () => {
    const { location } = window;
    const { hash } = location;
    if (hash.includes('/playList')) {
      setPage('/playList');
    } else if (hash.includes('/play')) {
      setPage('/play');
    } else {
      setPage('/');
    }
  };
  const renderPage = () => {
    switch (page) {
      case '/playList':
        return <PlayList />;
      case '/play':
        return <Play />;
      case '/':
      default:
        return (
          <>
            <FixHeader />
            <main id="main">
              <Tabs />
            </main>
          </>
        );
    }
  };
  useEffect(() => {
    jump();
    window.addEventListener(
      'hashchange',
      () => {
        jump();
      },
      false
    );
  }, []);
  return (
    <div className="App">
      <Store.Provider value={{ state, dispatch }}>{renderPage()}</Store.Provider>
    </div>
  );
};

export default App;
