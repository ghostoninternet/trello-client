import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards'
import { selectCurrentUser } from '~/redux/user/userSlice'

// Specify which route need user to be logined to be able to use
// Using <Outlet /> for displaying child route
// Ref: https://www.robinwieruch.de/react-router-private-routes/
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to={'/login'} replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

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
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Board List */}
        <Route path='/boards' element={<Boards />} />
        {/* Board Detail */}
        <Route path='/boards/:boardId' element={<Board />} />

        {/* User Settings */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>
      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      {/* Verify account */}
      <Route path='/account/verification' element={<AccountVerification />} />
      {/* 404 Not Found Page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
