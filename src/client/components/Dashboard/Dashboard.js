import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import './Dashboard.css';
import Nav from '../Nav/Nav';
import ChatsList from './ChatsList/ChatsList';
import SingleChat from './SingleChat/SingleChat';
import {
  fetchChats,
  setChat,
  sendMessage
} from '../../state/actions/chatActions';
import {
  connectSocket,
  disconnectSocket,
  startedTyping,
  stoppedTyping,
  notifyCommonUsers,
  manageRoom
} from '../../state/actions/socketActions';

class Dashboard extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this.props.dispatch(connectSocket());
  }

  componentDidMount() {
    if (this.props.allChats === null) {
      this.props.dispatch(fetchChats());
    }
    else {
      this.handleRooms(this.props.allChats, 'join room');
    }

    this.props.dispatch(notifyCommonUsers());
  }

  componentWillReceiveProps(nextProps) {
    this.handleRooms(nextProps.allChats, 'join room');
  }

  componentWillUnmount() {
    this.handleRooms(this.props.allChats, 'leave room');
  }

  handleRooms(chats, event) {
    for (const chat of chats) {
      this.props.dispatch(manageRoom(chat.id, event));
    }
  }

  render() {
    return (
      <div className="Dashboard-container">
        <Nav />
        <div className="Dashboard-main-container">
          <ChatsList
            allChats={this.props.allChats}
            fetchChats={fetchChats}
            setChat={setChat}
          />

          {/* Where should methods live and/or when should they be passed */}
          <SingleChat
            allChats={this.props.allChats}
            singleChat={this.props.singleChat}
            sendMessage={sendMessage}
            userId={this.props.userInfo.id}
            startedTyping={startedTyping}
            stoppedTyping={stoppedTyping}
            chatsWithTyping={this.props.chatsWithTyping}
            usersOnline={this.props.usersOnline}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    allChats: state.chats.allChats,
    singleChat: state.chats.singleChat,
    userInfo: state.userInfo,
    chatsWithTyping: state.chats.chatsWithTyping,
    usersOnline: state.chats.usersOnline
  }
}

export default connect(mapStateToProps)(Dashboard);
