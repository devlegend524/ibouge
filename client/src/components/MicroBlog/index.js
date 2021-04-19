// import React from 'react',
// import default_img from '../../assets/img/noImageAvailable.jpg'
// const MicroBlog = (props) => {
//   return (
//     <>
//     <div class="microbloggers" style={{ height: '370px',overflowY: 'auto'}}>
//       {microblogUsers.map(user => (
//       <div style={{ paddingTop: '10px', width:'50px', height: '60px'}}>
//           <img src={user.profile_pic? user.profile_pic: default_img}
//           style={{width: '45px',  height: '45px', borderRadius: '50%'}} alt="profilePic" />
//       </div>
//       ))}
// </div>
// {microblogUsers.length > 6 && (
// <div class="microbloggers"
//     style={{ top: '370px', paddingTop: '10px', width:'50px', height: '60px'}}>
//     <button class="invite-button-orange">{moreUsers}+</button>
// </div>
// )}
// <div>
//     <span us-spinner spinner-key="spinner-2"></span>
//     {microblogs && microblogs.map(microblog => (
//     <div style="height: 660px">
//         <div class="popover-topnav-head">
//             <div class="pop-purple-head">
//                 <span style={{ textAlign: 'left'}}>
//                     {microblog.name}
//                 </span>
//                 <div class="dropdown float-pop-morebtn" style={{ textAlign: 'right'}}>
//                     <button class="btnd" style={{ padding: '0', border: 'none' }} ng-click="bookmarkToggle(microblog);"><i
//                             class="fa fa-bookmark"
//                             ng-class="bookmarkClicked ? 'chat-bookmark-fill' :'chat-bookmark-no-fill'" /></button>
//                     <button style={{ padding: '0', border: 'none' }} class="btnd" ng-click="showMyFriends();"><img
//                             src="/img/icons8-Add%20User%20Male-48%20(1).png" class="add-user-to-chat"></button>
//                     <button style={{ padding: '0', border: 'none' }} class="btnd" ng-click="closeWindow(microblog);"><i
//                             class=" fa fa-close add-user-to-chat" style={{paddingTop: '5px'}}></i></button>
//                 </div>
//             </div>
//         </div>
//         <div class="popover-topnav-subheading">
//             <div ibg-scroller="{{microblog.room}}" class="chat-wrap-pop"
//                 style={{ float: 'left', overflow: 'auto', height: '550px'}}>
//                 <div ng-repeat="message in microblog.messages">
//                     <div class="dayOfChat" style={{ width: '100%', textAlign: 'center'}}
//                         ng-if="message.isFirstMsg && message.in || message.in && message.isNewDate">
//                         {message.time}
//                     </div>
//                     <div class="chat-bubble-wrap" ng-if="message.in && !message.isImage">
//                         <div style={{ position: 'absolute', left: '0', width: '8%', minHeight: '10%', paddingBottom: '10px' }}>
//                             <img
//                                 ng-src="{{getImageForMicroblog(message.from, microblog)}}"
//                                 style={{width: '40px', height: '40px', float: 'left', borderRadius: '50%', border: '4px solid rgba(97, 72, 161, 0.32)'}} />
//                             <span style={{paddingBottom: '30px'}} class="chat-in-time"
//                                 ng-if="message.in">{message.time}</span>

