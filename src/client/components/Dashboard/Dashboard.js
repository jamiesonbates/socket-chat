import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import './Dashboard.css';
import './shared.scss';
import SidePanel from './SidePanel/SidePanel';
import SingleChat from './SingleChat/SingleChat';
import Bookmarks from './Bookmarks/Bookmarks';
import DefaultMain from './DefaultMain/DefaultMain';
import {
  fetchChats,
  setChat
} from '../../state/actions/chatActions';
import {
  connectSocket,
  disconnectSocket,
  notifyCommonUsers,
  manageRoom
} from '../../state/actions/socketActions';
import {
  updateMain,
  updateSide
} from '../../state/actions/dashControlActions';
import {
  getContacts
} from '../../state/actions/contactsActions';
import { getCommonUsers } from '../../state/actions/onlineActions';

class Dashboard extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this.props.dispatch(connectSocket());
    this.props.dispatch(getCommonUsers());
    this.props.dispatch(getContacts());
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
    if (!chats) {
      return;
    }

    for (const chat of chats) {
      this.props.dispatch(manageRoom(chat.id, event));
    }
  }

  findUserName(chat) {
    if (!chat.messages || !chat.messages.length) {
      return '';
    }

    const userId = chat.messages[chat.messages.length - 1].userId;
    let foundUser;

    for (const user of chat.users) {
      if (user.id === userId) {
        foundUser = user;
      }
    }

    return foundUser;
  }

  determineChatHeader(chat) {
    if (chat.name) {
      return chat.name;
    }

    const title = chat.users.reduce((acc, user, i, arr) => {
      if (user.id === this.props.userInfo.id) {
        return acc;
      }

      if (arr.length - 1 === i || arr.length < 3) {
        acc += `${user.firstName} ${user.lastName}`;

        return acc;
      }

      acc += `${user.firstName} ${user.lastName}, `;

      return acc;
    }, '');

    return title;
  }

  render() {
    return (
      <div className="Dashboard-container">
        <div className="Dashboard-sections-container">
          <SidePanel
            determineChatHeader={this.determineChatHeader}
            findUserName={this.findUserName}
          />

        {/* Where should methods live and/or when should they be passed */}
          {
            this.props.dashControls.showDefaultMain ?
              <DefaultMain />
            : this.props.dashControls.showChat ?
                <SingleChat
                  determineChatHeader={this.determineChatHeader.bind(this)}
                  findUserName={this.findUserName.bind(this)}
                />
              : <Bookmarks />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    allChats: state.chats.allChats,
    userInfo: state.userInfo,
    dashControls: state.dashControls
  }
}

export default connect(mapStateToProps)(Dashboard);
