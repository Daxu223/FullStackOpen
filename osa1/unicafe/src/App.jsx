import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />
      <Statistics statistics={[good, neutral, bad]} />
    </div>
  )
}

const Statistics = ({ statistics }) => {
  const [good, neutral, bad] = statistics // Destructure the array from object to individual variables
  const all = good + neutral + bad
  const positivePercent = good > 0 ? (good / all) * 100 + ' %' : '0 %'
  const average = all > 0 ? (bad * -1 + good) / all : 0

  if (all > 0) {
    return (
      <div>
        <h1>statistics</h1>
        <table>
          <tbody>
            <tr><StatisticsLine text="good" value={good} /></tr>
            <tr><StatisticsLine text="neutral" value={neutral} /></tr>
            <tr><StatisticsLine text="bad" value={bad} /></tr>
            <tr><StatisticsLine text="all" value={all} /></tr>
            <tr><StatisticsLine text="average" value={average} /></tr>
            <tr><StatisticsLine text="positive" value={positivePercent.toString()} /></tr>
          </tbody>
        </table>
      </div>
    )
  } else {
    return (
      <div>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )
  }
}

const StatisticsLine = ({ value, text }) => {
  return (
    <>
      <td>{text}</td>
      <td>{value}</td>
    </>
  )
}

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

export default App
