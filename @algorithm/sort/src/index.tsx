import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles.scss'

function render(): void {
  ReactDOM.render(<App />, document.getElementById('root'))
}

render()

if (module.hot) {
  module.hot.accept('./App', render)
}
