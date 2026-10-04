const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// 允许 CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json());

// 代理入口
app.all('/api/proxy', async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send('missing url');
  try {
    const fetchOpts = {
      method: req.method,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    };
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length) {
      fetchOpts.body = JSON.stringify(req.body);
    }
    const resp = await fetch(target, fetchOpts);
    const text = await resp.text();
    res.status(resp.status).send(text);
  } catch (err) {
    res.status(500).send('proxy error: ' + err.message);
  }
});

app.get('/', (req, res) => res.send('feishu-proxy is running'));

app.listen(PORT, () => {
  console.log('Proxy listening on port ' + PORT);
});
