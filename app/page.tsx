'use client';

import SearchInput from '@/components/SearchInput';
import Watchlist from '@/components/Watchlist';
import { useEffect, useState } from 'react';

export default function Home() {
  const [watchlist, setWatchlist] = useState<{
    stocks: any[];
    crypto: any[];
  }>({ stocks: [], crypto: [] });

  //use localstorage for persistent storage
  useEffect(() => {
    if (window.localStorage.getItem('watchlist')) {
      setWatchlist(JSON.parse(window.localStorage.getItem('watchlist') || ''));
    }
  }, []);

  //update localstorage when watchlist changes
  useEffect(() => {
    if (
      watchlist &&
      (watchlist.stocks.length > 0 || watchlist.crypto.length > 0)
    )
      window.localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <main className="flex min-h-screen flex-col items-center md:p-24 p-4">
      <SearchInput watchlist={watchlist} setWatchlist={setWatchlist} />
      <Watchlist watchlist={watchlist} setWatchlist={setWatchlist} />
    </main>
  );
}
