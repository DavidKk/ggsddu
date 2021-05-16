import React from 'react'
import Document from './components/Document'
import Visualizer from './components/Visualizer'
import * as Algorithms from './algorithm'

// const numbers = [2,1]
// const numbers = [12,11,10,9,8,7,6,5,4,3,2,1]
const numbers = new Array(15).fill(1).map(() => Math.floor(Math.random() * 40))
const App: React.FC = () => {
  return (
    <>
      <Document view={<Visualizer name="Bubble Sort" algorithm={Algorithms.bubble} numbers={numbers} />} source={Algorithms.bubbleCode} />
      <Document view={<Visualizer name="Selection Sort" algorithm={Algorithms.selection} numbers={numbers} />} source={Algorithms.selectionCode} />
      <Document view={<Visualizer name="Insertion Sort" algorithm={Algorithms.insertion} numbers={numbers} />} source={Algorithms.insertionCode} />
      <Document view={<Visualizer name="Shell Sort" algorithm={Algorithms.shell} numbers={numbers} />} source={Algorithms.shellCode} />
    </>
  )
}

export default App
