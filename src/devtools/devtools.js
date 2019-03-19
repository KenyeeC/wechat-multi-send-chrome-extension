chrome.devtools.panels.create(
  "WeTool",
  "./logo.png",
  "./src/devtools/panel.html",
  panel => {
    console.log("create panel success", panel);
  }
);
