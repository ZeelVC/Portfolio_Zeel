import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Hero from './Hero'
import SocialLinks3D from './SocialLinks3D'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Hero />
    <SocialLinks3D />
  </StrictMode>,
)
