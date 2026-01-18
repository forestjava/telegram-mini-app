// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { QueryClientProvider } from '@tanstack/react-query'
// import { queryClient } from './api/queryClient'
// import { AuthProvider } from './context/AuthContext.tsx'
// import './index.css'
// import App from './App.tsx'

const Test = () => {
  return <div>Test</div>
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <QueryClientProvider client={queryClient}>
  //     <AuthProvider>
  //       <App />
  //     </AuthProvider>
  //   </QueryClientProvider>
  // </StrictMode>,
  <Test />
)
