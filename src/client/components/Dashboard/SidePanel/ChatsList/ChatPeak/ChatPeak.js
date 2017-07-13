import React from 'react';
import FaUser from 'react-icons/lib/fa/user';
import moment from 'moment';

import LastMessage from './LastMessage';
import './ChatPeak.scss';

const ChatPeak = ({
  chat,
  time,
  userId,
  determineChatHeader,
  determineLastMessage
}) => (
  <div className="ChatPeak-container">
    <div className="ChatPeak-icon-container">
      <div className="ChatPeak-icon-circle">
        <FaUser className="ChatPeak-icon" />
      </div>
    </div>
    <div className="ChatPeak-info-container">
      <div className="ChatPeak-info">
        <div className="ChatPeak-header-container">
          <p className="ChatPeak-header">{determineChatHeader(chat)}</p>
        </div>

        <div className="ChatPeak-time-container">
          <p className="ChatPeak-time">{time}</p>
        </div>
      </div>

      <LastMessage
        highlight={chat.count > 0}
        lastMessage={determineLastMessage(chat)}
      />
    </div>
  </div>
)

export default ChatPeak;
