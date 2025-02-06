import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
// Config MUI confirm dialog
import { ConfirmProvider } from 'material-ui-confirm'
import 'react-toastify/dist/ReactToastify.css'
import theme from './theme.js'
// Config Redux Store
import { store } from '~/redux/store'
import { Provider } from 'react-redux'
// Config React Router Dom with BrowserRouter
import { BrowserRouter } from 'react-router-dom'
// Config Redux Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { injectStore } from './utils/authorizeAxios.js'

let persistor = persistStore(store)

// Inject store technique
injectStore(store)

import { io } from 'socket.io-client'
import { API_ROOT } from '~/utils/constants.js'
export const socketIoInstance = io(API_ROOT)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: 'md' },
            confirmationButtonProps: { color: 'success', variant: 'outlined' },
            cancellationButtonProps: { color: 'inherit', variant: 'outlined' },
            buttonOrder: ['confirm', 'cancel']
          }}>
            <GlobalStyles styles={{
              a: {
                color: 'inherit',
                textDecoration: 'none'
              }
            }} />
            <CssBaseline />
            <App />
            <ToastContainer theme='colored' />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
