import {createBrowserRouter } from 'react-router-dom'
import Home from './Home'
import GameSetup from './GameSetup'
import Experiement from './Experiement'
import Layout from './Layout'

const router = createBrowserRouter([
  {
    path : "/",
    element : <Layout/>,
    children : [
      {
        path : "/",
        element : <Home/>
      },
      {
        path : "/game",
        element : <GameSetup/>
      },
      {
        path : "/experiment",
        element : <Experiement/>
      }
    ]
  },
])

export default router