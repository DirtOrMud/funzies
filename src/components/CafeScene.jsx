import React from 'react'
import styles from './CafeScene.module.css'
import ChatWindow from './ChatWindow'
import { kickUser } from '../firebase'

const SEAT_POSITIONS = [
  { left: 30 },
  { left: 100 },
  { left: 170 },
  { left: 240 },
]

const HOST = 'Dom'

function Avatar({ user, isYou, canKick, roomCode }) {
  const secs = user.timer?.seconds ?? 0
  const mins = Math.floor(secs / 60)
  const s = secs % 60
  const timeStr = `${String(mins).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  const icon = user.timer?.onBreak ? '🎮' : '📖'

  function handleKick(e) {
    e.stopPropagation()
    kickUser(roomCode, user.id)
  }

  return (
    <div className={styles.avatarWrap} title={user.name}>
      {user.timer?.running && (
        <div className={styles.avatarTimer}>{icon} {timeStr}</div>
      )}
      <div className={styles.avatarCircle} style={{ background: user.color }}>
        <span className={styles.avatarEmoji}>{user.emoji}</span>
      </div>
      <div className={styles.avatarLabel}>{isYou ? 'You' : user.name}</div>
      {canKick && !isYou && (
        <button className={styles.kickBtn} onClick={handleKick}>✕</button>
      )}
    </div>
  )
}

function EmptySeat({ onInvite }) {
  return (
    <div className={styles.avatarWrap} onClick={onInvite} title="Invite someone">
      <div className={styles.emptySeat}>
        <span className={styles.plus}>+</span>
      </div>
      <div className={styles.emptyLabel}>invite</div>
    </div>
  )
}

export default function CafeScene({ users, myId, myName, roomCode, onInvite }) {
  const seats = users.slice(0, 4)
  const canKick = myName === HOST

  return (
    <div className={styles.scene}>
      <ChatWindow roomCode={roomCode} myName={myName} />

      <div className={styles.window}>
        <div className={styles.star} style={{ top: 15, left: 20, width: 2, height: 2 }} />
        <div className={styles.star} style={{ top: 30, left: 55, width: 1.5, height: 1.5 }} />
        <div className={styles.star} style={{ top: 10, left: 80, width: 2, height: 2 }} />
        <div className={styles.star} style={{ top: 45, left: 35, width: 1.5, height: 1.5 }} />
      </div>

      <div className={styles.bookshelf}>
        <div className={styles.book} style={{ height: 28, background: '#8b2020' }} />
        <div className={styles.book} style={{ height: 22, background: '#20508b' }} />
        <div className={styles.book} style={{ height: 26, background: '#206b35' }} />
        <div className={styles.book} style={{ height: 20, background: '#7a6014' }} />
      </div>

      <div className={styles.lamp}>
        <div className={styles.lampHead} />
        <div className={styles.lampPost} />
      </div>
      <div className={styles.lampGlow} />
      <div className={styles.mug} />

      <div className={styles.tableSurface}>
        <div className={styles.paper} style={{ top: 10, left: 30, transform: 'rotate(-3deg)' }} />
        <div className={styles.paper} style={{ top: 8,  left: 50, transform: 'rotate(2deg)' }} />
        <div className={styles.paper} style={{ top: 12, right: 40, transform: 'rotate(-1deg)' }} />
        <div className={styles.paper} style={{ top: 9,  right: 60, transform: 'rotate(4deg)' }} />
      </div>

      {Array.from({ length: 4 }).map((_, i) => {
        const user = seats[i]
        return (
          <div key={user?.id ?? `empty-${i}`} className={styles.seatSlot} style={{ left: SEAT_POSITIONS[i].left }}>
            {user
              ? <Avatar user={user} isYou={user.id === myId} canKick={canKick} roomCode={roomCode} />
              : <EmptySeat onInvite={onInvite} />
            }
          </div>
        )
      })}

      <div className={styles.tableLegs}>
        <div className={styles.leg} /><div className={styles.leg} />
        <div className={styles.leg} /><div className={styles.leg} />
      </div>
      <div className={styles.floor}><div className={styles.rug} /></div>
    </div>
  )
}