import React, { useState } from 'react'
import styles from './TimerSettings.module.css'

const PRESETS = [
  { label: 'Pomodoro', sub: '25/5',  focus: 25, brk: 5,  sessions: 4 },
  { label: 'Deep Work', sub: '50/10', focus: 50, brk: 10, sessions: 2 },
  { label: 'Flow State', sub: '90/20', focus: 90, brk: 20, sessions: 1 },
]

export default function TimerSettings({ focusMin, breakMin, sessionsBeforeLong, onApply }) {
  const [focus,    setFocus]    = useState(focusMin)
  const [brk,      setBrk]      = useState(breakMin)
  const [sessions, setSessions] = useState(sessionsBeforeLong)
  const [preset,   setPreset]   = useState(null)

  function applyPreset(p) {
    setFocus(p.focus); setBrk(p.brk); setSessions(p.sessions); setPreset(p.label)
  }

  function adj(setter, delta, min, max) {
    setter(v => { setPreset(null); return Math.max(min, Math.min(max, v + delta)) })
  }

  return (
    <div className={styles.view}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Quick presets</div>
        <div className={styles.presetRow}>
          {PRESETS.map(p => (
            <button
              key={p.label}
              className={`${styles.presetBtn} ${preset === p.label ? styles.selected : ''}`}
              onClick={() => applyPreset(p)}
            >
              {p.label}<br />
              <span className={styles.presetSub}>{p.sub}</span>
            </button>
          ))}
          <button className={`${styles.presetBtn} ${preset === null ? styles.selected : ''}`}>
            Custom<br />
            <span className={styles.presetSub}>manual</span>
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      {[
        { label: 'Focus duration', val: focus, set: setFocus, step: 5, min: 5, max: 120, unit: 'min' },
        { label: 'Break duration', val: brk,   set: setBrk,  step: 1, min: 1, max: 30,  unit: 'min' },
        { label: 'Sessions before long break', val: sessions, set: setSessions, step: 1, min: 1, max: 8, unit: '' },
      ].map(row => (
        <div key={row.label} className={styles.settingRow}>
          <div className={styles.settingLabel}>{row.label}</div>
          <div className={styles.control}>
            <button className={styles.numBtn} onClick={() => adj(row.set, -row.step, row.min, row.max)}>−</button>
            <div className={styles.numVal}>{row.val}{row.unit}</div>
            <button className={styles.numBtn} onClick={() => adj(row.set, +row.step, row.min, row.max)}>+</button>
          </div>
        </div>
      ))}

      <div className={styles.divider} />

      <button className={styles.applyBtn} onClick={() => onApply(focus, brk, sessions)}>
        Apply settings
      </button>
    </div>
  )
}
