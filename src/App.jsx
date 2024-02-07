import { useState, useEffect, useRef } from 'react'
import beepSound from './assets/beep-20.mp3'
import './App.css'

function App() {
  const [breakTime, setBreakTime] = useState(5)
  const [session, setSession] = useState(25)
  const [timeLeft, setTimeLeft] = useState(1500000);
  const [isRunning, setIsRunning] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [sessionOrBreak, setSessionOrBreak] = useState("Session");
  let intervalRef = useRef(null);
  let beepRef = useRef(null);


  function handleReset() {
    beepRef.current = document.getElementById("beep");

    setIsRunning(false);
    setBreakTime(5);
    setSession(25);
    setTimeLeft(1500000);
    setButtonClicked(false);
    setTimerLabel("Session");
    setSessionOrBreak("Session");
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  }

  function handleSessionDecrement() {
    setSession(s => s >= 2 ? s - 1 : 1);
  }

  function handleSessionIncrement() {
    setSession(s => s + 1)
  }

  function handleBreakDecrement() {
    setBreakTime(b => b >= 2 ? b - 1 : 1);
  }

  function handleBreakIncrement() {
    setBreakTime(b => b <= 59 ? b + 1 : 60);
  }

  function handleStartStop() {
    if(!buttonClicked){
      setTimeLeft(session * 60 * 1000);
    }
    setButtonClicked(true);
    setIsRunning(prevIS => !prevIS);
  }

  useEffect(() => {
    beepRef.current = document.getElementById("beep");

    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevT => prevT - 1000);
      }, 1000);
    }

    if (timeLeft === 0 && sessionOrBreak === "Session") {
      setTimerLabel("A break has begun");
      setTimeLeft(breakTime * 60 * 1000);
      setSessionOrBreak("Break");
      beepRef.current.play();
    }

    if (timeLeft === 0 && sessionOrBreak === "Break") {
      setTimerLabel("A session has begun");
      setTimeLeft(session * 60 * 1000);
      setSessionOrBreak("Session");
      beepRef.current.play();
    }

    return () => {
      clearInterval(intervalRef.current);
    }
  }, [isRunning, timeLeft, session, breakTime, sessionOrBreak]);

  function formatTime() {
    let minutes = Math.floor(timeLeft / (60 * 1000) % 60);
    let seconds = Math.floor(timeLeft / 1000 % 60);

    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    return (`${minutes}:${seconds}`);
  }


  return (
    <div id='container'>
      <div id='main-title'>25 + 5 Clock</div>
      <div id='controls'>
        <div id='break-control'>
          <div id='break-label'>Break Length</div>
          <div className='controllers'>
            <button onClick={handleBreakDecrement} id='break-decrement'>-</button>
            <div id='break-length'>{breakTime}</div>
            <button onClick={handleBreakIncrement} id='break-increment'>+</button>
          </div>
        </div>
        <div id='session-control'>
          <div id='session-label'>Session Length</div>
          <div className='controllers'>
            <button onClick={handleSessionDecrement} id='session-decrement'>-</button>
            <div id='session-length'>{session}</div>
            <button onClick={handleSessionIncrement} id='session-increment'>+</button>
          </div>
        </div>

      </div>
      <div id='session'>
        <div id='time'>
          <div id='timer-label'>{timerLabel}</div>
          <div id='time-left'>{formatTime()}</div>
        </div>
        <button onClick={handleStartStop} id='start_stop'>{isRunning === false ? 'Start' : 'Stop'}</button>
        <audio src={beepSound} id='beep'></audio>
        <button onClick={handleReset} id='reset'>Reset</button>
      </div>
    </div>
  )
}

export default App
