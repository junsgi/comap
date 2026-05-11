import WebSocket from 'ws';

function connectUpbit(callback) {
  const ws = new WebSocket('wss://api.upbit.com/websocket/v1');

  ws.on('open', () => {
    console.log('[UPBIT] connected');

    const subscribe = [
      { ticket: 'proxy' },
      {
        type: 'ticker',
        codes: ['KRW-BTC']
        // codes: ['KRW-BTC', 'KRW-XCN']
      }
    ];

    ws.send(JSON.stringify(subscribe));
  });

  ws.on('message', (data) => {
    const result = JSON.parse(data.toString());

    if (result.stream_type !== 'REALTIME') {
      return;
    }
    callback(result);
  });

  ws.on('error', (err) => {
    console.log('[UPBIT] websocket error');
    console.error(err);
  });

  ws.on('close', () => {
    console.log('[UPBIT] closed');

    // 나중에 재연결 로직 추가 위치
    // setTimeout(() => connectUpbit(callback), 3000);
  });

  return ws;
}

export default connectUpbit;

/*
{
  type: 'ticker',
  code: 'KRW-BTC',
  opening_price: 118170000,
  high_price: 119306000,
  low_price: 118106000,
  trade_price: 118982000,
  prev_closing_price: 118150000,
  acc_trade_price: 57567860940.64929,
  change: 'RISE',
  change_price: 832000,
  signed_change_price: 832000,
  change_rate: 0.0070418959,
  signed_change_rate: 0.0070418959,
  ask_bid: 'BID',
  trade_volume: 0.29403817,
  acc_trade_volume: 485.66044188,
  trade_date: '20260509',
  trade_time: '204749',
  trade_timestamp: 1778359669500,
  acc_ask_volume: 235.59518987,
  acc_bid_volume: 250.06525201,
  highest_52_week_price: 179869000,
  highest_52_week_date: '2025-10-09',
  lowest_52_week_price: 89000000,
  lowest_52_week_date: '2026-02-06',
  market_state: 'ACTIVE',
  is_trading_suspended: false,
  delisting_date: null,
  market_warning: 'NONE',
  timestamp: 1778359669590,
  acc_trade_price_24h: 69190460223.72954,
  acc_trade_volume_24h: 583.98807164,
  stream_type: 'REALTIME'
}
*/