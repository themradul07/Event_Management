import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './context/QueryProvider'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <div className=" overflow-y-auto
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-purple-50
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-purple-300
      dark:[&::-webkit-scrollbar-track]:bg-purple-50
      dark:[&::-webkit-scrollbar-thumb]:bg-purple-200 ">
          <App />
        </div>
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>,
)
