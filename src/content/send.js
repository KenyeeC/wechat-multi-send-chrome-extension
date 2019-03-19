let sendBlock = false;

async function sendMessage(message) {
  try {
    await setProgress(0);
    sendBlock = true;
    console.log("【群发助手】发送消息---->>", message);
    const { token } = message;
    if (!token) return alert("未能成功登陆！！刷新下当前页面再试");
    if (!selectedUsers.length) return alert("未选择发送用户组");
    if (!selectedContents.length) return alert("未选择发送内容");
    if (!sendUrl) return alert("未能获取发送的链接");
    console.log("【群发助手】发送URL---->>", sendUrl);
    console.log("【群发助手】发送用户---->>", selectedUsers);
    console.log("【群发助手】发送内容---->>", selectedContents);
    let count = 0;
    const reqStatus = {
      success: 0,
      fail: 0
    };
    const total = selectedUsers.length * selectedContents.length;
    for (const i in selectedUsers) {
      const user = selectedUsers[i];
      for (const item of selectedContents) {
        const delay = count ? 2000 : 0;
        const params = resetContent(user.user_openid, item);
        const res = await utils.request(sendUrl, params, "POST", delay);
        parseRes(res) ? (reqStatus.success += 1) : (reqStatus.fail += 1);
        count += 1;
        const percent = Math.floor((count / total) * 100);
        await setProgress(percent, reqStatus);
      }
    }

    throw "done!";
  } catch (e) {
    console.log("【群发助手】send errMsg:", e);
    sendBlock = false;
    await utils.sendMessage(MESSAGE_TYPE.SEND_END, {});
  }
}

function resetContent(openid, origin) {
  const content = { ...origin };
  content.random = Math.random();
  content.tofakeid = openid;
  return content;
}

async function setProgress(percent, reqStatus) {
  let text = "";
  let status = reqStatus
    ? `(成功条数：${reqStatus.success}/ 失败条数：${reqStatus.fail})`
    : "";
  if (percent === 0) {
    text = "等待发送";
  } else if (percent < 100) {
    text = `发送中：${percent}% ${status}`;
  } else if (percent === 100) {
    text = `发送完成 ${status}`;
  } else {
    text = "未知状态!! 写代码的怎么搞的??!!";
  }
  await utils.sendMessage(MESSAGE_TYPE.RENDER_PROGRESS, { percent, text });
}

function parseRes(res) {
  const { base_resp } = res;
  return base_resp.err_msg ? false : true;
}
