import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <Outlet />
      <Toaster position="top-center" toastOptions={{ style: { zIndex: 9999 } }} />
    </>
  )
}

export default App
