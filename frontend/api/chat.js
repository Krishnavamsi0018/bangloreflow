const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GROQ_API_KEY on server' });
  }

  try {
    const {
      model = 'llama-3.1-8b-instant',
      system,
      prompt,
      stream = true,
      temperature = 0.5,
      max_tokens = 420,
    } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const body = {
      model,
      temperature,
      max_tokens,
      stream,
      messages: [
        {
          role: 'system',
          content:
            system ||
            'You are BengaluruFlow AI. Give concise, practical, city-aware guidance for gig workers and city operators in Bengaluru.',
        },
        { role: 'user', content: prompt },
      ],
    };

    const upstream = await fetch(GROQ_CHAT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return res.status(upstream.status).json({ error: errText || 'Groq request failed' });
    }

    if (!stream) {
      const json = await upstream.json();
      return res.status(200).json(json);
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Unexpected server error' });
  }
}
