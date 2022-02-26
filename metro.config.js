// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts, blacklistRE} = defaultConfig.resolver;
// module.exports = getDefaultConfig(__dirname);

const blacklist = require("metro-config/src/defaults/exclusionList");

// module.exports = getDefaultConfig(__dirname);
module.exports = {
  resolver: {
    blacklistRE: blacklist([
      /\/nodejs-assets\/.*/,
      /\/android\/.*/,
      /\/ios\/.*/,
    ]),
    assetExts: [...assetExts, 'db'],
    sourceExts,
  },
};
// module.exports = (async () => {
//   const {
//     resolver: { sourceExts, assetExts },
//   } = await getDefaultConfig(__dirname);
//   return {
//     transformer: {
//       getTransfromOptions: async () => ({
//         transform: {
//           experimentalImportSupport: false, 
//           inlineRequires: false
//         }
//       }),
//       babelTransfromerPath: require.resolve("react-native-svg-transformer")
//     }, 
//     resolver: {
//       assetExts: assetExts.filter(ext => ext !== "svg"),
//       sourceExts: [...sourceExts, "svg"],
//       blacklistRE: blacklist([
//         /\/nodejs-assets\/.*/,
//         /\/android\/.*/,
//         /\/ios\/.*/,
//       ]),
//     }
//   };
// })();
