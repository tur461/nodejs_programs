const Binance = require('binance-api-node').default;


async function getPrices() {
  const client = Binance();
  const prices = await client.prices();
  console.log('prices:', prices);
  const mPrice = prices.ETHUSDT;
  console.log('mPrice:', parseFloat(mPrice).toFixed(2));
}

getPrices().then().catch();

