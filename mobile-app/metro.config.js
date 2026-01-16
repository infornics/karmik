const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Configure SVG transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

// Apply NativeWind after SVG transformer config
const finalConfig = withNativeWind(config, { input: "./global.css" });

// Ensure SVG transformer config is preserved after NativeWind
if (!finalConfig.transformer.babelTransformerPath) {
  finalConfig.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
}

if (!finalConfig.resolver.sourceExts.includes("svg")) {
  finalConfig.resolver.sourceExts = [...finalConfig.resolver.sourceExts, "svg"];
}

if (finalConfig.resolver.assetExts.includes("svg")) {
  finalConfig.resolver.assetExts = finalConfig.resolver.assetExts.filter((ext) => ext !== "svg");
}

module.exports = finalConfig;