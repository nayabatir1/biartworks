module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          // This needs to be mirrored in tsconfig.json
          '@types': './src/types/index.d.ts',
          '@entities': './src/entities',
          '@components': './src/components',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@api': './src/api',
          '@store': './src/store',
          '@socket': './src/socket',
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
  ],
};
