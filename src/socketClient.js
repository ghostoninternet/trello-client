import { io } from 'socket.io-client'
import { API_ROOT } from '~/utils/constants.js'
export const socketIoInstance = io(API_ROOT)