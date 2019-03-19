// const POPUP_ANSWER = "POPUP-ANSWER";
// const checkBox = document.getElementById("BBASK-TOGGLE-V1");
// const inputText = document.getElementById("inputText");
// const input = document.getElementById("input");
// const searchResult = document.getElementById("search-result");
// const copyButton = document.getElementById("copy");

// let selectedAnswer = null;

// // 初始化配置
// setButtonText("复制", false);
// chrome.storage.local.get({ openSelect: true }, function(items) {
//   items.openSelect ? (checkBox.checked = true) : (checkBox.checked = false);
// });

// function enableSelect() {
//   chrome.storage.local.set({ openSelect: true });
//   chrome.browserAction.setBadgeText({ text: "" });
// }

// function disableSelect() {
//   chrome.storage.local.set({ openSelect: false });
//   chrome.browserAction.setBadgeText({ text: "stop" });
// }

// function handleInputDone() {
//   if (!input.value) return;
//   setButtonText("搜索中...", false);
//   chrome.runtime.sendMessage({
//     type: "BBASKING",
//     content: { question: input.value, callbackType: POPUP_ANSWER }
//   });
// }

// function handleSearchResult(answers) {
//   const fragment = utils.parseResultToFragment(answers);
//   searchResult.innerHTML = "";
//   setSelectedAnswer(null);
//   searchResult.appendChild(fragment);
//   setButtonText("复制", false);
// }

// function setButtonText(text, enable = true) {
//   copyButton.className = copyButton.className.replace(/\s*disabled/g, "");
//   if (!enable) {
//     copyButton.className += " disabled";
//   }
//   copyButton.innerText = text;
// }

// function setSelectedAnswer(text) {
//   selectedAnswer = text;
// }

// checkBox.addEventListener("click", () => {
//   checkBox.checked ? enableSelect() : disableSelect();
// });

// input.onkeyup = event => {
//   var key = event.which || event.keyCode || event.charCode;
//   if (key == 13) {
//     handleInputDone();
//   }
// };

// inputText.addEventListener("click", handleInputDone);

// searchResult.addEventListener("click", event =>
//   utils.handleAccordingClick(event.path, searchResult, text => {
//     setSelectedAnswer(text);
//     setButtonText("复制", true);
//   })
// );

// copyButton.addEventListener("click", () => {
//   setButtonText("复制成功!", true);
//   const timmer = setTimeout(() => {
//     setButtonText("复制", true);
//     clearTimeout(timmer);
//   }, 1000);
//   utils.copyText(selectedAnswer);
// });

// chrome.runtime.onMessage.addListener(async data => {
//   if (data.type === POPUP_ANSWER) {
//     handleSearchResult(data.content.result.data);
//   }
// });
