import express from 'express';
import { WebSocketServer } from 'ws';
import connectUpbit from './upbit.js';
const PORT = process.env.PORT || 3977;

const app = express();

app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.send('OK');
});

const server = app.listen(PORT, '0.0.0.0', () => console.log(`COMAP server running on http://localhost:${PORT}`));
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('[BROWSER] connected');

  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
    console.log('[BROWSER] disconnected');
  });
});

function broadcast(res) {
  const message = JSON.stringify(res);
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}


const Upbit_Callback = (res) => {
  // console.log(res.trade_price);
  broadcast({
    type: 'ticker',
    market: 'upbit',
    ...res
  });

  // 나중에 DB 추가 시 이 위치에서 저장
  // await saveTicker(ticker);
}
connectUpbit(Upbit_Callback);




// 나중에 Binance 연동 시
// connectBinance((ticker) => {
//   broadcast({
//     type: 'ticker',
//     ...ticker
//   });
// });