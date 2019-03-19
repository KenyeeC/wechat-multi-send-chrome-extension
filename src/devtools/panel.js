const tips = document.getElementById("tips");
const log = document.getElementById("log");
const send = document.getElementById("send");
const modal = document.getElementById("modal");
const progress = document.getElementById("progress");
const progressLabel = document.getElementById("progressLabel");
const userGroups = document.getElementById("userGroups");
const contentGroups = document.getElementById("contentGroups");
const userGroupsCount = document.getElementById("userGroupsCount");
const contentGroupsCount = document.getElementById("contentGroupsCount");

let currentTabId = "";

let loginToken = null;
let sending = false;

async function main() {
  const currentTab = await utils.getCurrentTab();
  const { url = "", id } = currentTab;

  currentTabId = id;

  // 如果不是目标页面，则什么都不做
  if (!url.includes(HOST))
    return (tips.innerHTML = `❗️获取登录信息失败, 请登录微信公众号平台: ${HOST}`);

  // 获取页面 token
  const queryParams = utils.query.getParams(url);
  const { token } = queryParams;
  tips.innerHTML =
    "✅获取登录信息成功！" ||
    "❗️获取登录信息失败, 确认登录成功或重新登录一下, 讲道理链接上应该有个 token 的";

  loginToken = token;
  if (token) await getUser();
}

async function getUser(delay = 0) {
  userGroupsCount.innerHTML =
    '<div class="ui active inline loader tiny"></div>';
  if (delay) {
    await utils.sleep(delay);
  }
  await utils.sendMessageToActiveTag(MESSAGE_TYPE.GET_USER, {
    token: loginToken
  });
}

function isSendRequest(request) {
  const { method, url } = request;
  return url.includes(QUERY_URL.SEND + "?") && method === "POST";
}

function renderUserGroup(msg) {
  const { userGroups: datas } = msg;
  Object.keys(datas).forEach(key => {
    const item = datas[key];
    try {
      const option = document.createElement("option");
      option.value = item.group_id;
      option.innerHTML = ` ${item.group_name}(${item.group_cnt})`;
      userGroups.appendChild(option);
    } catch (e) {
      utils.alert(e.message);
    }
  });
  userGroupsCount.innerText = Object.keys(datas).length;
}

function renderContent(msg) {
  contentGroups.innerHTML = "";
  msg.forEach(item => {
    try {
      const option = document.createElement("option");
      option.value = item.id;
      option.innerHTML = item.title;
      contentGroups.appendChild(option);
    } catch (e) {
      utils.alert(e.message);
    }
  });
  contentGroupsCount.innerText = msg.length;
}

function renderProgress(msg) {
  const { percent, text } = msg;
  $(progress).progress({
    percent
  });
  progressLabel.innerText = text;
}

function sendStart() {
  if (!sending) {
    sending = true;
    $(modal).modal("show");
  }
}

function sendEnd() {
  sending = false;
}

function checkIsCurrentTab(tabId) {
  return tabId === currentTabId;
}

async function unloadPage() {
  await getUser(1000);
}

// init
$(function() {
  main();

  // 监听请求
  chrome.devtools.network.onRequestFinished.addListener(event => {
    const { url, postData } = event.request;
    if (isSendRequest(event.request) && !sending) {
      utils.sendMessageToActiveTag(MESSAGE_TYPE.PARSE_CONTENT, {
        url,
        postData: postData.params
      });
    }
  });

  $(userGroups).dropdown({
    onChange: function(value, text) {
      utils.sendMessageToActiveTag(MESSAGE_TYPE.SELECT_USER, {
        value,
        text
      });
    }
  });

  $(contentGroups).dropdown({
    onAdd: addedValue =>
      utils.sendMessageToActiveTag(MESSAGE_TYPE.SELECT_CONTENT, {
        add: true,
        value: addedValue
      }),
    onRemove: removedValue =>
      utils.sendMessageToActiveTag(MESSAGE_TYPE.SELECT_CONTENT, {
        add: false,
        value: removedValue
      })
  });

  // 监听发送按钮
  send.addEventListener("click", () => {
    utils.sendMessageToActiveTag(MESSAGE_TYPE.SEND_MESSAGE, {
      token: loginToken
    });
  });
});
