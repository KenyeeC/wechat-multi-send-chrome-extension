const contents = [];
let selectedContents = [];

async function parseContent(content) {
  const { url, postData } = content;
  const params = utils.query.parseQueryString(postData);
  console.log("【群发助手】请求参数拦截成功 --->>>", params);
  const { type } = params;
  let title = "";
  switch (type) {
    case CONTENT_TYPE.TEXT:
      title = "【文字】" + params["content"];
      break;
    case CONTENT_TYPE.IMAGE:
      title =
        "【图片】图片ID: " + params["fileid"] + "（目前无法给出图片预览）";
      break;
    case CONTENT_TYPE.CARD:
      title =
        "【卡片】" + decodeURIComponent(params["multi_item%5B0%5D%5Btitle%5D"]);
      break;
    default:
      break;
  }
  const id = btoa(Math.random() + new Date().valueOf());
  contents.push({ id, title, type, params, url });
  utils.sendMessage(MESSAGE_TYPE.RENDER_CONTENT, contents);
}

async function contentChanged(data) {
  selectedContents = [];
  const { value } = data;
  console.log("群发助手】all contents::::", contents);
  console.log("【群发助手】selected contents::::", value);
  value.forEach(chip => {
    contents.forEach(item => {
      if (item.id === chip) {
        selectedContents.push(item.params);
      }
    });
  });
}
