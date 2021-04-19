import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {
  openGroupChat,
  openPersonalChat,
  goGoChat,
} from '../../actions/chatAction';
import {setGroupChatModalStatus} from '../../actions/notificationAction';
import * as helper from '../../helpers/utils';

import {getMicroblogForInvitee} from '../../api/microblog';
import default_img from '../../assets/img/upload-photo.png';
import './styles.scss';

const DropForm = ({name, cName, data}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector((state) => state.auth.sess);
  const openNotification = (notification) => {
    switch (notification.type) {
      case 'create-group-chat':
        dispatch(openGroupChat(notification));
        break;
      case 'friend-request':
        history.push(`/profile/${notification.meta[0].value}`);
        break;
      case 'accept-friend-request':
        history.push(`/profile/${notification.meta[0].value}`);
        break;
      case 'like-request':
        history.push('dashboard', {POST_ID: notification.meta[1].value});
        break;
      case 'invite-friend-to-microblog':
        var room = null;
        var creator = notification.meta
          .filter(function (item) {
            return item.key === 'created_by';
          })
          .map(function (item) {
            return item.value;
          });

        if (notification.is_microblog === true) {
          room = notification.room;
        } else {
          room = notification.meta
            .filter(function (item) {
              return item.key === 'room';
            })
            .map(function (item) {
              return item.value;
            });

          room = room && room.length > 0 ? room[0] : null;
        }
        getMicroblogForInvitee(room, creator).then((microblog) => {
          history.push('/');
        });
        break;
      default:
        break;
    }
  };

  const goToChat = (item) => {
    dispatch(openGroupChat(item, auth._id));
  };
  return (
    <div className={`dropdown-menu ${cName}`}>
      <div className="up-arrow dropdown-arrow"></div>
      <div className="dropdown-header">
        <span className="dropdown-header-title">
          {name}
          {name === 'Inbox' ? `(${data.data.length})` : ''}
        </span>
        {name === 'Inbox' && <span className="dropdown-header-all">All</span>}
        {name === 'Inbox' && (
          <span className="dropdown-header-unread">Unread</span>
        )}
        {name === 'Inbox' && (
          <span className="dropdown-header-number">{data.unread}</span>
        )}
      </div>
      {name === 'Inbox' ? (
        <>
          {data.data.length === 0 ? (
            <div style={{display: 'flex'}}>
              <div className="dropdown-empty">Empty</div>
            </div>
          ) : (
            <>
              {data.data &&
                data.data.map((item) => (
                  <div style={{maxHeight: '300px', overflow: 'auto'}}>
                    <div class="inbox-item-wpr" onClick={(e) => goToChat(item)}>
                      helper.getImage(item) + '\
                      <div style={{width: 'calc(100% - 70px)'}}>
                        \
                        <div
                          style={{
                            fontWeight: '500',
                            fontSize: '17px',
                            display: 'flex',
                          }}
                        >
                          \
                          <span
                            class="no-overflow"
                            style={{marginRight: '10px'}}
                          >
                            ' + item.name + "
                          </span>
                          \ " + helper.getOnline(item) + '\
                        </div>
                        \
                        <div
                          style={{
                            color: '#a09bb0',
                            fontSize: '16px',
                            overflowWrap: 'break-word',
                          }}
                        >
                          ' + item.messages[0].from + " : " + (item.messages[0]
                          ? item.messages[0].message : "") + '
                        </div>
                        \
                        <div
                          style={{
                            color: '#a09bb0',
                            marginTp: '10px',
                            display: 'flex',
                            fontSize: '15px',
                          }}
                        >
                          ' + item.messages[0] ? item.messages[0].time : "" + '
                          <span
                            style={{
                              fontSize: '5px',
                              margin: 'auto 5px auto 10px',
                            }}
                          >
                            <i class="fa fa-circle" aria-hidden="true"></i>
                          </span>
                          ' + helper.getReadStatus(item, auth._id) + "
                        </div>
                        \
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </>
      ) : (
        <>
          {data.data.length === 0 ? (
            <div style={{display: 'flex'}}>
              <div className="dropdown-empty">Empty</div>
            </div>
          ) : (
            <div style={{maxHeight: '400px', overflow: 'auto'}}>
              {data.data &&
                data.data.map((notification, index) => (
                  <div
                    onClick={(e) => openNotification(notification)}
                    className="notification-item-wpr"
                    key={index}
                  >
                    <img
                      style={{
                        width: '45px',
                        height: '45px',
                        margin: '0 10px',
                        borderRadius: '50%',
                      }}
                      src={
                        notification.image ? notification.image : default_img
                      }
                      alt="noti_img"
                    />
                    <div style={{width: 'calc(100% - 70px)'}}>
                      <div style={{fontSize: '14px', display: 'flex'}}>
                        <span
                          className="no-overflow"
                          style={{marginRight: '10px'}}
                        >
                          {notification.text}
                        </span>
                      </div>
                      <div
                        style={{
                          color: '#777',
                          marginTop: '5px',
                          display: 'flex',
                          fontSize: '12px',
                        }}
                      >
                        {notification.date}
                        <span
                          style={{
                            fontSize: '5px',
                            margin: 'auto 5px auto 10px',
                          }}
                        >
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DropForm;
