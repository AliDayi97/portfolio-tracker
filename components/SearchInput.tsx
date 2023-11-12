'use client';

import { coinsList } from '@/data/coinsList';
import { useEffect, useState } from 'react';

type SearchInputProps = {
  watchlist: { stocks: any[]; crypto: any[] };
  setWatchlist: React.Dispatch<
    React.SetStateAction<{
      stocks: any[];
      crypto: any[];
    }>
  >;
};

export default function SearchInput({
  watchlist,
  setWatchlist,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [results, setResults] = useState<{
    stocks: any[];
    crypto: any[];
  }>();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 2000);

    if (searchTerm.length === 0) setResults({ crypto: [], stocks: [] });

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Effect to fetch data based on debounced search term
  useEffect(() => {
    const fetchData = async () => {
      // Perform your API requests here with debouncedSearchTerm
      // Update the 'results' state based on the API response
      const cryptoExact = coinsList.filter(
        (coin) =>
          coin.symbol.toLocaleLowerCase() ===
            debouncedSearchTerm.toLocaleLowerCase() ||
          coin.name.toLocaleLowerCase() ===
            debouncedSearchTerm.toLocaleLowerCase()
      );
      const crypto =
        cryptoExact.length > 0
          ? cryptoExact
          : coinsList.filter((coin) =>
              coin.name
                .toLocaleLowerCase()
                .startsWith(debouncedSearchTerm.toLocaleLowerCase())
            );

      const stocks = (
        await (
          await fetch(
            `https://api.polygon.io/v3/reference/tickers?apiKey=${process.env.NEXT_PUBLIC_POLYGON_STOCK_API_KEY}&search=${debouncedSearchTerm}&market=stocks`
          )
        ).json()
      ).results;

      setResults({ crypto, stocks });
    };

    if (debouncedSearchTerm) {
      fetchData();
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="max-w-3xl w-full">
      <div className="relative inline">
        <input
          type="text"
          placeholder="Search for crypto or stock"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 min-w-[20rem] mb-2"
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 px-2 py-1 text-gray-600 hover:text-gray-800 flex items-center opacity-50"
            onClick={() => setSearchTerm('')}
          >
            X
          </button>
        )}
      </div>
      <div>
        <ul className="max-h-44 overflow-auto">
          {results && results?.stocks.length > 0 && (
            <li key="stocks header">
              <h3 className="bold text-xl bg-slate-400">Stocks</h3>
            </li>
          )}
          {results?.stocks.map((result) => (
            <div key={result.name}>
              <hr />
              <li
                onClick={() => {
                  if (
                    watchlist.stocks.find(
                      (stock) => stock.ticker === result.ticker
                    )
                  )
                    return;
                  setWatchlist({
                    ...watchlist,
                    stocks: [...watchlist.stocks, result],
                  });
                  setSearchTerm('');
                }}
                className="cursor-pointer hover:bg-slate-200"
              >
                {result.name}
              </li>
            </div>
          ))}

          {results && results?.crypto.length > 0 && (
            <li key="crypto header">
              <h3 className="bold text-xl bg-lime-400">Crypto</h3>
            </li>
          )}
          {results?.crypto.map((result) => (
            <div key={result.id}>
              <hr />
              <li
                key={result.id}
                onClick={() => {
                  if (
                    watchlist.crypto.find((crypto) => crypto.id === result.id)
                  )
                    return;
                  setWatchlist({
                    ...watchlist,
                    crypto: [...watchlist.crypto, result],
                  });
                  setSearchTerm('');
                }}
                className="cursor-pointer hover:bg-lime-200"
              >
                {result.name}
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
