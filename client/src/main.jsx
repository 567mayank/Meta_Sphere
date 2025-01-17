import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GameSetup from './GameSetup.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './Routes.jsx'

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}>
    </RouterProvider>
)
