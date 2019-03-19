chrome.runtime.onMessage.addListener(async (data, source) => {
  const tabId = source.tab.id;
  const isCurrentTab = checkIsCurrentTab(tabId);
  if (!isCurrentTab) return;
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
    case MESSAGE_TYPE.SEND_START:
      await sendStart(data.content);
      break;
    case MESSAGE_TYPE.SEND_END:
      await sendEnd();
      break;
    case MESSAGE_TYPE.UNLOAD_PAGE:
      await unloadPage();
      break;
  }
});
