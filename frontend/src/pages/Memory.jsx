import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Shield, ExternalLink, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'

const DEMO = [
  { id:1, content:'NVIDIA NIM API يدعم streaming عبر SSE في الوقت الحقيقي', source:'docs.nvidia.com', confidence:0.98 },
  { id:2, content:'MCP Protocol يستخدم JSON-RPC 2.0 للتواصل بين الوكلاء والأدوات', source:'modelcontextprotocol.io', confidence:0.97 },
  { id:3, content:'PayPal Bug Bounty يطلب X-HackerOne-Research header في كل طلب', source:'hackerone.com/paypal', confidence:0.99 },
  { id:4, content:'Playwright يدعم headless Chrome مع stealth mode لتفادي الحظر', source:'playwright.dev', confidence:0.93 },
  { id:5, content:'deepseek-v4-pro هو الأقوى في الاستدلال المنطقي من نماذج NIM', source:'build.nvidia.com', confidence:0.95 },
]

export default function Memory() {
  const { memory=[], fetchMemory } = useStore()
  useEffect(() => { if (fetchMemory) fetchMemory() }, [])

  const items = (memory.length > 0 ? memory : DEMO)

  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain size={22} style={{ color:'#00c6ff' }}/> Agent Memory
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">معلومات موثوقة فقط — مصادر رسمية</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{ background:'rgba(0,255,135,.07)', border:'1px solid rgba(0,255,135,.2)', color:'#00ff87' }}>
          <Shield size={14}/> Verified Only
        </div>
      </div>

      <div className="space-y-3">
        {items.map((m,i) => (
          <motion.div key={m.id} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.06 }}
            className="p-5 rounded-2xl glass" style={{ border:'1px solid rgba(0,198,255,.1)' }}>
            <p className="text-gray-200 text-sm leading-relaxed">{m.content}</p>
            <div className="flex items-center justify-between mt-3">
              <a href={`https://${m.source}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] hover:underline" style={{ color:'#00c6ff' }}>
                <ExternalLink size={10}/> {m.source}
              </a>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-gray-500">Confidence</span>
                  <div className="w-20 h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full transition-all"
                      style={{ width:`${m.confidence*100}%`, background: m.confidence>.95 ? '#00ff87' : m.confidence>.8 ? '#fbbf24' : '#ef4444' }}/>
                  </div>
                  <span style={{ color:'#00ff87' }}>{Math.round(m.confidence*100)}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
