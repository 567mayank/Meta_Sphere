import {createBrowserRouter } from 'react-router-dom'
import Home from './Home'
import GameSetup from './GameSetup'
import Experiement from './Experiement'

const router = createBrowserRouter([
  {
    path : "/",
    element : <Home/>,
  },
  {
    path : "/game",
    element : <GameSetup/>
  },
  {
    path : "/experiment",
    element : <Experiement/>
  }
])

export default router