import { BaseInfo, Overview } from "../../../ui/shared/overview";

async function getData(symbol) {
  const res = await fetch(
    `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${process.env.FMP_API_KEY}`
  );

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const data = await res.json();

  const baseInfo: BaseInfo = data.length
    ? {
        symbol: data[0].symbol,
        name: data[0].name,
        price: Math.round(data[0].price * 10) / 10,
        marketCap: data[0].marketCap,
        changesPercentage: Math.round(data[0].changesPercentage * 100) / 100,
        change: data[0].change,
        yearHigh: data[0].yearHigh,
        yearLow: data[0].yearLow,
        exchange: data[0].exchange,
        eps: Math.round(data[0].eps * 100) / 100,
        pe: Math.round(data[0].pe * 100) / 100,
        earningsAnnouncement: data[0].earningsAnnouncement,
      }
    : null;

  return baseInfo;
}

const Symbol = async ({ params: { symbol } }) => {
  const baseInfo = await getData(symbol);

  return (
    <div>
      <h1>{baseInfo?.earningsAnnouncement}</h1>
      <Overview baseInfo={baseInfo} />
    </div>
  );
};

export default Symbol;
