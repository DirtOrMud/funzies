import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(focusMin = 25, breakMin = 5) {
  const [focusSecs, setFocusSecs]     = useState(focusMin * 60)
  const [breakSecs, setBreakSecs]     = useState(breakMin * 60)
  const [running, setRunning]         = useState(false)
  const [onBreak, setOnBreak]         = useState(false)
  const [sessions, setSessions]       = useState(0)
  const [totalSecs, setTotalSecs]     = useState(0)
  const [statusMsg, setStatusMsg]     = useState('focus session')
  const intervalRef = useRef(null)
  const totalFocus  = useRef(focusMin * 60)
  const totalBreak  = useRef(breakMin * 60)

  // Keep totals in sync when settings change
  useEffect(() => {
    totalFocus.current = focusMin * 60
    totalBreak.current = breakMin * 60
  }, [focusMin, breakMin])

  const clear = () => clearInterval(intervalRef.current)

  const tick = useCallback(() => {
    if (onBreak) {
      setBreakSecs(s => {
        if (s <= 1) { endBreakInternal(); return 0 }
        return s - 1
      })
    } else {
      setFocusSecs(s => {
        if (s <= 1) { completeSessionInternal(); return 0 }
        return s - 1
      })
      setTotalSecs(t => t + 1)
    }
  }, [onBreak])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      clear()
    }
    return clear
  }, [running, tick])

  function completeSessionInternal() {
    clear()
    setRunning(false)
    setSessions(s => s + 1)
    setFocusSecs(totalFocus.current)
    setStatusMsg('session complete!')
    setTimeout(() => setStatusMsg('focus session'), 3000)
  }

  function endBreakInternal() {
    clear()
    setRunning(false)
    setOnBreak(false)
    setBreakSecs(totalBreak.current)
    setStatusMsg('break over — start!')
    setTimeout(() => setStatusMsg('focus session'), 3000)
  }

  const toggle = () => setRunning(r => !r)

  const reset = () => {
    clear()
    setRunning(false)
    setOnBreak(false)
    setFocusSecs(totalFocus.current)
    setBreakSecs(totalBreak.current)
    setStatusMsg('focus session')
  }

  const startBreak = () => {
    if (!running) return
    clear()
    setRunning(false)
    setOnBreak(true)
    setBreakSecs(totalBreak.current)
    setStatusMsg('on break')
  }

  const applySettings = (newFocus, newBreak) => {
    clear()
    setRunning(false)
    setOnBreak(false)
    totalFocus.current = newFocus * 60
    totalBreak.current = newBreak * 60
    setFocusSecs(newFocus * 60)
    setBreakSecs(newBreak * 60)
    setStatusMsg('focus session')
  }

  const progress = onBreak
    ? (breakSecs / totalBreak.current)
    : (focusSecs / totalFocus.current)

  return {
    seconds: onBreak ? breakSecs : focusSecs,
    running, onBreak, sessions, totalSecs,
    statusMsg, progress,
    toggle, reset, startBreak, applySettings,
  }
}
