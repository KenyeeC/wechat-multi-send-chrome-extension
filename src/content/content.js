let sendUrl = "";
let contents = [];
let selectedContents = [];

async function parseContent(content) {
  const { url, postData } = content;
  sendUrl = url;
  const params = utils.query.parseQueryString(postData);
  const { type } = params;
  let title = "";
  switch (type) {
    case CONTENT_TYPE.TEXT:
      title = "【文字】" + decodeURIComponent(params["content"]);
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
  contents.push({ id, title, type, params });
  utils.sendMessage(MESSAGE_TYPE.RENDER_CONTENT, contents);
}

async function contentChanged(data) {
  const { value, add } = data;
  if (add) {
    addSelectedContent(value);
  } else {
    removeSelectedContent(value);
  }
  console.log("【群发助手】all contents::::", contents);
  console.log("【群发助手】selected contents::::", selectedContents);
}

function addSelectedContent(value) {
  const [item] = contents.filter(elem => elem.id === value);
  selectedContents.push(item);
}

function removeSelectedContent(value) {
  selectedContents = selectedContents.filter(elem => elem.id !== value);
}
