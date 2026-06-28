import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, RefreshCw, Plus, Circle } from 'lucide-react'
import { useStore } from '../store/useStore'

const LAYERS = [
  { name:'Orchestrator',   color:'#00ff87', emoji:'🎯' },
  { name:'Sub-Agent',      color:'#00c6ff', emoji:'🤖' },
  { name:'Sub-Sub-Agent',  color:'#a78bfa', emoji:'⚙️' },
  { name:'Deep Agent',     color:'#f97316', emoji:'🔬' },
  { name:'Leaf Agent',     color:'#f43f5e', emoji:'🌿' },
]

const DEMO = [
  { id:'root',  name:'Orchestrator',   layer:0, parent:null,   status:'working' },
  { id:'sa1',   name:'Research Agent', layer:1, parent:'root', status:'working' },
  { id:'sa2',   name:'Code Agent',     layer:1, parent:'root', status:'idle' },
  { id:'ssa1',  name:'Web Scraper',    layer:2, parent:'sa1',  status:'working' },
  { id:'ssa2',  name:'Analyzer',       layer:2, parent:'sa1',  status:'idle' },
  { id:'ssa3',  name:'Builder',        layer:2, parent:'sa2',  status:'idle' },
  { id:'da1',   name:'Extractor',      layer:3, parent:'ssa1', status:'working' },
]

function Node({ agent, all, onSpawn, depth=0 }) {
  const children = all.filter(a => a.parent === agent.id)
  const layer = LAYERS[depth] || LAYERS[4]
  const canSpawn = depth < 4 && children.length < 2

  return (
    <div className="flex flex-col items-center gap-0">
      <motion.div initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ delay: depth * .08, type:'spring', stiffness:300 }}
        className="group relative flex flex-col items-center">

        <div className="w-28 p-3 rounded-2xl text-center transition-all cursor-default"
          style={{ background:`${layer.color}0d`, border:`1px solid ${layer.color}35`,
            boxShadow: agent.status === 'working' ? `0 0 20px ${layer.color}20` : 'none' }}>
          <div className="text-xl mb-1">{layer.emoji}</div>
          <div className="text-xs font-semibold text-white truncate">{agent.name}</div>
          <div className="text-[10px] mt-0.5" style={{ color:layer.color }}>{layer.name}</div>
          <div className="flex items-center justify-center gap-1 mt-1.5">
            <Circle size={5} className={`fill-current ${agent.status === 'working' ? 'status-working' : ''}`}
              style={{ color: agent.status === 'working' ? layer.color : '#374151' }}/>
            <span className="text-[9px]" style={{ color: agent.status === 'working' ? layer.color : '#6b7280' }}>
              {agent.status}
            </span>
          </div>
        </div>

        {canSpawn && (
          <button onClick={() => onSpawn(agent.id)}
            className="absolute -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full flex items-center justify-center text-black"
            style={{ background:layer.color, left:'50%', transform:'translateX(-50%)' }}>
            <Plus size={12}/>
          </button>
        )}
      </motion.div>

      {/* connector + children */}
      {children.length > 0 && (
        <div className="flex flex-col items-center w-full">
          <div className="w-px h-6" style={{ background:`${layer.color}30` }}/>
          <div className="flex items-start gap-4 relative">
            {/* horizontal line */}
            {children.length > 1 && (
              <div className="absolute top-0 left-14 right-14 h-px"
                style={{ background:`${LAYERS[depth+1]?.color || '#fff'}25` }}/>
            )}
            {children.map(child => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-6" style={{ background:`${LAYERS[depth+1]?.color || '#fff'}30` }}/>
                <Node agent={child} all={all} onSpawn={onSpawn} depth={depth+1}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AgentTree() {
  const { agents, fetchAgents, spawnAgent } = useStore()
  useEffect(() => { fetchAgents(); const t = setInterval(fetchAgents, 4000); return () => clearInterval(t) }, [])

  const display = agents.length > 0
    ? agents.map((a,i) => ({ ...a, layer: a.layer - 1 || 0, emoji: LAYERS[a.layer-1]?.emoji || '🤖', parent: a.parent_id || null }))
    : DEMO

  const roots = display.filter(a => !a.parent)

  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitBranch size={22} style={{ color:'#00c6ff' }}/> Agent Tree
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">هرمية الوكلاء 5 طبقات — hover لإنشاء وكيل جديد</p>
        </div>
        <button onClick={fetchAgents} className="p-2 rounded-xl hover:bg-white/5 text-gray-500 transition">
          <RefreshCw size={16}/>
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap">
        {LAYERS.map((l,i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background:l.color }}/>
            <span className="text-gray-500">L{i+1}: {l.name}</span>
          </div>
        ))}
      </div>

      {/* Tree */}
      <div className="flex justify-center overflow-x-auto py-4">
        <div className="inline-block">
          {roots.map(r => <Node key={r.id} agent={r} all={display} onSpawn={spawnAgent} depth={0}/>)}
        </div>
      </div>

      {/* Layer stats */}
      <div className="grid grid-cols-5 gap-2">
        {LAYERS.map((l,i) => {
          const cnt = display.filter(a => (a.layer ?? 0) === i).length
          return (
            <div key={i} className="rounded-xl p-3 text-center glass" style={{ border:`1px solid ${l.color}18` }}>
              <div className="text-lg font-bold" style={{ color:l.color }}>{cnt}</div>
              <div className="text-[10px] text-gray-600 mt-0.5">{l.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
