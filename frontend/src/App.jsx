import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import AgentTree from './pages/AgentTree'
import Workflows from './pages/Workflows'
import Memory from './pages/Memory'

// Ambient orbs — pure CSS, no library needed
function Orbs() {
  return (
    <>
      <div className="orb" style={{ width:400, height:400, top:'-10%', left:'-5%', background:'radial-gradient(circle, rgba(0,255,135,.07), transparent 70%)' }}/>
      <div className="orb" style={{ width:350, height:350, top:'40%', right:'-8%', background:'radial-gradient(circle, rgba(0,198,255,.06), transparent 70%)', animationDelay:'2s' }}/>
      <div className="orb" style={{ width:300, height:300, bottom:'10%', left:'30%', background:'radial-gradient(circle, rgba(167,139,250,.05), transparent 70%)', animationDelay:'4s' }}/>
    </>
  )
}

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-mesh relative">
      <Orbs/>
      <div className="relative z-10 flex w-full h-full">
        <Sidebar/>
        <main className="flex-1 h-full overflow-hidden">
          <Routes>
            <Route path="/"          element={<Dashboard/>}/>
            <Route path="/chat"      element={<Chat/>}/>
            <Route path="/agents"    element={<AgentTree/>}/>
            <Route path="/workflows" element={<Workflows/>}/>
            <Route path="/memory"    element={<Memory/>}/>
          </Routes>
        </main>
      </div>
    </div>
  )
}
