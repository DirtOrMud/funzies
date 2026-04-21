import React, { useState, useEffect, useRef } from 'react'
import { sendMessage, syncMessages } from '../firebase'
import styles from './ChatWindow.module.css'

export default function ChatWindow({ roomCode, myName }) {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const bottomRef               = useRef(null)

    useEffect(() => {
    const unsub = syncMessages(roomCode, msgs => {
        console.log('messages received:', msgs)  // ← add this
        setMessages(msgs)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    })
    return unsub
    }, [roomCode])

  
  function handleSend() {
    if (!input.trim()) return
    sendMessage(roomCode, myName, input)
    setInput('')
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSend()
  }

  function fmtTime(ts) {
    const d = new Date(ts)
    return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0')
  }

  return (
    <div className={styles.chat}>
      <div className={styles.messages}>
        {messages.length === 0 && (<div className={styles.empty}>no messages yet</div>)}
        {messages.map(m => (
          <div key={m.id} className={`${styles.msg} ${m.name === myName ? styles.mine : ''}`}>
            <span className={styles.msgName}>{m.name}:</span>
            <span className={styles.msgText}>{m.text}</span>
            {/* <span className={styles.msgTime}>{fmtTime(m.sentAt)}</span> // ← optionally show time */}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="say something..."
          maxLength={120}
        />
        <button className={styles.sendBtn} onClick={handleSend}>↑</button>
      </div>
    </div>
  )
}