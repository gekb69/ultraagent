import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Cpu, Check } from 'lucide-react'
import { useStore } from '../store/useStore'

// Group models by provider
function groupModels(models) {
  const groups = {}
  for (const m of models) {
    const provider = m.split('/')[0]
    if (!groups[provider]) groups[provider] = []
    groups[provider].push(m)
  }
  return groups
}

const PROVIDER_COLORS = {
  'deepseek-ai': '#00ff87',
  'moonshotai':  '#00c6ff',
  'minimaxai':   '#a78bfa',
  'meta':        '#60a5fa',
  'nvidia':      '#76b900',
  'mistralai':   '#ef4444',
  'google':      '#fbbf24',
  'openai':      '#10b981',
  'qwen':        '#f97316',
  'default':     '#94a3b8',
}

export default function ModelPicker() {
  const { models, modelsLoading, selectedModel, setModel, fetchModels } = useStore()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  useEffect(() => { fetchModels() }, [])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = models.filter(m => m.toLowerCase().includes(search.toLowerCase()))
  const groups = groupModels(filtered)
  const shortName = selectedModel.split('/').pop()
  const provider = selectedModel.split('/')[0]
  const color = PROVIDER_COLORS[provider] || PROVIDER_COLORS.default

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium glass glass-hover transition-all"
        style={{ border:`1px solid ${color}30`, minWidth:180 }}>
        <div className="w-2 h-2 rounded-full" style={{ background:color }}/>
        <span className="text-gray-200 truncate flex-1 text-left">{shortName}</span>
        {modelsLoading
          ? <div className="w-3 h-3 border border-gray-500 border-t-transparent rounded-full animate-spin"/>
          : <ChevronDown size={14} className="text-gray-500 flex-shrink-0" style={{ transform: open ? 'rotate(180deg)' : '', transition:'transform .2s' }}/>
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:6, scale:.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:4, scale:.97 }}
            transition={{ duration:.15 }}
            className="absolute top-full mt-2 right-0 z-50 rounded-2xl overflow-hidden shadow-modal"
            style={{ width:320, background:'#0d1220', border:'1px solid rgba(255,255,255,.1)' }}
          >
            {/* Search */}
            <div className="p-3" style={{ borderBottom:'1px solid rgba(255,255,255,.06)' }}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background:'rgba(255,255,255,.05)' }}>
                <Search size={13} className="text-gray-500"/>
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={`Search ${models.length} models…`}
                  className="flex-1 bg-transparent text-sm text-gray-200 outline-none placeholder-gray-600"/>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto" style={{ maxHeight:320 }}>
              {Object.entries(groups).map(([prov, items]) => {
                const c = PROVIDER_COLORS[prov] || PROVIDER_COLORS.default
                return (
                  <div key={prov}>
                    <div className="px-4 py-2 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-2"
                      style={{ color:c, borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                      <Cpu size={10}/> {prov}
                    </div>
                    {items.map(m => {
                      const name = m.split('/').pop()
                      const isSelected = m === selectedModel
                      return (
                        <button key={m} onClick={() => { setModel(m); setOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-all hover:bg-white/5"
                          style={{ color: isSelected ? c : '#9ca3af' }}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: isSelected ? c : 'rgba(255,255,255,.15)' }}/>
                          <span className="flex-1 truncate font-mono text-[12px]">{name}</span>
                          {isSelected && <Check size={12} style={{ color:c }}/>}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="py-8 text-center text-gray-600 text-sm">No models found</div>
              )}
            </div>

            <div className="px-4 py-2.5 text-[11px] text-gray-600" style={{ borderTop:'1px solid rgba(255,255,255,.06)' }}>
              {filtered.length} of {models.length} models · NVIDIA NIM
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
