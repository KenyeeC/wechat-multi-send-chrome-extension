let sendBlock = false;
let sentUsers = [];
let total = 0;

async function sendMessage(message) {
  try {
    sentUsers = [];
    await setProgress(0);
    utils.resetCount();
    sendBlock = true;
    console.log("【群发助手】发送消息---->>", message);
    const { token } = message;
    const valid = validateSend(token);
    console.log("【群发助手】发送URL---->>", sendUrl);
    console.log("【群发助手】发送用户组---->>", selectedGroups);
    console.log("【群发助手】发送内容---->>", selectedContents);
    const confirmSend = confirm("确认发送？");
    if (confirmSend) {
      await utils.sendMessage(MESSAGE_TYPE.SEND_START, { valid });
      const reqStatus = {
        success: 0,
        fail: 0,
        totalSecond: 0,
        successUser: 0,
        failUser: 0
      };
      const sentUsers = {};
      const lastUser = {};
      total = getAllUserCountInGroup(selectedGroups);
      reqStatus.totalSecond = 2500 * total;
      for (const i in selectedGroups) {
        const group = selectedGroups[i];
        if (group.group_cnt > 0) {
          await sendToGroup(
            token,
            group.group_id,
            lastUser,
            sentUsers,
            reqStatus
          );
        }
      }
    } else {
      alert("已中止发送");
      throw "Block!!!";
    }
    throw "Done";
  } catch (e) {
    if (e === "Done") {
      console.log("Done!!!!!!");
    } else {
      console.error("【群发助手】send errMsg:", e);
    }
    sendBlock = false;
    await utils.sendMessage(MESSAGE_TYPE.SEND_END, {});
  }
}

function validateSend(token) {
  let valid = true;
  if (!token) {
    alert("未能成功登陆！！刷新下当前页面再试");
    valid = false;
  } else if (!selectedGroups.length) {
    alert("未选择发送用户组");
    valid = false;
  } else if (!selectedContents.length) {
    alert("未选择发送内容");
    valid = false;
  } else if (!sendUrl) {
    alert("未能获取发送的链接");
    valid = false;
  }
  if (!valid) {
    throw "发送数据验证不通过";
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
  let status = "";
  let time = "";

  if (reqStatus) {
    status =
      `(成功人数：${reqStatus.successUser}　/　` +
      `失败人数：${reqStatus.failUser}　/　` +
      `成功条数：${reqStatus.success}　/　` +
      `失败条数：${reqStatus.fail})`;
    const second = reqStatus.totalSecond / 1000;
    const minute = Math.floor(second / 60);
    time = minute ? `约${minute}分钟` : `约${second}秒`;
  }

  if (percent === 0) {
    text = "等待发送";
  } else if (percent < 100) {
    text = `发送中：${percent}%　${time}　${status}`;
  } else if (percent === 100) {
    text = `发送完成!!!! ${status}`;
  } else {
    text = "未知状态!! 写代码的怎么搞的??!!";
  }
  await utils.sendMessage(MESSAGE_TYPE.RENDER_PROGRESS, { percent, text });
}

function parseRes(res) {
  const { base_resp } = res;
  return base_resp.err_msg ? false : true;
}

function getAllUserCountInGroup(groupList) {
  const countArr = groupList.map(ele => ele.group_cnt);
  let count = 0;
  for (const item of countArr) {
    count += item;
  }
  return count * selectedContents.length;
}

async function sendToGroup(
  token,
  groupId,
  lastUser = {},
  sentUsers,
  reqStatus
) {
  const groupid = groupId === 0 ? -2 : groupId;
  const res = await getAllUserAndGroup({ token }, lastUser, groupid);
  const usersLength = res.userList.length;
  let users = res.userList;
  if (groupId === 0) {
    users = users.filter(item => item.user_group_id.length === 0);
  }
  if (users.length > 0) {
    await sendToUsers(users, sentUsers, reqStatus);
  }
  if (usersLength === PAGE_LIMIT) {
    const theLastOne = users[users.length - 1];
    return sendToGroup(token, groupId, theLastOne, sentUsers, reqStatus);
  }
}

async function sendToUsers(users, sentUsers, reqStatus) {
  for (const user of users) {
    for (const item of selectedContents) {
      utils.addCount();
      const count = utils.getCount();
      // 避免一个用户重复发送
      if (!sentUsers[user.user_openid]) {
        const delay = count === 1 ? 500 : 2500;
        const params = resetContent(user.user_openid, item.params);
        const res = await utils.request(sendUrl, params, "POST", delay);
        // 发送失败的下次不需要发送了
        if (!parseRes(res)) {
          addUserSendStatus(sentUsers, user.user_openid, SEND_STATUS.FAIL);
        }
        parseRes(res) ? (reqStatus.success += 1) : (reqStatus.fail += 1);
      } else {
        reqStatus.fail += 1;
      }
      const percent = Math.floor((count / total) * 100);
      await setProgress(percent, reqStatus);
    }
    addUserSendStatus(sentUsers, user.user_openid, SEND_STATUS.OK);
    calcUserSendStatus(sentUsers, reqStatus);
    await setProgress(Math.floor((utils.getCount() / total) * 100), reqStatus);
  }
}

function addUserSendStatus(sentUsers, openid, status) {
  sentUsers[openid] = sentUsers[openid] || status;
}

function calcUserSendStatus(sentUsers, reqStatus) {
  reqStatus.successUser = 0;
  reqStatus.failUser = 0;
  Object.keys(sentUsers).forEach(key => {
    switch (sentUsers[key]) {
      case SEND_STATUS.OK:
        reqStatus.successUser += 1;
        break;
      case SEND_STATUS.FAIL:
        reqStatus.failUser += 1;
        break;
      default:
        break;
    }
  });
}
