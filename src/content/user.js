let allUsers = [];
let selectedUsers = [];

async function getAllUserAndGroup(content, lastUser = {}, lastUserList = []) {
  try {
    const beginCreateTime = lastUser.user_create_time || -1;
    const beginOpenid = lastUser.user_openid || -1;
    const limit = 20;
    const params = {
      action: "get_user_list",
      groupid: -2,
      begin_openid: beginOpenid,
      begin_create_time: beginCreateTime,
      limit,
      offset: 0,
      backfoward: 1,
      token: content.token,
      lang: "zh_CN",
      f: "json",
      ajax: 1,
      random: Math.random()
    };

    const res = await utils.request(QUERY_URL.USER, params, "GET", 2);
    const groupList = res.group_info.group_info_list;
    const userList = res.user_list.user_info_list;
    const combindUserList = [...lastUserList, ...userList];
    validateUser(userList);
    validateGroup(groupList);
    // 若列表人数等于列表 limit 长度，则当作还有数据，递归获取
    if (userList.length === limit) {
      return getAllUserAndGroup(
        content,
        userList[userList.length - 1],
        combindUserList
      );
    }
    // 若列表人数小于列表 limit 长度，则当作人数已取完
    allUsers = combindUserList;
    return {
      groupList,
      userList: combindUserList,
      userGroups: buildUserGroups(groupList, combindUserList)
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

function buildUserGroups(groupList, userList) {
  const groups = {};
  groups[GROUP_ID.ALL_USER_ID] = {
    group_id: GROUP_ID.ALL_USER_ID,
    group_name: "全部用户",
    members: userList,
    group_cnt: userList.length,
    group_create_time: 0
  };
  for (const group of groupList) {
    const members = userList.filter(user => {
      // 未分组用户
      if (group.group_id === GROUP_ID.NO_GOURP) {
        return user.user_group_id.length === 0;
      }
      // 其他用户根据组名来分
      return user.user_group_id.includes(group.group_id);
    });
    group.members = members;
    groups[group.group_id] = group;
  }
  return groups;
}

function userChanged(data) {
  selectedUsers = [];
  const value = data.value.map(e => Number(e));
  if (value.includes(GROUP_ID.ALL_USER_ID)) {
    selectedUsers = allUsers;
    return;
  }
  value.forEach(chip => {
    allUsers.forEach(user => {
      if (chip === GROUP_ID.NO_GOURP && user.user_group_id.length === 0) {
        addSelectedUsers(user);
      } else if (user.user_group_id.includes(chip)) {
        addSelectedUsers(user);
      }
    });
  });
  console.log("【群发助手】all users::::", allUsers);
  console.log("【群发助手】users changed:::::", value);
  console.log("【群发助手】selected users:::", selectedUsers);
}

function addSelectedUsers(user) {
  const exist = selectedUsers.filter(
    item => item.user_openid === user.user_openid
  );
  if (!exist.length) {
    selectedUsers.push(user);
  }
}
