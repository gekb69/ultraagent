const NVIDIA_KEY = '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'
const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1'
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const SYSTEM = `أنت UltraAgent — منصة وكلاء AI متعددة الطبقات. تدعم العربية والإنكليزية. كن دقيقاً ومفيداً.`

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS })

    // Health
    if (url.pathname === '/api/health')
      return new Response(JSON.stringify({ ok: true, models: 121 }), { headers: { ...CORS, 'Content-Type': 'application/json' } })

    // Models
    if (url.pathname === '/api/models') {
      const r = await fetch(`${NVIDIA_BASE}/models`, { headers: { Authorization: `Bearer ${NVIDIA_KEY}` } })
      const d = await r.json()
      const models = (d.data || []).map(m => m.id)
      return new Response(JSON.stringify({ models, total: models.length }), { headers: { ...CORS, 'Content-Type': 'application/json' } })
    }

    // Chat (streaming)
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      const body = await request.json()
      const { message, model = 'deepseek-ai/deepseek-v4-pro', history = [] } = body

      const messages = [
        { role: 'system', content: SYSTEM },
        ...history.slice(-8),
        { role: 'user', content: message }
      ]

      const r = await fetch(`${NVIDIA_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NVIDIA_KEY}` },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 2048, stream: true })
      })

      return new Response(r.body, {
        headers: { ...CORS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
      })
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { ...CORS, 'Content-Type': 'application/json' } })
  }
}
