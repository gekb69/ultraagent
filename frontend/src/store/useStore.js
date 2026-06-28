import { create } from 'zustand'

const API = import.meta.env.VITE_API_URL || ''

// ─── 121 real NVIDIA models (dynamic fetch) ─────────────────────────────────
export const useStore = create((set, get) => ({
  // ── Models
  models: [],
  modelsLoading: false,
  selectedModel: 'deepseek-ai/deepseek-v4-pro',

  fetchModels: async () => {
    set({ modelsLoading: true })
    try {
      const r = await fetch(`${API}/api/models`)
      const d = await r.json()
      set({ models: d.models || [], modelsLoading: false })
    } catch {
      // fallback hardcoded
      set({
        modelsLoading: false,
        models: [
          'deepseek-ai/deepseek-v4-pro','deepseek-ai/deepseek-v4-flash',
          'moonshotai/kimi-k2.6','minimaxai/minimax-m3','minimaxai/minimax-m2.7',
          'meta/llama-3.3-70b-instruct','meta/llama-4-maverick-17b-128e-instruct',
          'nvidia/llama-3.1-nemotron-ultra-253b-v1','nvidia/nemotron-3-ultra-550b-a55b',
          'mistralai/mistral-large-3-675b-instruct-2512','qwen/qwen3.5-397b-a17b',
          'openai/gpt-oss-120b','z-ai/glm-5.1','google/gemma-4-31b-it',
          'writer/palmyra-creative-122b','sarvamai/sarvam-m'
        ]
      })
    }
  },

  setModel: (m) => set({ selectedModel: m }),

  // ── Chat
  messages: [],
  streaming: false,

  sendMessage: async (content) => {
    const { selectedModel, messages } = get()
    const userMsg = { id: Date.now(), role: 'user', content }
    const asstMsg = { id: Date.now()+1, role: 'assistant', content: '', model: selectedModel }
    set(s => ({ messages: [...s.messages, userMsg, asstMsg], streaming: true }))

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, model: selectedModel, history: messages.slice(-10) })
      })
      if (!res.ok) throw new Error(await res.text())

      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = dec.decode(value).split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const d = line.slice(6).trim()
          if (d === '[DONE]') break
          try {
            const tok = JSON.parse(d)?.choices?.[0]?.delta?.content || ''
            full += tok
            set(s => ({ messages: s.messages.map(m => m.id === asstMsg.id ? { ...m, content: full } : m) }))
          } catch {}
        }
      }
    } catch (e) {
      set(s => ({ messages: s.messages.map(m => m.id === asstMsg.id ? { ...m, content: `❌ ${e.message}` } : m) }))
    } finally {
      set({ streaming: false })
    }
  },

  sendVoiceMessage: async (transcript) => {
    await get().sendMessage(transcript)
  },

  clearChat: () => set({ messages: [] }),

  // ── Agents
  agents: [],
  fetchAgents: async () => {
    try {
      const r = await fetch(`${API}/api/agents`)
      const d = await r.json()
      set({ agents: d.agents || [] })
    } catch {}
  },
  spawnAgent: async (parentId) => {
    try {
      await fetch(`${API}/api/agents/${parentId}/spawn`, { method: 'POST' })
      get().fetchAgents()
    } catch {}
  },
}))
