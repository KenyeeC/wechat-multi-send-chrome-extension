let token = "";
let allGroups = [];
let selectedUsers = [];
let selectedGroups = [];

async function getAllUserAndGroup(content, lastUser = {}, groupId = -2) {
  try {
    token = token || content.token;
    const beginCreateTime = lastUser.user_create_time || -1;
    const beginOpenid = lastUser.user_openid || -1;
    const params = {
      action: "get_user_list",
      groupid: groupId,
      begin_openid: beginOpenid,
      begin_create_time: beginCreateTime,
      limit: PAGE_LIMIT,
      offset: 0,
      backfoward: 1,
      token: token || content.token,
      lang: "zh_CN",
      f: "json",
      ajax: 1,
      random: Math.random()
    };

    const res = await utils.request(QUERY_URL.USER, params, "GET", 2);
    const groupList = res.group_info.group_info_list;
    let userList = res.user_list.user_info_list;
    validateUser(userList);
    validateGroup(groupList);
    allGroups = groupList;
    return {
      groupList,
      userList
    };
  } catch (e) {
    console.error("【群发助手】", e);
    return null;
  }
}

function validateUser(userList) {
  for (const user of userList) {
    const valid = Array.isArray(user.user_group_id) && user.user_openid;
    if (!valid) {
      console.log("【群发助手】用户数据:", groupList);
      throw "用户数据校验不通过！！！";
    }
  }
}

function validateGroup(groupList) {
  for (const group of groupList) {
    const valid =
      Number.isInteger(group.group_cnt) &&
      Number.isInteger(group.group_id) &&
      group.group_name;
    if (!valid) {
      console.log("【群发助手】组数据:", groupList);
      throw "组数据校验不通过！！！";
    }
  }
}

function userChanged(data) {
  const result = [];
  const value = data.value.map(e => Number(e));
  value.forEach(item => {
    const [group] = allGroups.filter(g => g.group_id === item);
    if (group) result.push(group);
  });
  selectedGroups = result;
  console.log("【群发助手】selected groups:::", selectedGroups);
}
