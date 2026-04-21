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
  const [mood, setMood] = useState(currentAvatar.mood ?? 'Locking in!')

  // add this section before the save button:

  

  

  function handleSave() {
    if (name.trim()) onSave({ name: name.trim(), emoji, color, mood: mood.trim() || 'Locking in!'})
  }

  return (
    <div className={styles.view}>
      {/* Preview */}
      <div className={styles.previewRow}>
        <div className={styles.previewCircle} style={{ background: color }}>
          <span className={styles.previewEmoji}>{emoji}</span>
        </div>
        <div>
          <div className={styles.previewName}>{name || 'Your name'}</div>
          <div className={styles.previewSub}>your seat at the table</div>
        </div>
      </div>

      {/* Name */}
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

      {/* Emoji */}
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

      {/* Color */}
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

      {/* Mood */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Speech bubble</div>
        <input
          className={styles.nameInput}
          value={mood}
          onChange={e => setMood(e.target.value)}
          maxLength={24}
          placeholder="Locking in!"
        />
      </div>

      <button className={styles.saveBtn} onClick={handleSave}>
        Save avatar
      </button>
    </div>
  )
}
