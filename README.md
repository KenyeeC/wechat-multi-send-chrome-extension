# wechat-multi-send-chrome-extension
微信公众号群发工具 - chrome 插件

## 功能
微信公众号给用户发送消息只能一个一个点进去发送，工作非常繁琐。此插件可以直接给分组用户群发内容（48小时内未联系的用户依然无法发送）

## 安装
[点击进入下载页面下载crx](https://github.com/KenyeeC/wechat-multi-send-chrome-extension/releases)，也可以直接下载源码自行安装

[chrome插件安装方法](https://www.jianshu.com/p/bb51dc91b93a)

## 使用
1. 进入微信公众号平台 →  管理 → 用户管理
2. 将需要群发的用户打上同一个标签（如果所有用户都发或者已存在标签，可省略这一步）
3. 选择一个用户（建议是自己人），点他头像进入发送消息的页面
4. window 系统下按 F12，mac 系统按 alt + command + i 打开chrome调试器, 选择 【群发助手】
5. 向用户发送你将要发送的内容（目前支持图文消息、文字、图片），当发送出去的时候，插件会自动捕获到你要发送的内容
6. 在群发助手中选择用户组（用户组可多选，有重复用户的话会排重）和 发送内容（发送内容的顺序会根据你的选择顺序来决定）
7. 点击发送即可（由于要模拟人的行为，每条消息发送都会隔几秒，此时只要慢慢等待即可）
