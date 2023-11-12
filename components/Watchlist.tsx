type WatchlistProps = {
  watchlist: { stocks: any[]; crypto: any[] };
  setWatchlist: React.Dispatch<
    React.SetStateAction<{
      stocks: any[];
      crypto: any[];
    }>
  >;
};

export default function Watchlist({ watchlist, setWatchlist }: WatchlistProps) {
  const fetchStockPrices = async () => {
    const stocks = watchlist.stocks;
    const tickers = stocks.map((stock) => stock.ticker).join(',');
    const result = await (
      await fetch(
        `https://financialmodelingprep.com/api/v3/quote-short/${tickers}?apikey=${process.env.NEXT_PUBLIC_FINANCIAL_MODELING_STOCK_API_KEY}`
      )
    ).json();

    const updatedStocks = stocks.map((stock) => {
      const stockData = result.find(
        (data: { symbol: string; price: number }) =>
          data.symbol === stock.ticker
      );
      return {
        ...stock,
        price: stockData ? stockData.price : null,
      };
    });

    setWatchlist((prev) => ({ stocks: updatedStocks, crypto: prev.crypto }));
  };

  const fetchCryptoPrices = async () => {
    const crypto = watchlist.crypto;
    const ids = crypto.map((coin) => coin.id).join(',');

    const result = await (
      await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      )
    ).json();

    const updatedCrypto = crypto.map((coin) => {
      const coinData = result[coin.id];
      console.log(result, coin.id);
      return {
        ...coin,
        price: coinData ? coinData.usd : null,
      };
    });

    setWatchlist((prev) => ({ crypto: updatedCrypto, stocks: prev.stocks }));
  };

  const fetchPrices = async () => {
    await fetchStockPrices();
    await fetchCryptoPrices();
  };

  return (
    <div className="overflow-auto w-full max-w-3xl">
      <div className="flex bg-orange-400 justify-between p-4">
        <h2 className="text-2xl bold">Watchlist</h2>
        <button className="bg-gray-100 rounded-md p-2" onClick={fetchPrices}>
          Fetch Prices
        </button>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-800">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Name</th>
            <th className="border border-gray-400 px-4 py-2">Symbol</th>
            <th className="border border-gray-400 px-4 py-2">Price</th>
            <th className="border border-gray-400 px-4 py-2">Holdings</th>
            <th className="border border-gray-400 px-4 py-2" colSpan={2}>
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td className="font-bold text-2xl">Stocks</td>
            <td></td>
            <td></td>
          </tr>
          {watchlist.stocks.map((stock) => (
            <tr key={stock.ticker}>
              <td className="border border-gray-400 px-4 py-2 font-bold">
                {stock.name}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                {stock.ticker}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                {stock.price}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                <input
                  type="number"
                  value={stock.holdings || 0}
                  min={0}
                  onChange={(e) => {
                    const newWatchlist = watchlist.stocks.map((s) => {
                      if (s.ticker === stock.ticker) {
                        return {
                          ...s,
                          holdings: Number(e.target.value),
                        };
                      }
                      return s;
                    });
                    setWatchlist({
                      ...watchlist,
                      stocks: newWatchlist,
                    });
                  }}
                />
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                {stock.holdings && stock.price
                  ? (stock.holdings * stock.price).toFixed(2)
                  : 0}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                <button
                  onClick={() => {
                    const newWatchlist = watchlist.stocks.filter(
                      (s) => s.ticker !== stock.ticker
                    );
                    setWatchlist({
                      ...watchlist,
                      stocks: newWatchlist,
                    });
                  }}
                >
                  X
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <td></td>
            <td></td>
            <td className="font-bold text-2xl">Crypto</td>
            <td></td>
            <td></td>
          </tr>
          {watchlist.crypto.map((coin) => (
            <tr key={coin.id}>
              <td className="border border-gray-400 px-4 py-2 font-bold">
                {coin.name}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {coin.symbol}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                {coin.price}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                <input
                  type="number"
                  value={coin.holdings || 0}
                  min={0}
                  onChange={(e) => {
                    const newWatchlist = watchlist.crypto.map((c) => {
                      if (c.id === coin.id) {
                        return {
                          ...c,
                          holdings: Number(e.target.value),
                        };
                      }
                      return c;
                    });
                    setWatchlist({
                      ...watchlist,
                      crypto: newWatchlist,
                    });
                  }}
                />
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                {coin.holdings && coin.price
                  ? (coin.holdings * coin.price).toFixed(2)
                  : 0}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                <button
                  onClick={() => {
                    const newWatchlist = watchlist.crypto.filter(
                      (c) => c.id !== coin.id
                    );
                    setWatchlist({
                      ...watchlist,
                      crypto: newWatchlist,
                    });
                  }}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
