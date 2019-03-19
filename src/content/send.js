let sendBlock = false;
let percent = 0;

async function sendMessage(message) {
  try {
    sendBlock = true;
    console.log("【群发助手】发送消息---->>", message);
    const { token } = message;
    if (!token) return alert("未能成功登陆！！刷新下当前页面再试");
    if (!selectedUsers.length) return alert("未选择发送用户组");
    if (!selectedContents.length) return alert("未选择发送内容");
    console.log("【群发助手】发送用户---->>", selectedUsers);
    console.log("【群发助手】发送内容---->>", selectedContents);
    percent += 1;
    await setProgress(percent);
    sendBlock = false;
  } catch (e) {
    sendBlock = false;
  }
}

function resetContent(openid, origin) {
  const content = { ...origin };
  content.random = Math.random();
  content.tofakeid = openid;
}

async function setProgress(percent) {
  let text = "";
  if (percent === 0) {
    text = "等待发送";
  } else if (percent < 100) {
    text = `发送中：${percent}%`;
  } else if (percent === 100) {
    text = "发送完成";
  } else {
    text = "未知状态!! 写代码的怎么搞的??!!";
  }
  await utils.sendMessage(MESSAGE_TYPE.RENDER_PROGRESS, { percent, text });
}
