import React, { useState } from 'react'
import styles from './AvatarEditor.module.css'

const EMOJIS = ['🧑','👩','🧑‍💻','👨‍🎓','👩‍🎓','🧙','🦊','🐱','🐼','🦁','🐸','🤖']
const COLORS = [
  '#4a2e8a','#8a3a20','#1a5a3a','#1a3a6a',
  '#6a1a4a','#4a4a1a','#1a4a4a','#6a2a2a',
]

export default function AvatarEditor({ currentAvatar, onSave }) {
  const [name,  setName]  = useState(currentAvatar.name)
  const [emoji, setEmoji] = useState(currentAvatar.emoji)
  const [color, setColor] = useState(currentAvatar.color)

  function handleSave() {
    if (name.trim()) onSave({ name: name.trim(), emoji, color })
  }

  return (
    <div className={styles.view}>
      <div className={styles.previewRow}>
        <div className={styles.previewCircle} style={{ background: color }}>
          <span className={styles.previewEmoji}>{emoji}</span>
        </div>
        <div>
          <div className={styles.previewName}>{name || 'Your name'}</div>
          <div className={styles.previewSub}>your seat at the table</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Display name</div>
        <input
          className={styles.nameInput}
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={16}
          placeholder="Enter your name…"
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Choose emoji</div>
        <div className={styles.emojiGrid}>
          {EMOJIS.map(e => (
            <button
              key={e}
              className={`${styles.emojiOpt} ${e === emoji ? styles.selected : ''}`}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Avatar color</div>
        <div className={styles.colorGrid}>
          {COLORS.map(c => (
            <button
              key={c}
              className={`${styles.colorOpt} ${c === color ? styles.selected : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>

      <button className={styles.saveBtn} onClick={handleSave}>
        Save avatar
      </button>
    </div>
  )
}