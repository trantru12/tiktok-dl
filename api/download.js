module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Thiếu URL' });

  try {
    const r = await fetch(
      'https://www.tikwm.com/api/?url=' + encodeURIComponent(url) + '&hd=1'
    );
    const j = await r.json();

    if (j.code !== 0 || !j.data) {
      return res.status(400).json({
        error: 'Không tải được. Link có thể sai hoặc video ở chế độ riêng tư.'
      });
    }

    const d = j.data;
    const base = 'https://www.tikwm.com';
    const fix = (u) => (!u ? null : u.startsWith('http') ? u : base + u);

    return res.json({
      title: d.title || '',
      author: d.author?.nickname || '',
      cover: fix(d.cover),
      play: fix(d.play),
      hdplay: fix(d.hdplay || d.play),
      music: fix(d.music)
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
