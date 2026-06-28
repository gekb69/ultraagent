import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, MessageSquare, GitBranch, Zap, Brain, Cpu, Circle } from 'lucide-react'
import { useStore } from '../store/useStore'

const nav = [
  { to:'/',          icon:LayoutDashboard, label:'Dashboard',    color:'#00ff87' },
  { to:'/chat',      icon:MessageSquare,   label:'Chat',         color:'#00c6ff' },
  { to:'/agents',    icon:GitBranch,       label:'Agent Tree',   color:'#a78bfa' },
  { to:'/workflows', icon:Zap,             label:'Workflows',    color:'#00ff87' },
  { to:'/memory',    icon:Brain,           label:'Memory',       color:'#00c6ff' },
]

export default function Sidebar() {
  const { agents } = useStore()
  const active = agents.filter(a => a.status === 'working').length

  return (
    <motion.aside
      initial={{ x:-240 }} animate={{ x:0 }}
      transition={{ type:'spring', stiffness:300, damping:30 }}
      className="w-60 flex flex-col h-full"
      style={{ background:'#0a0f1c', borderRight:'1px solid rgba(255,255,255,.06)' }}
    >
      {/* Logo */}
      <div className="px-5 py-6" style={{ borderBottom:'1px solid rgba(255,255,255,.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:'linear-gradient(135deg,rgba(0,255,135,.2),rgba(0,198,255,.2))', border:'1px solid rgba(0,255,135,.3)' }}>
            <Cpu size={18} style={{ color:'#00ff87' }}/>
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight">UltraAgent</div>
            <div className="text-[10px] mt-0.5 font-medium" style={{ color:'rgba(0,255,135,.6)' }}>Multi-Agent Platform</div>
          </div>
        </div>

        {/* live badge */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background:'rgba(0,255,135,.08)', border:'1px solid rgba(0,255,135,.2)', color:'#00ff87' }}>
            <Circle size={6} className="fill-current status-working"/>
            {active} agent{active !== 1 ? 's' : ''} live
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon:Icon, label, color }) => (
          <NavLink key={to} to={to} end={to==='/'}
            className={({ isActive }) => [
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
              isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            ].join(' ')}
            style={({ isActive }) => isActive ? {
              background: `linear-gradient(90deg, ${color}15, transparent)`,
              border: `1px solid ${color}25`,
            } : {}}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} style={{ color: isActive ? color : undefined }} className="flex-shrink-0"/>
                <span>{label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background:color }}/>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Models footer */}
      <div className="px-4 py-4" style={{ borderTop:'1px solid rgba(255,255,255,.06)' }}>
        <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">NVIDIA NIM</div>
        <div className="space-y-1">
          {['deepseek-v4-pro','kimi-k2.6','minimax-m3'].map(m => (
            <div key={m} className="flex items-center gap-2 text-[11px] text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/60"/>
              {m}
            </div>
          ))}
          <div className="text-[10px] text-gray-600 mt-1">+118 more models</div>
        </div>
      </div>
    </motion.aside>
  )
}
