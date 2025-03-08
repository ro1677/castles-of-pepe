// pages/api/toss-payments-sdk.js
export default async function handler(req, res) {
  const sdkUrl = 'https://js.tosspayments.com/v2/standard';
  const response = await fetch(sdkUrl);
  const text = await response.text();
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*'); // 또는 "https://www.catpresso.com" 등 허용할 도메인 설정
  res.send(text);
}

