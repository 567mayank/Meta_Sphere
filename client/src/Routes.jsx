import {createBrowserRouter } from 'react-router-dom'
import Home from './Home'
import GameSetup from './GameSetup'

const router = createBrowserRouter([
  {
    path : "/",
    element : <Home/>,
  },
  {
    path : "/game",
    element : <GameSetup/>
  }
])

export default router