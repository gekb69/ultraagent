import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { v4 as uuid } from 'uuid'
dotenv.config()

const app = express()
app.use(cors({ origin:'*' }))
app.use(express.json())

const NVIDIA_KEY = process.env.NVIDIA_API_KEY || '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'
const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1'

// ── Agent tree (in-memory) ────────────────────────────────────────────────
const agents = new Map()
agents.set('root', { id:'root', name:'Orchestrator', layer:1, status:'idle', parent_id:null })

// ── Models ────────────────────────────────────────────────────────────────
app.get('/api/models', async (req, res) => {
  try {
    const r = await fetch(`${NVIDIA_BASE}/models`, { headers:{ Authorization:`Bearer ${NVIDIA_KEY}` } })
    const d = await r.json()
    const models = (d.data || []).map(m => m.id)
    res.json({ models, total: models.length })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Chat (SSE streaming) ──────────────────────────────────────────────────
const SYSTEM = `You are UltraAgent Orchestrator — a powerful multi-agent AI platform exceeding Perplexity AI and Manus AI.
You operate as Layer 1 of a 5-layer hierarchical agent system.
You can spawn sub-agents, perform web automation, analyze images, and run 24/7 workflows.
Be direct, concise, and always helpful. Support Arabic and English equally.`

app.post('/api/chat', async (req, res) => {
  const { message, model='deepseek-ai/deepseek-v4-pro', history=[] } = req.body
  if (!message) return res.status(400).json({ error:'message required' })

  res.setHeader('Content-Type','text/event-stream')
  res.setHeader('Cache-Control','no-cache')
  res.setHeader('Connection','keep-alive')
  res.setHeader('Access-Control-Allow-Origin','*')
  res.flushHeaders()

  const messages = [
    { role:'system', content:SYSTEM },
    ...history.slice(-8),
    { role:'user', content:message }
  ]

  try {
    const r = await fetch(`${NVIDIA_BASE}/chat/completions`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${NVIDIA_KEY}` },
      body: JSON.stringify({ model, messages, temperature:0.7, max_tokens:2048, stream:true })
    })

    if (!r.ok) {
      const err = await r.text()
      res.write(`data: ${JSON.stringify({ choices:[{ delta:{ content:`❌ API Error: ${err}` } }] })}\n\n`)
      res.write('data: [DONE]\n\n')
      return res.end()
    }

    const reader = r.body.getReader()
    const dec = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = dec.decode(value)
      for (const line of chunk.split('\n')) {
        if (line.startsWith('data: ')) res.write(line + '\n\n')
      }
    }
    res.write('data: [DONE]\n\n')
    res.end()
  } catch(e) {
    res.write(`data: ${JSON.stringify({ choices:[{ delta:{ content:`❌ ${e.message}` } }] })}\n\n`)
    res.write('data: [DONE]\n\n')
    res.end()
  }
})

// ── Agents ────────────────────────────────────────────────────────────────
app.get('/api/agents', (req, res) => {
  res.json({ agents: [...agents.values()] })
})

app.post('/api/agents/:id/spawn', (req, res) => {
  const parent = agents.get(req.params.id)
  if (!parent) return res.status(404).json({ error:'Parent not found' })
  const siblings = [...agents.values()].filter(a => a.parent_id === req.params.id)
  if (siblings.length >= 2 && parent.layer < 4) return res.status(400).json({ error:'Max children reached' })
  const child = { id:uuid(), name:`Agent-${Date.now().toString(36)}`, layer:parent.layer+1, status:'idle', parent_id:req.params.id }
  agents.set(child.id, child)
  res.json({ agent: child })
})

// ── Tasks ─────────────────────────────────────────────────────────────────
const tasks = []
app.get('/api/tasks', (req, res) => res.json({ tasks }))
app.post('/api/tasks', (req, res) => {
  const t = { id:uuid(), title:req.body.title||'Task', status:'pending', created:new Date().toISOString() }
  tasks.push(t); res.json({ task:t })
})

// ── Memory ────────────────────────────────────────────────────────────────
const memory = [
  { id:1, content:'NVIDIA NIM API يدعم streaming عبر SSE', source:'docs.nvidia.com', confidence:0.98 },
  { id:2, content:'MCP Protocol يستخدم JSON-RPC 2.0', source:'modelcontextprotocol.io', confidence:0.97 },
]
app.get('/api/memory', (req, res) => res.json({ memory }))

// ── Health ────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ ok:true, agents: agents.size }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 UltraAgent backend on :${PORT}`))
