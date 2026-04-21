// src/hooks/useUserStats.js
import { useState, useEffect } from 'react'
import { loadStats, saveStats } from '../firebase'

export function useUserStats(name) {
  const [stats, setStats] = useState({ totalSecs: 0, sessions: 0, streak: 0, lastDate: null })
  const [loaded, setLoaded] = useState(false)

  // Load from Firebase whenever name changes
  useEffect(() => {
    if (!name || name === 'You') return
    setLoaded(false)
    loadStats(name).then(s => {
      setStats(s)
      setLoaded(true)
    })
  }, [name])

  async function addSession(secsStudied) {
    if (!name || name === 'You') return
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    const updated = {
      totalSecs: stats.totalSecs + secsStudied,
      sessions:  stats.sessions + 1,
      streak:    stats.lastDate === yesterday
                   ? stats.streak + 1
                   : stats.lastDate === today
                     ? stats.streak
                     : 1,
      lastDate:  today,
    }

    setStats(updated)           // update UI instantly
    await saveStats(name, updated)  // then sync to Firebase
  }

  return { stats, loaded, addSession }
}