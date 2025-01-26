import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'

function App() {
  return (
    <Routes>
      {/* Redirect route */}
      <Route path='/' element={
        // Here the replace props is set to true to replace the URL='/'
        // in Browser History Stack with URL='/boards/:boardId'
        // To visual how this work, try to press Go Home button in 404 page
        // and then press Back button of browser to see if the browser will
        // go back to URL='/' or not
        <Navigate to='/boards/6578330f2d63f56c573d88e6' replace={true} />
      } />
      {/* Board Detail */}
      <Route path='/boards/:boardId' element={<Board />} />
      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      {/* 404 Not Found Page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
