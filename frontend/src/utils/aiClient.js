const GROQ_STREAM_DONE = '[DONE]'

function buildChatPayload({ prompt, system, temperature = 0.4, max_tokens = 380, stream = true }) {
  return {
    prompt,
    system,
    temperature,
    max_tokens,
    stream,
  }
}

function extractContentDelta(jsonLine) {
  return jsonLine?.choices?.[0]?.delta?.content || ''
}

export async function streamGroqChat({ prompt, system, onToken, signal }) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildChatPayload({ prompt, system, stream: true })),
    signal,
  })

  if (!response.ok || !response.body) {
    const errorText = await response.text()
    throw new Error(errorText || 'AI request failed')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let collected = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) return

      const payload = trimmed.replace(/^data:\s*/, '')
      if (!payload || payload === GROQ_STREAM_DONE) return

      try {
        const parsed = JSON.parse(payload)
        const token = extractContentDelta(parsed)
        if (!token) return
        collected += token
        if (onToken) onToken(collected, token)
      } catch (_) {
        // Ignore malformed lines and continue stream parsing.
      }
    })
  }

  return collected.trim()
}

export async function verifyIdentityImage({ imageBase64, mimeType }) {
  const response = await fetch('/api/vision-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json?.error || 'Identity verification failed')
  }

  return json
}
