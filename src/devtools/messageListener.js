chrome.runtime.onMessage.addListener(async data => {
  switch (data.type) {
    case MESSAGE_TYPE.RENDER_USER_GROUPS:
      renderUserGroup(data.content);
      break;
    case MESSAGE_TYPE.RENDER_CONTENT:
      renderContent(data.content);
      break;
    case MESSAGE_TYPE.RENDER_PROGRESS:
      renderProgress(data.content);
      break;
    case MESSAGE_TYPE.SEND_END:
      await sendEnd();
      break;
  }
});
