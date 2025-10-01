import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectRealtime = (url: string) => {
  if (!socket) {
    socket = io(url)
  }
  return socket
}

export const disconnectRealtime = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const subscribeEvent = (event: string, callback: (...args: any[]) => void) => {
  if (!socket) return
  socket.on(event, callback)
}

export const unsubscribeEvent = (event: string) => {
  if (!socket) return
  socket.off(event)
}
