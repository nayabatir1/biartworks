/* eslint-disable no-console */
const { spawn, exec } = require('child_process');
// eslint-disable-next-line import/no-extraneous-dependencies
const chalk = require('chalk');

/**
 * Check OS platform
 */
const os = process.platform;

console.log('Platform:', chalk.bgBlueBright.black(` ${os} `));

let build;

if (os === 'win32') {
  build = spawn('gradlew.bat', ['assembleRelease'], {
    cwd: 'android/',
  });
} else {
  build = spawn('./gradlew', ['assembleRelease'], {
    cwd: 'android/',
  });
}

build.stdout.on('data', data => {
  process.stdout.write(chalk.green(String(data)));
});

build.stderr.on('data', data => {
  process.stdout.write(chalk.redBright(data));
});

build.on('close', code => {
  process.stdout.write(chalk.yellowBright(`Gradle android build with code: ${code}`));
  if (code === 0) {
    if (os === 'win32') {
      exec('explorer ./android/app/build/outputs/apk/release');
    } else if (os === 'darwin') {
      exec('open ./android/app/build/outputs/apk/release');
    } else {
      exec('xdg-open ./android/app/build/outputs/apk/release');
    }
  }
});
