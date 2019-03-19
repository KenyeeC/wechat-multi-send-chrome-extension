chrome.devtools.panels.create(
  "群发助手",
  "./logo.png",
  "./src/devtools/panel.html",
  panel => {
    console.log("create panel success", panel);
  }
);
