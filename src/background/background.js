const store = {
  userGroups: {},
  message: []
};

// chrome.runtime.onMessage.addListener(async data => {
//   switch (data.type) {
//     case MESSAGE_TYPE.GET_USER:
//       await execGetUser(data.content);
//       break;
//     default:
//       break;
//   }
// });

// const QUERY_API =
//   "https://chatbot.yujianedu.cn/chatbot/api/1/chrome/extension/ask";
// const LOGIN_API =
//   "https://chatbot.yujianedu.cn/chatbot/api/1/chrome/extension/valid";

// let requestBlock = false;

// chrome.storage.local.get({ openSelect: true }, function(items) {
//   items.openSelect
//     ? chrome.browserAction.setBadgeText({ text: "" })
//     : chrome.browserAction.setBadgeText({ text: "stop" });
//   chrome.browserAction.setBadgeBackgroundColor({ color: "#f36331" });
// });

// chrome.runtime.onMessage.addListener(async data => {
//   if (data.type === "BBASKING") {
//     await answerQuestion(data.content.question, data.content.callbackType);
//   }
//   if (data.type === "SET_ACCESS_ID") {
//     setAccessId(data.content.value);
//   }
//   if (data.type === "SHOW_RESULT") {
//   }
//   if (data.type === "LOGIN") {
//     await login(data.content.id);
//   }
// });

// async function answerQuestion(question, callbackType) {
//   chrome.storage.local.get({ accessId: null }, async items => {
//     if (!items.accessId) {
//       toLogin();
//     } else {
//       const result = await request(QUERY_API, { question, id: items.accessId });
//       // 验证不通过的清除登录状态
//       if (result && result.code !== 0) {
//         setAccessId(null);
//         return toLogin();
//       }
//       chrome.runtime.sendMessage({
//         type: callbackType,
//         content: { result, question }
//       });
//       sendMessageToActiveTag({
//         type: callbackType,
//         content: { result, question }
//       });
//     }
//   });
// }

// function toLogin() {
//   sendMessageToActiveTag({
//     type: "SHOW-LOGIN"
//   });
// }

// async function login(id) {
//   const loginType = "LOGIN-RESULT";
//   if (!id)
//     return sendMessageToActiveTag({
//       type: loginType,
//       content: false
//     });
//   const result = await request(LOGIN_API, { id });
//   return sendMessageToActiveTag({
//     type: loginType,
//     content: result && result.code === 0 && result.data ? id : false
//   });
// }

// function sendMessageToActiveTag(message) {
//   chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     if (tabs.length > 0) {
//       chrome.tabs.sendMessage(tabs[0].id, message);
//     }
//   });
// }

// function setAccessId(accessId) {
//   chrome.storage.local.set({ accessId });
// }

// async function request(url, params, method = "GET") {
//   try {
//     if (requestBlock) return;
//     requestBlock = true;
//     let response = {};
//     if (method === "GET") {
//       Object.keys(params).forEach((key, idx) => {
//         if (idx === 0) url += `?${key}=${params[key]}`;
//         else url += `&${key}=${params[key]}`;
//       });
//       response = await fetch(url, { method: "GET" });
//     }
//     if (!response.ok || response.status !== 200) throw new Error();
//     const data = await response.text();
//     const result = JSON.parse(data);
//     requestBlock = false;
//     return result;
//   } catch (e) {
//     requestBlock = false;
//     return false;
//   }
// }
