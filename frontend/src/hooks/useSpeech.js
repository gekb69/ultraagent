import { useState, useRef, useCallback } from 'react'

export function useSpeech(onTranscript) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState(null)
  const recRef = useRef(null)

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setError('Speech recognition not supported in this browser'); return }

    const rec = new SR()
    rec.lang = 'ar-IQ'            // Arabic Iraq — fallback to auto
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.continuous = false

    rec.onstart  = () => { setListening(true); setError(null) }
    rec.onerror  = (e) => { setListening(false); setError(e.error) }
    rec.onend    = () => setListening(false)
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript
      if (text && onTranscript) onTranscript(text)
    }

    recRef.current = rec
    rec.start()
  }, [onTranscript])

  const stop = useCallback(() => {
    recRef.current?.stop()
    setListening(false)
  }, [])

  const toggle = useCallback(() => {
    if (listening) stop(); else start()
  }, [listening, start, stop])

  return { listening, error, toggle, start, stop }
}

// Text-to-speech
export function speak(text, lang = 'ar') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = lang
  utt.rate = 1
  utt.pitch = 1
  window.speechSynthesis.speak(utt)
}
