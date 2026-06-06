export default async function handler(req, res) {
  // Allow requests from your site only
  res.setHeader('Access-Control-Allow-Origin', 'https://solarwakeslauncher.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { username, base64, sha } = req.body;
  if (!username || !base64) return res.status(400).json({ error: 'Missing fields' });

  const filePath = `skins/${username}.png`;
  const body = { message: `skin: ${username}`, content: base64, branch: 'main' };
  if (sha) body.sha = sha;

  const response = await fetch(
    `https://api.github.com/repos/Solarwakeslauncher/Solarwakes-api/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${process.env.GH_TOKEN}`, // never exposed
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  );

  const data = await response.json();
  if (!response.ok) return res.status(500).json({ error: data.message });
  return res.status(200).json({ ok: true });
}
