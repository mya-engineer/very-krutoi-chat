import { useReducer, useEffect } from 'react'
import { SocketContext } from './SocketContext'
import { SocketReducer } from './SocketReducer'
import { io } from 'socket.io-client'

export const SocketState = ({ children }) => {
  const [state, dispatch] = useReducer(SocketReducer, {
    loading: false,
    socket: undefined,
    chat: [],
    user: undefined,
    users: [],
  })

  useEffect(() => {
    dispatch({ type: 'SHOW_LOADER' })
    const clientSocket = io(
      process.env.REACT_APP_DOMAIN
        ? process.env.REACT_APP_DOMAIN
        : '192.168.0.181:8888'
    )

    clientSocket.on('message', obj => {
      dispatch({ type: 'ADD_MESSAGE', payload: { ...obj } })
    })

    clientSocket.on('connect', () =>
      dispatch({ type: 'CONNECT_SOCKET', payload: { socket: clientSocket } })
    )
    clientSocket.on('users:list', users =>
      dispatch({ type: 'SET_USERS', payload: { users } })
    )

    clientSocket.on('connect_error', () => dispatch({ type: 'SHOW_LOADER' }))

    return () => {
      clientSocket.disconnect()
    }
  }, [])

  const sendMessage = (type, msg) => {
    state.socket.emit(type, { message: msg, user: state.user })
  }

  return (
    <SocketContext.Provider value={{ state, sendMessage, dispatch }}>
      {children}
    </SocketContext.Provider>
  )
}
