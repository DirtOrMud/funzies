import React, { useState } from 'react'
import { useTimer } from './hooks/useTimer'
import CafeScene from './components/CafeScene'
import TimerPanel from './components/TimerPanel'
import AvatarEditor from './components/AvatarEditor'
import TimerSettings from './components/TimerSettings'
import ParticipantsBar from './components/ParticipantsBar'
import styles from './App.module.css'
import { useRoom } from './hooks/useRoom'

const TABS = ['Study Room', 'My Avatar', 'Timer']

export default function App() {
  const [tab, setTab] = useState(0)
  const [focusMin, setFocusMin] = useState(25)
  const [breakMin, setBreakMin] = useState(5)
  const [sessions, setSessions] = useState(4)
  const [myAvatar, setMyAvatar] = useState({
    id: 'me',
    name: 'You',
    emoji: '🧑',
    color: '#4a2e8a',
  })

  const timer = useTimer(focusMin, breakMin)
  const { users, myId } = useRoom('BREW-42', myAvatar)

  const allUsers = users?.length ? users : [myAvatar]

  function handleApplySettings(f, b, s) {
    setFocusMin(f)
    setBreakMin(b)
    setSessions(s)
    timer.applySettings(f, b)
    setTab(0)
  }

  function handleSaveAvatar(updated) {
    setMyAvatar(av => ({ ...av, ...updated }))
    setTab(0)
  }

  return (
    <div className={styles.app}>
      <div className={styles.titlebar}>
        <div className={styles.titleLeft}>
          <div className={`${styles.dot} ${styles.red}`} />
          <div className={`${styles.dot} ${styles.yellow}`} />
          <div className={`${styles.dot} ${styles.green}`} />
          <span className={styles.appTitle}>StudyNook</span>
        </div>
        <div className={styles.roomCode}>
          room: <span>BREW-42</span>
        </div>
      </div>

      <div className={styles.tabBar}>
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === i ? styles.activeTab : ''}`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <>
          <CafeScene
            users={allUsers}
            myId={myId || 'me'}
            mySeconds={timer.seconds}
            running={timer.running}
            onInvite={() => {}}
          />
          <TimerPanel {...timer} />
          <ParticipantsBar
            users={allUsers}
            roomCode="BREW-42"
          />
        </>
      )}

      {tab === 1 && (
        <AvatarEditor
          currentAvatar={myAvatar}
          onSave={handleSaveAvatar}
        />
      )}

      {tab === 2 && (
        <TimerSettings
          focusMin={focusMin}
          breakMin={breakMin}
          sessionsBeforeLong={sessions}
          onApply={handleApplySettings}
        />
      )}
    </div>
  )
}