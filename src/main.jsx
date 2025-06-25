import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Hero from './Hero'
import SocialLinks3D from './SocialLinks3D'
import TimeStone from './TimeStone'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Hero />
    <SocialLinks3D />
    <TimeStone />
  </StrictMode>,
)
