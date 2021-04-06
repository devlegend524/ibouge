import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../Message';
import Loader from '../Loader';

import { getMessages } from '../../actions/messageActions';
import './styles.scss';

const MessageList = () => {
  const dispatch = useDispatch();
  const { messages, isLoading, error } = useSelector(state => state.message);

  useEffect(() => {
    dispatch(getMessages());
  }, []);

  return (
    <div className="message-list">
      <h2>Messages:</h2>
      {error && <div className="error-center">{error}</div>}
      <div className="list">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {messages.map((message, index) => {
              return <Message key={index} message={message} />;
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageList;
