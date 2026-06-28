import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Plus, Play, Pause, Trash2, Clock, CheckCircle } from 'lucide-react'

const INIT = [
  { id:1, name:'Daily News Research',     schedule:'كل يوم 8:00 ص', active:true,  runs:47, last:'2h ago', color:'#00ff87' },
  { id:2, name:'Security Scan Automation',schedule:'كل 6 ساعات',    active:true,  runs:89, last:'1h ago', color:'#00c6ff' },
  { id:3, name:'Memory Consolidation',    schedule:'كل ليلة 2:00 ص',active:false, runs:12, last:'8h ago', color:'#a78bfa' },
]

const SCHEDULES = [
  { v:'5min',  l:'كل 5 دقائق' },
  { v:'hour',  l:'كل ساعة' },
  { v:'6h',    l:'كل 6 ساعات' },
  { v:'daily', l:'يومياً' },
  { v:'weekly',l:'أسبوعياً' },
]

export default function Workflows() {
  const [wfs, setWfs] = useState(INIT)
  const [showNew, setShowNew] = useState(false)
  const [name, setName] = useState('')
  const [sched, setSched] = useState('daily')

  const toggle = (id) => setWfs(w => w.map(x => x.id===id ? { ...x, active:!x.active } : x))
  const remove = (id) => setWfs(w => w.filter(x => x.id!==id))
  const create = () => {
    if (!name.trim()) return
    setWfs(w => [...w, { id:Date.now(), name, schedule:SCHEDULES.find(s=>s.v===sched)?.l||sched, active:true, runs:0, last:'never', color:'#00ff87' }])
    setName(''); setShowNew(false)
  }

  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap size={22} style={{ color:'#a78bfa' }}/> Workflows
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">أتمتة 24/7 — تشتغل حتى لو أنت نايم</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition hover:opacity-90"
          style={{ background:'linear-gradient(135deg,#00ff87,#00c6ff)' }}>
          <Plus size={15}/> Workflow جديد
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="rounded-2xl p-5 space-y-4 glass" style={{ border:'1px solid rgba(0,255,135,.25)' }}>
            <h3 className="font-semibold text-white">إنشاء Workflow جديد</h3>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="اسم الـ Workflow…"
              className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none glass"
              style={{ border:'1px solid rgba(255,255,255,.1)' }}/>
            <select value={sched} onChange={e => setSched(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm text-gray-300 outline-none glass"
              style={{ border:'1px solid rgba(255,255,255,.1)', background:'rgba(255,255,255,.04)' }}>
              {SCHEDULES.map(s => <option key={s.v} value={s.v} style={{ background:'#0d1220' }}>{s.l}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={create}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black"
                style={{ background:'linear-gradient(135deg,#00ff87,#00c6ff)' }}>إنشاء</button>
              <button onClick={() => setShowNew(false)}
                className="px-5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white glass glass-hover">إلغاء</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-3">
        {wfs.map((w,i) => (
          <motion.div key={w.id} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.06 }}
            className="flex items-center gap-4 p-5 rounded-2xl glass transition-all"
            style={{ border:`1px solid ${w.active ? w.color+'20' : 'rgba(255,255,255,.06)'}` }}>
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${w.active ? 'status-working' : ''}`}
              style={{ background: w.active ? w.color : '#374151' }}/>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm">{w.name}</div>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><Clock size={10}/> {w.schedule}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><CheckCircle size={10}/> {w.runs} تشغيل</span>
                <span>•</span>
                <span>آخر تشغيل: {w.last}</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-medium flex-shrink-0"
              style={{ background: w.active ? `${w.color}15` : 'rgba(255,255,255,.05)', color: w.active ? w.color : '#6b7280', border:`1px solid ${w.active ? w.color+'30' : 'transparent'}` }}>
              {w.active ? 'نشط' : 'متوقف'}
            </span>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => toggle(w.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition">
                {w.active ? <Pause size={14} className="text-yellow-400"/> : <Play size={14} className="text-green-400"/>}
              </button>
              <button onClick={() => remove(w.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition">
                <Trash2 size={14} className="text-red-400"/>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
