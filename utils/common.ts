import { isAccountLoggedIn } from "./auth";
import { refreshCookie } from "@/api/auth";
import { dailySignin } from "@/api/user";
import dayjs from "dayjs";
// import store from '@/store';
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * @description 调整网易云封面图片大小
 * @param  {string} url 封面图片URL
 * @param  {'xs'|'sm'|'md'|'lg'} size - 大小，值对应为 128px | 256px | 512px | 1024px
 */
export function resizeImage(
  url: string,
  size: "xs" | "sm" | "md" | "lg"
): string {
  if (!url) return "";

  const sizeMap = {
    xs: "128",
    sm: "256",
    md: "512",
    lg: "1024",
  };
  return `${url}?param=${sizeMap[size]}y${sizeMap[size]}`.replace(
    "http://",
    "https://"
  );
}
/**
 * @description 格式化日期
 * @param  {number} timestamp - 时间戳
 * @param  {'en'|'zh-TW'|'zh-CN'='en'} locale - 日期语言
 * @param  {string='default'} format - 格式化字符串，参考 dayjs
 */
export function formatDate(
  timestamp: number,
  locale: "en" | "zh-TW" | "zh-CN" = "zh-CN",
  format: string = "default"
): string {
  if (!timestamp) return "";
  if (format === "default") {
    format = "MMM D, YYYY";
    if (["zh-CN", "zh-TW"].includes(locale)) format = "YYYY年MM月DD日";
  }
  return dayjs(timestamp).format(format);
}
const parseData = async () => {
  try {
    const data = await AsyncStorage.getItem("persist:data");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("data parse error", error);
  }
};
let data;
(async () => (data = await parseData()))();
console.log();
export function isTrackPlayable(track) {
  let result = {
    playable: true,
    reason: "",
  };

  if (track?.privilege?.pl > 0) {
    return result;
  }
  // cloud storage judgement logic
  if (isAccountLoggedIn() && track?.privilege?.cs) {
    return result;
  }
  if (track.fee === 1 || track.privilege?.fee === 1) {
    if (isAccountLoggedIn() && data.user.vipType === 11) {
      result.playable = true;
    } else {
      result.playable = false;
      result.reason = "VIP Only";
    }
  } else if (track.fee === 4 || track.privilege?.fee === 4) {
    result.playable = false;
    result.reason = "付费专辑";
  } else if (
    track.noCopyrightRcmd !== null &&
    track.noCopyrightRcmd !== undefined
  ) {
    result.playable = false;
    result.reason = "无版权";
  } else if (track.privilege?.st < 0 && isAccountLoggedIn()) {
    result.playable = false;
    result.reason = "已下架";
  }
  return result;
}
type privilegeType = { id: unknown; [key: string]: unknown };
export function mapTrackPlayableStatus(
  tracks: any[],
  privileges: privilegeType[] = []
) {
  console.log("mapTrackPlayableStatus");
  if (!tracks?.length) {
    console.log("mapTrackPlaybleStatus no length");
    return tracks;
  } else {
    console.log("mapTrackPlayableStatus length", tracks.length);
  }

  let newTracks = tracks.map((t) => {
    console.log("mapTraks", t);
    const privilege = privileges.find((item) => item.id === t.id) || {};
    if (t.privilege) {
      Object.assign(t.privilege, privilege);
    } else {
      t.privilege = privilege;
    }
    console.log("test before playble");
    let result = isTrackPlayable(t);
    console.log("test after playble", result);
    t.playable = result.playable;
    t.reason = result.reason;
    console.log("mapTrackPlaybleStatus3", t);
    // console.log(t);
    return t;
  });
  console.log("mapTrackPlaybleStatus newTracks", newTracks);
  return newTracks;
}

export function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return Math.random() * minNum + 1;
    case 2:
      return Math.random() * (maxNum - minNum + 1) + minNum;
    default:
      return 0;
  }
}

export function shuffleAList(list) {
  let sortsList = list.map((t) => t.sort);
  for (let i = 1; i < sortsList.length; i++) {
    const random = Math.floor(Math.random() * (i + 1));
    [sortsList[i], sortsList[random]] = [sortsList[random], sortsList[i]];
  }
  let newSorts = {};
  list.map((track) => {
    newSorts[track.id] = sortsList.pop();
  });
  return newSorts;
}

// export function throttle(fn, time) {
//   let isRun = false;
//   return function () {
//     if (isRun) return;
//     isRun = true;
//     fn.apply(this, arguments);
//     setTimeout(() => {
//       isRun = false;
//     }, time);
//   };
// }