//                         </div>
//                         <div class="chatBubble">{{message.msg}}</div>
//                     </div>
//                     <div class="dayOfChat" style={{ width: '100%', textAlign: 'center' }}
//                         ng-if="message.isFirstMsg && !message.in || !message.in && message.isNewDate">
//                         {message.time}
//                     </div>
//                     <div class="chat-bubble-wrap" ng-if="!message.in && !message.isImage">
//                         <div style={{ position: 'absolute', right: '0', width: '8%', minHeight: '10%', paddingBottom: '10px' }}>
//                             <img
//                                 ng-src="{{getImageForMicroblog(message.from, microblog)}}"
//                                 style={{width: '40px', height: '40px', float: 'right', borderRadius: '50%', marginTop: '4px', border: '4px solid rgba(97, 72, 161, 0.32)'}} />
//                             <div style="padding-bottom: 30px;" class="chat-sent-time" ng-if="!message.in">
//                                 {message.time}</div>
//                         </div>
//                         <div class="arrow-right-group-chat"></div>
//                         <div class="chat-sent-bubble" style={{maxWidth: '76%'}}>{message.msg}</div>
//                     </div>
//                     <div class="chat-bubble-wrap" ng-if="message.isImage && !message.in">
//                         <div style={{position: 'absolute', right: '0', width: '8%', minHeight: '10%', paddingBottom: '10px' }}>
//                             <img
//                                 ng-src="{{getImageForMicroblog(message.from, microblog)}}"
//                                 style={{ width: '40px', height: '40px', float: 'right', borderRadius: '50%', marginTop: '4px',  border: '4px solid rgba(97, 72, 161, 0.32)' }} />
//                             <div style={{ paddingBottom: '30px'}} class="chat-sent-time" ng-if="!message.in">
//                                 {message.time}</div>
//                         </div>
//                         <div class="arrow-right-group-chat"></div>
//                         <div class="chat-sent-bubble" style={{ maxWidth: '76%', padding: '3px' }}>
//                             <div>
//                               <img src="{{message.msg}}"
//                                     style={{ width: '107px', height: '88px', float: 'right', marginTop: '4px', padding: '5px', borderRadius: '7%' }}  />
//                             </div>
//                         </div>
//                     </div>

//                     <div class="chat-bubble-wrap" ng-if="message.isImage && message.in">
//                         <div style={{ position: 'absolute', left: '0', width: '8%', minHeight: '10%', paddingBottom: '10px' }}>
//                             <img
//                                 ng-src="{{getImageForMicroblog(message.from, microblog)}}"
//                                 style={{ width: '40px', height: '40px', float: 'left', borderRadius: '50%', border: '4px solid rgba(97, 72, 161, 0.32)' }} />
//                             <span style={{paddingBottom: '30px'}} class="chat-in-time"
//                                 ng-if="message.in">{message.time}</span>

//                         </div>
//                         <div class="chatBubble" style={{ padding: '0' }}>
//                             <div>
//                                 <img src="{{message.msg}}"
//                                     style={{width: '107px', height: '88px', float: 'right', marginTop: '4px',padding: '5px', border-radius: 7%}} alt="sss" />
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//             <div class="chat-reply-area" style="width: 100%;">
//                 <div class="col-md-12 col-sm-12 col-12 colPadZero">
//                     <div class="col-md-10 col-sm-10 col-10 colPadZero" style="width: 99%">
//                         <div class="chat-reply-txt" style="width: 100%; border-radius: 8px;">
//                             <input type="file" name="microblog-message-file" id="{{microblog.room}}" class="inputfile"
//                                 ibg-image-file-reader />
//                             <label for="{{microblog.room}}" class="btn btn-warning btn-flat send-image-button"
//                                 style={{ color: '#fff', backgroundColor: '#5f45a1',borderColor: '#5f45a1',marginRight: '9px'}} >
//                                 <i lass="glyphicon glyphicon-paperclip"></i>
//                             </label>
//                             <input type="text"
//                                 ng-keypress="sendMicroblogMsgOnEnter($event, microblog.microblogMessage, microblog)"
//                                 ng-model="microblog.microblogMessage" class="chat-reply-form"
//                                 placeholder="Type something to send..." />

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//     ))}
// </div>
// {myFriend.show && (
// <div style={{overflowY: 'auto', position: 'absolute', top: '10px', right: '0', left: '620px', bottom: '0', height: '450px', width: '55px', padding: '2px', background: 'transparent'}}>
//     {myFriends.friends && myFriends.friends.map(myFriend => {
//     <div style={{ paddingTop: '10px', width:'50px', height: '60px'}}>
//         <img id={`friendImg${myFriend._id}`} src={myFriend.profile_pic? myFriend.profile_pic: default_img}
//             style={{ width: '45px', height: '45px', borderRadius: '50%'}} ng-click="selectFriend(myFriend._id)" alt="friends" />
//     </div>
//     })}

//     <div style={{textAlign: 'center', paddingTop: '10px', width: '50px', height: '60px'}}>
//         <button class={myFriends.friends.length !== 0 ? 'invite-button-orange' : 'invite-button-faded'}
//             ng-click="inviteFriends()">INVITE</button>
//     </div>
//   </div>
// )}

//     </>
//   );
// };

// export default MicroBlog;
