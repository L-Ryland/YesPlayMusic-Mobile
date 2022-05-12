import Storage from "react-native-storage";
import { Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
class YAStorage {
  cache = {};
  constructor() {
    this.cache = this.cache;
    this.init();
  }

  async init() {
    console.log("storage iniitiation");
    try {
      let keys = await AsyncStorage.getAllKeys();

      let items = await AsyncStorage.multiGet(keys).then();

      items.map((item) => {
        // console.log(item);

        let [key, value]: any = item;
        if (key) {
          value?.startsWith("{");
          if (value?.startsWith("{") && value.endsWith("}")) {
            value = JSON.parse(value);
          }
          this.cache[key] = value ?? "";
        }
      });
    } catch (error) {
      console.error("Error occurs while getting items in async storage", error);
    }
    console.log("storage initiated");
  }

  getItem(key: string) {
    return this.cache[key];
  }

  setItem(key: string, value: string) {
    if (this.cache[key] === value) return;
    this.cache[key] = value;
    AsyncStorage.setItem(key, value).catch((error) =>
      console.error("Error occurs while puttig items in async storage", error)
    );
  }

  removeItem(key: string) {
    delete this.cache[key];
    AsyncStorage.removeItem(key).catch((error) =>
      console.error("Error occurs while removing items async storage", error)
    );
  }
}

export default new Storage({
  size: 1000,
  storageBackend: Platform.OS == "web" ? window.localStorage : AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {
    // we'll talk about the details later.
  },
});
