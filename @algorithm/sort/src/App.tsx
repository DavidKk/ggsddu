import React from 'react'
import Visualizer from './Visualizer'
import * as Algorithms from './algorithm'

const numbers = new Array(Math.floor(Math.random() * 30)).fill(1).map(() => Math.floor(Math.random() * 1000))
const App: React.FC = () => {
  return <Visualizer algorithm={Algorithms.bubble} numbers={numbers} />
}

export default App
