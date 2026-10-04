export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 预检
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 取目标 URL
  const target = req.query.url;
  if (!target) {
    return res.status(400).send('missing url');
  }

  // 转发
  try {
    const fetchOpts = {
      method: req.method,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // Vercel 会自动解析 body，需要重新序列化
      fetchOpts.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }
    const resp = await fetch(target, fetchOpts);
    const text = await resp.text();
    res.status(resp.status).send(text);
  } catch (err) {
    res.status(500).send('proxy error: ' + err.message);
  }
}
