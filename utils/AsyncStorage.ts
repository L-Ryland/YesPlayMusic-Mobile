
import AsyncStorage from "@react-native-async-storage/async-storage";
class Storage {

  cache: { [key: string]: string } = {}
  constructor() {
    this.cache = this.cache;
    this.init();
  }

  async init()  {
    console.log("storage iniitiation");

    try {
      let keys = await AsyncStorage.getAllKeys();

      let items = await AsyncStorage.multiGet(keys).then();

      items.map((item) => {
        // console.log(item);

        let [key, value] = item;
        // console.log("key and value", key, value, item);
        if (key) {
          try {
            if (value && JSON.parse(value) instanceof Object) {
              value = JSON.parse(value);
            }
          }
          catch(error){
          }

          this.cache[key] = value ?? '';
        }
      })

    } catch (error) {
      console.error("Error occurs while getting items in async storage", error)
    }
  }

  getItem(key: string) {

    return this.cache[key]
  }

  setItem(key: string, value: string) {
    if (this.cache[key] === value) return
    this.cache[key] = value
    AsyncStorage.setItem(key, value).catch(
      error => console.error("Error occurs while puttig items in async storage", error)
    )
  }

  removeItem(key: string) {
    delete this.cache[key]
    AsyncStorage.removeItem(key).catch(
      error => console.error("Error occurs while removing items async storage", error)
    )
  }
}
export default new Storage();