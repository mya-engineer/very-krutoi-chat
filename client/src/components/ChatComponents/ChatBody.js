import { Panel } from 'rsuite'
import { useEffect } from 'react'
import Message from '../Message'

const ChatBody = ({ state }) => {
  useEffect(() => {
    const chatWindow = document.getElementById('chat-window')

    if (chatWindow.scrollHeight > chatWindow.clientHeight) {
      chatWindow.scrollTo({
        top: document.getElementById('chat-window').scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [state.chat])

  return (
    <Panel
      style={{
        paddingLeft: '10px', // could be dynamic offsetWidth - clientWidth
        overflow: 'auto',
        height: '90%',
      }}
      id='chat-window'>
      {state.chat.map(message => (
        <Message key={message.id} user={message.user} msg={message.message} />
      ))}
    </Panel>
  )
}

export default ChatBody
