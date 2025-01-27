import { useState, useEffect } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  // Take email and token from query params
  let [searchParams] = useSearchParams()
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])

  // Create a state to know whether user has success verify account or not
  const [verified, setVerified] = useState(false)

  // Call API for verify account
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => { setVerified(true) })
    }
  }, [email, token])

  // If the URL has problems: no email or no token --> Send user to 404 page
  if (!email || !token) {
    return <Navigate to={'/404'} />
  }
  // If verify is not finish --> Display loading
  if (!verified) {
    return <PageLoadingSpinner caption={'Verifying your account...'} />
  }

  // If no problems encountered and verified successful --> Send user to login with verifiedEmail value
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification