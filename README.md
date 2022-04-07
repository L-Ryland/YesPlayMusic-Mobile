# Yesplaymusic-Mobile

This is a React Naitve project based on [YesPlayMusic](https://github.com/qier222/YesPlayMusic)

## Description

This project is natively implanted with [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) with [nodejs-mobile](https://github.com/nodejs-mobile) project. It serves `port:3000` as its server side and listens for request from Netease Music server. Android and iOS client is both supported, but due to environment restriction I have only built an Android version as for now.

## Screen Shot
![](https://github.com/L-Ryland/YesPlayMusic-Mobile/blob/master/picture/Explore.jpg)
![](https://github.com/L-Ryland/YesPlayMusic-Mobile/blob/master/picture/Explore.jpg)
## Getting Started

### For Use

- You can choose a version you would like in the release page.

### Dependencies

- This project is based on expo. As it needs some custom native modules you need to serve expo as development mode with `expo start --dev-client`
- In order to deploy Android enviroment, you need to open project in Android studio to run the build.


### Installing

1. Clone this Object

   ```shell
   git clone https://github.com/L-Ryland/YesPlayMusic-Mobile.git
   cd YesPlayMusic-Mobile
   ```

2. Install `expo-cli` if you haven't

   ```shell
   yarn global add expo-cli # you can also use npm and other methods lol.
   ```

3. Install dependency modules:

   ```shell
   yarn install
   ```

### Executing project

1. Deploy an Android device as a dev client (Android Emulators work also)
2. Open project folder in Android Studio and click build, to install a client on device.
3. Start dev server

   ```shell
   expo start --dev-client
   ```

4. Press "a" to run on Android. If a dev client is successfully installed, an action to pull up client is going to execute.

### Building Project

- `eas-cli` is not well supported cuz I managed to build one successfully but the app still crashes. If you need to build a version yourself, please use Android Studio build a release version. 

## Help

If you encounter problems, you can directly submit issues, this project is also welcomed for contributions.

## Authors

Contributors names and contact info

- [L-Ryland](https://github.com/L-Ryland)
- [kuliantnt](https://github.com/kuliantnt)

## Version History

- 1.0
  - Initial Release
  - Only Android version is currently supported.
  - Integrated with internal NeteaseCloudMusicApi, database and redux.
  - You can play/stop/skipNext/skipPrevious using TrackPlayer to play a specified playlist now. 
  - Lyrics functions and login options is still working. 

## License

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) License - see the LICENSE file for details

## Acknowledgments

Inspiration, code snippets, etc.

- [YesPlayMusic](https://github.com/qier222/YesPlayMusic)
- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)