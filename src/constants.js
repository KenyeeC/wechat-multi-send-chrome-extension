const HOST = "https://mp.weixin.qq.com/";

const QUERY_URL = {
  USER: "/cgi-bin/user_tag",
  SEND: "/cgi-bin/singlesend"
};

const MESSAGE_TYPE = {
  GET_USER: "GET_USER",
  PARSE_CONTENT: "PARSE_CONTENT",
  RENDER_USER_GROUPS: "RENDER_USER_GROUPS",
  RENDER_CONTENT: "RENDER_CONTENT",
  SELECT_USER: "SELECT_USER",
  SELECT_CONTENT: "SELECT_CONTENT",
  SEND_MESSAGE: "SEND_MESSAGE"
};

const DELAY = {
  GET_USER_DELAY: 1500,
  SEND_MSG_DELAY: 2300
};

const GROUP_ID = {
  NO_GOURP: 0,
  ALL_USER_ID: -99999
};

const CONTENT_TYPE = {
  TEXT: "1",
  IMAGE: "2",
  CARD: "10"
};
