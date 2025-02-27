import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
   <div className="max-h-[99.9vh] overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-purple-50
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-purple-300
  dark:[&::-webkit-scrollbar-track]:bg-purple-50
  dark:[&::-webkit-scrollbar-thumb]:bg-purple-200 ">
  <App />
</div>

    </BrowserRouter>
  ,
)
