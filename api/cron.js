module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

    // 이 두 개의 값은 백엔드가 알려줘서 Vercel에 환경 변수로 등록해야 한다
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const cronSecret = process.env.CRON_SECRET;

  if (!backendUrl) {
    return res.status(500).json({ success: false, error: 'Missing NEXT_PUBLIC_API_URL' });
  }

  try {
    const response = await fetch(`${backendUrl}/api/internal/rankings/update`, {
      method: 'POST',
      headers: {
        'X-Cron-Secret': cronSecret || '',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: 'Backend error',
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Fetch failed' });
  }
};