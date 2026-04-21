import React from 'react'
import styles from './TimerPanel.module.css'

function fmt(s) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
}

function fmtTotal(s) {
  if (s < 60) return s + 's'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function TimerPanel({
  seconds, running, onBreak, sessions, totalSecs,
  statusMsg, progress, toggle, reset, startBreak, lifetimeStats,
}) {
  return (
    <div className={styles.panel}>
      {onBreak && (
        <div className={styles.breakBar}>
          ☕ Break time — {fmt(seconds)} remaining
        </div>
      )}

      <div className={styles.progressBg}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div className={styles.timerRow}>
        <div>
          <div className={styles.timerDisplay}>{onBreak ? '🎮' : '📖'} {fmt(seconds)}</div>
          <div className={styles.timerSub}>{statusMsg}</div>
        </div>
        <div className={styles.btnGroup}>
          <button
            className={`${styles.btn} ${styles.primary} ${running ? styles.active : ''}`}
            onClick={toggle}
          >
            {running ? 'Pause' : 'Start'}
          </button>
          <button className={styles.btn} onClick={reset}>Reset</button>
          <button className={styles.btn} onClick={startBreak} > {onBreak ? 'End break' : 'Break'}
</button>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{lifetimeStats?.sessions ?? sessions}</div>
          <div className={styles.statLbl}>sessions</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{fmtTotal((lifetimeStats?.totalSecs ?? 0) + totalSecs)}</div>
          <div className={styles.statLbl}>studied</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{lifetimeStats?.streak ?? 0}</div>
          <div className={styles.statLbl}>day streak</div>
        </div>
      </div>
    </div>
  )
}
