export default {
  lang: "en",
  musicLanguage: "all",
  appearance: "auto",
  musicQuality: 320000,
  lyricFontSize: 28,
  outputDevice: "default",
  showPlaylistsByAppleMusic: true,
  enableUnblockNeteaseMusic: true,
  automaticallyCacheSongs: true,
  cacheLimit: 8192,
  enableReversedMode: false,
  nyancatStyle: false,
  showLyricsTranslation: true,
  lyricsBackground: true,
  closeAppOption: "ask",
  enableDiscordRichPresence: false,
  enableGlobalShortcut: true,
  showLibraryDefault: false,
  subTitleDefault: false,
  enabledPlaylistCategories: [
    "全部",
    "推荐歌单",
    "精品歌单",
    "官方",
    "排行榜",
    "欧美",
    "流行",
    "摇滚",
    "电子",
    "说唱",
    "ACG",
  ],
  proxyConfig: { protocol: "noProxy", server: "", port: null },
  shortcuts: [
    {
      id: "play",
      name: "播放/暂停",
      shortcut: "CommandOrControl+P",
      globalShortcut: "Alt+CommandOrControl+P",
    },
    {
      id: "next",
      name: "下一首",
      shortcut: "CommandOrControl+Right",
      globalShortcut: "Alt+CommandOrControl+Right",
    },
    {
      id: "previous",
      name: "上一首",
      shortcut: "CommandOrControl+Left",
      globalShortcut: "Alt+CommandOrControl+Left",
    },
    {
      id: "increaseVolume",
      name: "增加音量",
      shortcut: "CommandOrControl+Up",
      globalShortcut: "Alt+CommandOrControl+Up",
    },
    {
      id: "decreaseVolume",
      name: "减少音量",
      shortcut: "CommandOrControl+Down",
      globalShortcut: "Alt+CommandOrControl+Down",
    },
    {
      id: "like",
      name: "喜欢歌曲",
      shortcut: "CommandOrControl+L",
      globalShortcut: "Alt+CommandOrControl+L",
    },
    {
      id: "minimize",
      name: "隐藏/显示播放器",
      shortcut: "CommandOrControl+M",
      globalShortcut: "Alt+CommandOrControl+M",
    },
  ],
};