export function updateHttps(url) {
  if (!url) return "";
  return url.replace(/^http:/, "https:");
}

export function dailyTask() {
  let lastDate = data.lastRefreshCookieDate;
  if (
    isAccountLoggedIn() &&
    (lastDate === undefined || lastDate !== dayjs().date())
  ) {
    console.debug("[debug][common.js] execute dailyTask");
    refreshCookie().then(() => {
      console.debug("[debug][common.js] 刷新cookie");
      // store.commit('updateData', {
      //   key: 'lastRefreshCookieDate',
      //   value: dayjs().date(),
      // });
      data.lastRefreshCookieDate = dayjs().date();
    });
    dailySignin(0).catch(() => {
      console.debug("[debug][common.js] 手机端重复签到");
    });
    dailySignin(1).catch(() => {
      console.debug("[debug][common.js] PC端重复签到");
    });
  }
}

// export function changeAppearance(appearance) {
//   if (appearance === "auto" || appearance === undefined) {
//     appearance = window.matchMedia("(prefers-color-scheme: dark)").matches
//       ? "dark"
//       : "light";
//   }
//   document.body.setAttribute("data-theme", appearance);
//   document
//     .querySelector('meta[name="theme-color"]')
//     .setAttribute("content", appearance === "dark" ? "#222" : "#fff");
// }

export function splitSoundtrackAlbumTitle(title) {
  let keywords = [
    "Music from the Original Motion Picture Score",
    "The Original Motion Picture Soundtrack",
    "Original MGM Motion Picture Soundtrack",
    "Complete Original Motion Picture Score",
    "Original Music From The Motion Picture",
    "Music From The Disney+ Original Movie",
    "Original Music From The Netflix Film",
    "Original Score to the Motion Picture",
    "Original Motion Picture Soundtrack",
    "Soundtrack from the Motion Picture",
    "Original Television Soundtrack",
    "Original Motion Picture Score",
    "Music From the Motion Picture",
    "Music From The Motion Picture",
    "Complete Motion Picture Score",
    "Music from the Motion Picture",
    "Original Videogame Soundtrack",
    "La Bande Originale du Film",
    "Music from the Miniseries",
    "Bande Originale du Film",
    "Die Original Filmmusik",
    "Original Soundtrack",
    "Complete Score",
    "Original Score",
  ];
  for (let keyword of keywords) {
    if (title.includes(keyword) === false) continue;
    return {
      title: title
        .replace(`(${keyword})`, "")
        .replace(`: ${keyword}`, "")
        .replace(`[${keyword}]`, "")
        .replace(`- ${keyword}`, "")
        .replace(`${keyword}`, ""),
      subtitle: keyword,
    };
  }
  return {
    title: title,
    subtitle: "",
  };
}

export function splitAlbumTitle(title) {
  let keywords = [
    "Bonus Tracks Edition",
    "Complete Edition",
    "Deluxe Edition",
    "Deluxe Version",
    "Tour Edition",
  ];
  for (let keyword of keywords) {
    if (title.includes(keyword) === false) continue;
    return {
      title: title
        .replace(`(${keyword})`, "")
        .replace(`: ${keyword}`, "")
        .replace(`[${keyword}]`, "")
        .replace(`- ${keyword}`, "")
        .replace(`${keyword}`, ""),
      subtitle: keyword,
    };
  }
  return {
    title: title,
    subtitle: "",
  };
}

// export function bytesToSize(bytes) {
//   let marker = 1024; // Change to 1000 if required
//   let decimal = 2; // Change as required
//   let kiloBytes = marker;
//   let megaBytes = marker * marker;
//   let gigaBytes = marker * marker * marker;

//   let lang = store.state.settings.lang;

//   if (bytes < kiloBytes) return bytes + (lang === "en" ? " Bytes" : "字节");
//   else if (bytes < megaBytes)
//     return (bytes / kiloBytes).toFixed(decimal) + " KB";
//   else if (bytes < gigaBytes)
//     return (bytes / megaBytes).toFixed(decimal) + " MB";
//   else return (bytes / gigaBytes).toFixed(decimal) + " GB";
// }

export function formatTrackTime(value) {
  if (!value) return "";
  let min = ~~((value / 60) % 60);
  let sec = (~~(value % 60)).toString().padStart(2, "0");
  return `${min}:${sec}`;
}
