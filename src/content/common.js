window.onunload = async () => {
  await utils.sendMessage(MESSAGE_TYPE.UNLOAD_PAGE, {});
};
