const utils = {
  query: {
    getParams(search = window.location.search) {
      const result = {};
      const purgedSearch = search.replace("?", "");
      const searchItem = purgedSearch.split("&");
      for (const item of searchItem) {
        const keyValue = item.split("=");
        if (keyValue.length === 2) result[keyValue[0]] = keyValue[1];
      }
      return result;
    },
    parseQueryString(array) {
      const result = {};
      for (const item of array) {
        result[item.name] = item.value;
      }
      return result;
    },
    stringifyFormData(params) {
      let data = "";
      Object.keys(params).forEach(key => {
        data += `&${key}=${params[key]}`;
      });
      return data.replace(/&/, "");
    }
  },
  appendText(target, text) {
    try {
      let str = typeof text === "object" ? JSON.stringify(text) : text;
      const p = document.createElement("p");
      p.innerHTML = str;
      target.appendChild(p);
    } catch (e) {}
  },
  alert(text) {
    const str = typeof text === "object" ? JSON.stringify(text) : text;
    alert(str);
  },
  async getCurrentTab() {
    return new Promise(res => {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const [tab] = tabs;
        res(tab);
      });
    });
  },
  async sendMessageToActiveTag(type, content) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type, content });
      }
    });
  },
  async sendMessage(type, content) {
    chrome.runtime.sendMessage({ type, content });
  },
  async request(url, params = {}, method = "GET", delay = 0) {
    try {
      if (delay) {
        await utils.sleep(delay);
      }
      let response = {};
      if (method === "GET") {
        Object.keys(params).forEach((key, idx) => {
          if (idx === 0) url += `?${key}=${params[key]}`;
          else url += `&${key}=${params[key]}`;
        });
        response = await fetch(url, { method: "GET" });
      }
      if (method === "POST") {
        Object.keys(params).forEach((key, idx) => {
          if (idx === 0) url += `?${key}=${params[key]}`;
          else url += `&${key}=${params[key]}`;
        });
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: utils.query.stringifyFormData(params)
        });
      }
      if (!response.ok || response.status !== 200) throw new Error();
      const data = await response.text();
      const result = JSON.parse(data);
      return result;
    } catch (e) {
      console.error("request error: ", e);
      return false;
    }
  },
  async sleep(millseconds) {
    return new Promise(resolve => setTimeout(resolve, millseconds));
  }
};
