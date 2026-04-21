import React, { useState } from 'react'
import styles from './ParticipantsBar.module.css'

export default function ParticipantsBar({ users, roomCode, onInvite }) {
  const [copied, setCopied] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  function copyLink() {
    const url = `${window.location.origin}?room=${roomCode}`
    navigator.clipboard.writeText(url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <div className={styles.chips}>
          {users.map((u, i) => (
            <div key={u.id  || `local-${i}`} className={styles.chip}>
              <div className={styles.dot} />
              {u.name}
            </div>
          ))}
        </div>
        <button className={styles.inviteBtn} onClick={() => setShowInvite(s => !s)}>
          + Invite
        </button>
      </div>

      {showInvite && (
        <div className={styles.inviteRow}>
          <div className={styles.codeBox}>{roomCode}</div>
          <button className={`${styles.inviteBtn} ${styles.primary}`} onClick={copyLink}>
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      )}
    </div>
  )
}
