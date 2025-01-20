import {createBrowserRouter } from 'react-router-dom'
import Home from './Home'
import GameSetup from './GameSetup'
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
        path : "/game/:roomid",
        element : <GameSetup/>
      },
    ]
  },
])

export default router