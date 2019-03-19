chrome.runtime.onMessage.addListener(async data => {
  console.log("【群发助手】message Listener ==========>>>>", data);
  switch (data.type) {
    case MESSAGE_TYPE.GET_USER:
      const res = await getAllUserAndGroup(data.content);
      utils.sendMessage(MESSAGE_TYPE.RENDER_USER_GROUPS, res);
      break;
    case MESSAGE_TYPE.PARSE_CONTENT:
      await parseContent(data.content);
      break;
    case MESSAGE_TYPE.SELECT_USER:
      await userChanged(data.content);
      break;
    case MESSAGE_TYPE.SEND_MESSAGE:
      await sendMessage(data.content);
      break;
  }
});
