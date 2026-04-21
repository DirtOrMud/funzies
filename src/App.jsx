import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(focusMin = 25, breakMin = 5, sessionsBeforeLong = 4) {
  const [focusSecs, setFocusSecs]     = useState(focusMin * 60)
  const [breakSecs, setBreakSecs]     = useState(breakMin * 60)
  const [running, setRunning]         = useState(false)
  const [onBreak, setOnBreak]         = useState(false)
  const [isLongBreak, setIsLongBreak] = useState(false)
  const [sessions, setSessions]       = useState(0)
  const [totalSecs, setTotalSecs]     = useState(0)
  const [statusMsg, setStatusMsg]     = useState('focus session')

  const intervalRef       = useRef(null)
  const totalFocus        = useRef(focusMin * 60)
  const totalBreak        = useRef(breakMin * 60)
  const savedFocusSecs    = useRef(focusMin * 60)  // preserves progress across breaks
  const sessionsRef       = useRef(0)
  const sessionsBeforeRef = useRef(sessionsBeforeLong)
  const timer = useTimer(focusMin, breakMin, sessions)

  useEffect(() => {
    totalFocus.current        = focusMin * 60
    totalBreak.current        = breakMin * 60
    sessionsBeforeRef.current = sessionsBeforeLong
  }, [focusMin, breakMin, sessionsBeforeLong])

  const clear = () => clearInterval(intervalRef.current)

  function completeSession() {
    clear()
    setRunning(false)
    const newCount = sessionsRef.current + 1
    sessionsRef.current = newCount
    setSessions(newCount)
    savedFocusSecs.current = totalFocus.current

    const isLong = newCount % sessionsBeforeRef.current === 0
    const longBreakSecs = totalBreak.current * 3
    setIsLongBreak(isLong)
    setOnBreak(true)
    setFocusSecs(totalFocus.current)
    setBreakSecs(isLong ? longBreakSecs : totalBreak.current)
    setStatusMsg(isLong ? `long break — ${newCount} sessions done!` : 'session complete!')
    setRunning(true)  // auto-start the break countdown
  }

  function completeBreak() {
    clear()
    setRunning(false)
    setOnBreak(false)
    setIsLongBreak(false)
    setBreakSecs(totalBreak.current)
    setFocusSecs(totalFocus.current)
    savedFocusSecs.current = totalFocus.current
    setStatusMsg('break over — start!')
    setTimeout(() => setStatusMsg('focus session'), 3000)
  }

  const tick = useCallback(() => {
    if (onBreak) {
      setBreakSecs(s => {
        if (s <= 1) { completeBreak(); return 0 }
        return s - 1
      })
    } else {
      setFocusSecs(s => {
        savedFocusSecs.current = s - 1  // keep saved progress in sync
        if (s <= 1) { completeSession(); return 0 }
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

  const toggle = () => setRunning(r => !r)

  const reset = () => {
    clear()
    setRunning(false)
    setOnBreak(false)
    setIsLongBreak(false)
    setFocusSecs(totalFocus.current)
    setBreakSecs(totalBreak.current)
    savedFocusSecs.current = totalFocus.current
    setStatusMsg('focus session')
  }

  // Works in both directions:
  // • during focus  → saves remaining time, starts break
  // • during break  → ends break early, restores saved focus time
  const startBreak = () => {
    if (onBreak) {
      clear()
      setRunning(false)
      setOnBreak(false)
      setIsLongBreak(false)
      setBreakSecs(totalBreak.current)
      setFocusSecs(savedFocusSecs.current)  // restore where you left off
      setStatusMsg('break ended — resuming')
      setTimeout(() => setStatusMsg('focus session'), 2500)
    } else {
      savedFocusSecs.current = focusSecs    // snapshot current progress
      clear()
      setRunning(false)
      setOnBreak(true)
      setBreakSecs(totalBreak.current)
      setStatusMsg('on break')
    }
  }

  const applySettings = (newFocus, newBreak) => {
    clear()
    setRunning(false)
    setOnBreak(false)
    setIsLongBreak(false)
    totalFocus.current = newFocus * 60
    totalBreak.current = newBreak * 60
    savedFocusSecs.current = newFocus * 60
    setFocusSecs(newFocus * 60)
    setBreakSecs(newBreak * 60)
    setStatusMsg('focus session')
  }

  const progress = onBreak
    ? (breakSecs / (isLongBreak ? totalBreak.current * 3 : totalBreak.current))
    : (focusSecs / totalFocus.current)

  return {
    seconds: onBreak ? breakSecs : focusSecs,
    running, onBreak, isLongBreak, sessions, totalSecs,
    statusMsg, progress,
    toggle, reset, startBreak, applySettings,
  }
}