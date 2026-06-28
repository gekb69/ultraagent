import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2, Mic, MicOff, Volume2, Copy, Check, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useStore } from '../store/useStore'
import { useSpeech, speak } from '../hooks/useSpeech'
import ModelPicker from '../components/ModelPicker'
import toast from 'react-hot-toast'

const SUGGESTIONS = [
  'ابحث عن أحدث أخبار الذكاء الاصطناعي',
  'حلل هذه الثغرة الأمنية',
  'اكتب كود Python لجرد المواقع',
  'ما هي أفضل نماذج NVIDIA NIM؟',
]

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="p-1 rounded-lg hover:bg-white/10 transition text-gray-500 hover:text-gray-300">
      {copied ? <Check size={13} className="text-green-400"/> : <Copy size={13}/>}
    </button>
  )
}

function MsgBubble({ msg, isLast, streaming }) {
  const isUser = msg.role === 'user'
  const isEmpty = !msg.content && isLast && streaming && !isUser

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
        style={ isUser
          ? { background:'linear-gradient(135deg,#3b82f6,#6366f1)' }
          : { background:'linear-gradient(135deg,rgba(0,255,135,.15),rgba(0,198,255,.15))', border:'1px solid rgba(0,255,135,.25)' }
        }>
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Bubble */}
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        {!isUser && msg.model && (
          <div className="text-[10px] text-gray-600 mb-1 ml-1 font-mono">{msg.model.split('/').pop()}</div>
        )}

        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? 'rounded-tr-sm max-w-xl' : 'rounded-tl-sm'}`}
          style={ isUser
            ? { background:'linear-gradient(135deg,#2563eb,#4f46e5)', color:'#fff' }
            : { background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', color:'#e2e8f0' }
          }>

          {isEmpty ? (
            <div className="flex gap-1 items-center h-5">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce"
                  style={{ animationDelay:`${i*150}ms` }}/>
              ))}
            </div>
          ) : isUser ? (
            <span>{msg.content}</span>
          ) : (
            <ReactMarkdown
              components={{
                code({ inline, className, children }) {
                  const lang = (className || '').replace('language-', '')
                  return inline ? (
                    <code className="px-1.5 py-0.5 rounded-md font-mono text-[12px]"
                      style={{ background:'rgba(0,255,135,.1)', color:'#00ff87' }}>
                      {children}
                    </code>
                  ) : (
                    <div className="mt-2 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2"
                        style={{ background:'#0a0f1c', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                        <span className="text-[11px] font-mono text-gray-500">{lang || 'code'}</span>
                        <CopyBtn text={String(children)}/>
                      </div>
                      <SyntaxHighlighter language={lang || 'text'} style={oneDark}
                        customStyle={{ margin:0, padding:'1rem', fontSize:12, background:'#080c14' }}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  )
                },
                p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
              }}>
              {msg.content}
            </ReactMarkdown>
          )}

          {!isUser && isLast && streaming && msg.content && (
            <span className="typing-cursor ml-0.5"/>
          )}
        </div>

        {/* Actions */}
        {!isUser && msg.content && !streaming && (
          <div className="flex gap-1 mt-1 ml-1">
            <CopyBtn text={msg.content}/>
            <button onClick={() => speak(msg.content, 'ar')}
              className="p-1 rounded-lg hover:bg-white/10 transition text-gray-500 hover:text-gray-300">
              <Volume2 size={13}/>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Chat() {
  const [input, setInput] = useState('')
  const { messages, streaming, sendMessage, clearChat } = useStore()
  const bottom = useRef(null)
  const textareaRef = useRef(null)

  const { listening, toggle: toggleMic } = useSpeech((text) => {
    setInput(text)
    toast.success(`🎤 "${text}"`, { duration:2000 })
  })

  useEffect(() => { bottom.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim() || streaming) return
    sendMessage(input.trim())
    setInput('')
    textareaRef.current?.focus()
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom:'1px solid rgba(255,255,255,.06)' }}>
        <div>
          <h1 className="font-bold text-white text-lg">Chat</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Orchestrator Agent · Layer 1</p>
        </div>
        <div className="flex items-center gap-2">
          <ModelPicker/>
          <button onClick={clearChat}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-red-400 transition">
            <Trash2 size={16}/>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.length === 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-6 pb-20">
            <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:4, repeat:Infinity }}
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-neon-g"
              style={{ background:'linear-gradient(135deg,rgba(0,255,135,.15),rgba(0,198,255,.1))', border:'1px solid rgba(0,255,135,.3)' }}>
              🤖
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-grad">UltraAgent جاهز</h2>
              <p className="text-gray-500 mt-2 text-sm max-w-sm">
                وكيل AI متعدد الطبقات — يتصفح، يحلل، يكتب كود، ويشغّل أتمتة 24/7
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTIONS.map((s,i) => (
                <button key={i} onClick={() => setInput(s)}
                  className="p-3 rounded-xl text-sm text-gray-400 text-right hover:text-white transition glass glass-hover">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <MsgBubble key={msg.id} msg={msg}
              isLast={i === messages.length - 1} streaming={streaming}/>
          ))}
        </AnimatePresence>
        <div ref={bottom}/>
      </div>

      {/* Input */}
      <div className="px-6 py-4 flex-shrink-0" style={{ borderTop:'1px solid rgba(255,255,255,.06)' }}>
        <div className="flex items-end gap-2 rounded-2xl p-2"
          style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)' }}>

          {/* Mic button */}
          <button onClick={toggleMic}
            className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${listening ? 'mic-active' : 'hover:bg-white/10'}`}
            style={{ background: listening ? 'rgba(0,255,135,.2)' : 'transparent', border: listening ? '1px solid rgba(0,255,135,.5)' : '1px solid transparent' }}
            title={listening ? 'إيقاف الميكروفون' : 'تشغيل الميكروفون'}>
            {listening
              ? <Mic size={18} style={{ color:'#00ff87' }}/>
              : <MicOff size={18} className="text-gray-500"/>
            }
          </button>

          {/* Textarea */}
          <textarea ref={textareaRef} value={input}
            onChange={e => { setInput(e.target.value); e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,160)+'px' }}
            onKeyDown={handleKey}
            placeholder={listening ? '🎤 جاري الاستماع…' : 'اكتب رسالتك… (Enter للإرسال، Shift+Enter لسطر جديد)'}
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-200 resize-none outline-none placeholder-gray-600 py-2 leading-relaxed"
            style={{ maxHeight:160 }}
          />

          {/* Send */}
          <button onClick={send} disabled={!input.trim() || streaming}
            className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
            style={{ background: input.trim() && !streaming ? 'linear-gradient(135deg,#00ff87,#00c6ff)' : 'rgba(255,255,255,.1)' }}>
            {streaming
              ? <Loader2 size={18} className="text-gray-400 animate-spin"/>
              : <Send size={16} style={{ color: input.trim() ? '#080c14' : '#6b7280' }}/>
            }
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <div className="text-[11px] text-gray-700">
            {listening && <span style={{ color:'#00ff87' }}>● جاري الاستماع…</span>}
          </div>
          <div className="text-[11px] text-gray-700">NVIDIA NIM · End-to-end streaming</div>
        </div>
      </div>
    </div>
  )
}
