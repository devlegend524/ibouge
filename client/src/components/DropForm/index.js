import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';

import './styles.scss';

const DropForm = ({ name, cName }) => {

  return (
    <div className={`dropdown-menu ${cName}`}>
      <div className="up-arrow dropdown-arrow"></div>
      <div className="dropdown-header">
        <span className="dropdown-header-title">{name}{name === 'Inbox'? "()": ''}</span>
        {name === 'Inbox' && <span className="dropdown-header-all">All</span>}
        {name === 'Inbox' && <span className="dropdown-header-unread">Unread</span>}
        {name === 'Inbox' && <span className="dropdown-header-number"></span>}
      </div>
      <div style={{ display: 'flex' }}>
        <div className="dropdown-empty">Empty</div>
      </div>
      {/* <div className="dropdown-unread-list">
        <div className="mail-unread inbox-item-wpr">
        </div>
      </div> */}
    </div>
                    //   <div className="dropdown-menu" aria-labelledby="dropdownMenu1"
                    //   style="width: 400px; border-radius: 8px; margin-top: 25px; right: -30px; padding: 0;">
                    //   <div className="up-arrow" style="right: 25px; top: -10px;"></div>
                    //   <div
                    //     style="background: #6148a1; padding: 20px; border-top-right-radius: 7px; border-top-left-radius: 7px;">
                    //     <div>
                    //       <span style="font-size: 20px;">Notifications</span>
                    //     </div>
                    //   </div>
                    //   <div ng-if="notifications.data.length == 0" style="display: flex">
                    //     <div style="margin: auto; font-size: 20px; padding: 20px; color: #b5b5b5;">Empty</div>
                    //   </div>
                    //   <div style="max-height: 400px; overflow: auto;">
                    //     <div ng-repeat="notification in notifications.data"
                    //       ng-if="notification.type != 'create-group-chat'" ng-click="openNotification(notification)"
                    //       className="notification-item-wpr">
                    //       <img style="min-width: 45px; width: 45px; height: 45px; margin:0 10px; border-radius: 50%;"
                    //         alt="Image" ng-src="{{notification.image ? notification.image : 'img/upload-photo.png'}}" />
                    //       <div style="width: calc(100% - 70px);">
                    //         <div style="font-size: 14px; display: flex;">
                    //           <span className="no-overflow" style="margin-right: 10px;">{{notification.text}}</span>
                    //         </div>
                    //         <div style="color: #777; margin-top: 5px; display: flex; font-size: 12px;">
                    //           {{notification.date | date: 'MMM dd, yyyy - h:m:s'}}
                    //           <span style="font-size: 5px; margin: auto 5px auto 10px;">
                    //             <i className="fa fa-circle" aria-hidden="true"></i>
                    //           </span>
                    //           {{item | ReadUnreadFilter}}
                    //         </div>
                    //       </div>
                    //     </div>
                    //   </div>
                    // </div>
  );
};

export default DropForm;
