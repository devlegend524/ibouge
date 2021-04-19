export const generateRoomName = (me, friend) => {
  return me < friend ? me + '___' + friend : friend + '___' + me;
};
export const _scrollToBottom = (elm) => {
  return (elm.scrollTop = elm.scrollHeight);
};
export const linkify = (text) => {
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(urlRegex, function (url) {
    console.log(url);
    return '<a href="' + url + '">' + url + '</a>';
  });
};
