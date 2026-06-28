import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Activity, Cpu, Brain, Zap, MessageSquare, GitBranch, TrendingUp, Circle } from 'lucide-react'
import { useStore } from '../store/useStore'

function StatCard({ icon:Icon, label, value, color, delay, sub }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay }}
      className="rounded-2xl p-5 glass cursor-default"
      style={{ border:`1px solid ${color}18` }}>
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background:`${color}15`, border:`1px solid ${color}25` }}>
          <Icon size={18} style={{ color }}/>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{value}</div>
          {sub && <div className="text-[11px] mt-0.5" style={{ color }}>{sub}</div>}
        </div>
      </div>
      <div className="text-sm text-gray-400 mt-3">{label}</div>
    </motion.div>
  )
}

const QUICK = [
  { icon:'💬', label:'ابدأ محادثة', desc:'تكلم مع الـ Orchestrator مباشرة', path:'/chat', color:'#00ff87' },
  { icon:'🌿', label:'شجرة الوكلاء', desc:'شوف الـ 5 طبقات كاملة', path:'/agents', color:'#00c6ff' },
  { icon:'⚡', label:'إنشاء Workflow', desc:'أتمتة تشتغل 24/7', path:'/workflows', color:'#a78bfa' },
  { icon:'🧠', label:'ذاكرة النظام', desc:'شوف كل اللي تعلمه', path:'/memory', color:'#00ff87' },
]

export default function Dashboard() {
  const { agents, messages, fetchAgents } = useStore()
  const nav = useNavigate()

  useEffect(() => { fetchAgents(); const t = setInterval(fetchAgents, 5000); return () => clearInterval(t) }, [])

  const activeAgents = agents.filter(a => a.status === 'working').length

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full">
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-grad">UltraAgent</h1>
          <div className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5"
            style={{ background:'rgba(0,255,135,.1)', border:'1px solid rgba(0,255,135,.2)', color:'#00ff87' }}>
            <Circle size={6} className="fill-current status-working"/> LIVE
          </div>
        </div>
        <p className="text-gray-500 text-sm">منصة الوكلاء المتعددة · مدعوم بـ NVIDIA NIM · 121 نموذج</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Cpu}          label="وكلاء نشطون"   value={activeAgents}    color="#00ff87" delay={0}    sub={activeAgents > 0 ? 'يعمل' : 'جاهز'}/>
        <StatCard icon={Activity}     label="مجموع الوكلاء" value={agents.length || 5} color="#00c6ff" delay={.08} sub="5 طبقات"/>
        <StatCard icon={MessageSquare} label="رسائل"         value={messages.length} color="#a78bfa" delay={.16} sub="في الجلسة"/>
        <StatCard icon={Brain}        label="نماذج AI"      value={121}             color="#00ff87" delay={.24} sub="NVIDIA NIM"/>
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.2 }}>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK.map((q,i) => (
            <motion.button key={i} whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
              onClick={() => nav(q.path)}
              className="p-5 rounded-2xl text-left glass glass-hover transition-all"
              style={{ border:`1px solid ${q.color}15` }}>
              <div className="text-2xl mb-2">{q.icon}</div>
              <div className="font-semibold text-white text-sm">{q.label}</div>
              <div className="text-gray-500 text-xs mt-0.5">{q.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Models banner */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.35 }}
        className="rounded-2xl p-5 overflow-hidden relative"
        style={{ background:'linear-gradient(135deg,rgba(0,255,135,.06),rgba(0,198,255,.06))', border:'1px solid rgba(0,255,135,.12)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-white mb-1 flex items-center gap-2">
              <TrendingUp size={16} style={{ color:'#00ff87' }}/> النماذج المفضلة
            </div>
            <div className="flex flex-wrap gap-2">
              {['deepseek-v4-pro','kimi-k2.6','minimax-m3','llama-4-maverick','nemotron-ultra-253b'].map(m => (
                <span key={m} className="px-2.5 py-1 rounded-lg text-[11px] font-mono"
                  style={{ background:'rgba(0,0,0,.3)', color:'#00ff87', border:'1px solid rgba(0,255,135,.15)' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-grad-g">121</div>
            <div className="text-[11px] text-gray-500">نموذج متاح</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
