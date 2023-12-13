import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from 'material-ui-confirm'
import 'react-toastify/dist/ReactToastify.css'
import theme from './theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CssVarsProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
      allowClose: false,
      dialogProps: { maxWidth: 'md' },
      confirmationButtonProps: { color: 'success', variant: 'outlined' },
      cancellationButtonProps: { color: 'inherit', variant: 'outlined' }
    }}>
      <CssBaseline />
      <App />
      <ToastContainer theme='colored'/>
    </ConfirmProvider>
  </CssVarsProvider>
)
