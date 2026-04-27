import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';
import crypto from 'crypto';
import { formatNumber } from '../exp.js';
globalThis.crypto = crypto;
const app = express();
const port = 3977;

const payload = {
    access_key: process.env.UPBIT_ACCESS_KEY,
    nonce: uuidv4(),
};

const jwtToken = jwt.sign(payload, process.env.UPBIT_SECRET_KEY);

const ws = new WebSocket("wss://api.upbit.com/websocket/v1", {
    headers: {
        authorization: `Bearer ${jwtToken}`
    }
});

ws.on("open", () => {
    console.log("connected!");
    const subscribe = [
        { 'ticket': 'proxy' }, 
        { 'type': 'ticker', 'codes': ['KRW-BTC', 'KRW-XCN'] }
    ]
    ws.send(JSON.stringify(subscribe));
});

ws.on("error", console.error)

ws.on("message", (data) => {
    const { opening_price, trade_price } = JSON.parse(data)
    const op = formatNumber(opening_price);
    const tp = formatNumber(trade_price);
    console.log(op + ' ' + tp);

});

ws.on("close", () => console.log("closed!"));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
