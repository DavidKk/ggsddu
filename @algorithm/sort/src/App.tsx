import React from 'react'
import Visualizer from './Visualizer'
import * as Algorithms from './algorithm'

// const numbers = [12,11,10,9,8,7]
const numbers = new Array(15).fill(1).map(() => Math.floor(Math.random() * 100))
const App: React.FC = () => {
  return (
    <>
      <Visualizer algorithm={Algorithms.bubble} numbers={numbers} />
      <Visualizer algorithm={Algorithms.selection} numbers={numbers} />
      <Visualizer algorithm={Algorithms.insertion} numbers={numbers} />
    </>
  )
}

export default App
