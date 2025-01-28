/* eslint-disable no-unused-vars */
import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatter'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Can't import { store } from '~/redux/store' like normal
 * Solution: Inject store - A technique that we will use when we need to use redux store outside of React component
 * Simply put, when the application start running, main.jsx will run first, from that file, we call injectStore function
 * to inject mainStore into axiosReduxStore in this file
 * Ref: https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */

let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

const authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000

authorizedAxiosInstance.defaults.withCredentials = true

// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Prevent spam click technique
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Initial a Promise for calling refreshTokenAPI
// The purpose of this Promise is for when finish calling refreshTokenAPI then we will retry
// many previous error APIs
let refreshTokenPromise = null
// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // Prevent spam click technique
  interceptorLoadingElements(false)
  return response
}, (error) => {
  console.log('🚀 ~ authorizedAxiosInstance.interceptors.response.use ~ error:', error)
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  // Prevent spam technique
  interceptorLoadingElements(false)

  // Handle refresh token
  // Case 1: If BE return 401 status code, call logout API
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // Case 2: If BE return 410 status code, call refreshTokenAPI to get new access token
  const originalRequests = error.config
  console.log('🚀 ~ authorizedAxiosInstance.interceptors.response.use ~ originalRequests:', originalRequests)
  if (error.response?.status === 410 && !originalRequests._retry) {
    // Assign originalRequests._retry always = true in pending time, to make sure this refreshTokenAPI
    // always call one at a time
    originalRequests._retry = true

    // Check if refreshTokenPromise = null then we will call refreshTokenAPI
    // and assign this Promise to refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          return data?.accessToken
        })
        .catch((_error) => {
          // Logout if error
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          // Assign refreshTokenPromise = null whether refreshTokenAPI success or fail
          refreshTokenPromise = null
        })
    }

    // Need to return when refreshTokenPromise success for furthur processing
    return refreshTokenPromise.then(accessToken => {
      /**
       * Step 1: For case where token is saved in localStorage or other place then we will process here
       */

      // Step 2: Return axios instance combine with originalRequests to retry error request
      return authorizedAxiosInstance(originalRequests)
    })
  }

  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance
