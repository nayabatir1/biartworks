/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const { spawn, exec } = require('child_process');
const chalk = require('chalk');
const path = require('path');

/**
 * Check OS platform
 */
const os = process.platform;

console.log('Platform:', chalk.bgBlueBright.black(` ${os} `));

let build;

if (os === 'win32') {
  build = spawn('gradlew.bat', ['bundleRelease'], {
    cwd: 'android/',
  });
} else {
  build = spawn('./gradlew', ['bundleRelease'], {
    cwd: 'android/',
  });
}

build.stdout.on('data', data => {
  process.stdout.write(chalk.greenBright(String(data)));
});

build.stderr.on('data', data => {
  process.stdout.write(chalk.redBright(data));
});

build.on('close', code => {
  process.stdout.write(chalk.yellowBright(`Gradle android build with code: ${code}`));

  if (os === 'win32') {
    exec(
      `explorer ${path.join(__dirname, '..', 'android/app/build/outputs/bundle/release')}`,
      {},
      (error, stdout, _stderr) => {
        if (error) {
          console.log(chalk.redBright(error));
        }

        console.log(stdout);
      },
    );
  } else if (os === 'darwin') {
    exec(
      `open ${path.join(__dirname, '..', 'android/app/build/outputs/bundle/release')}`,
      {},
      (error, stdout, _stderr) => {
        if (error) {
          console.log(chalk.redBright(error));
        }

        console.log(stdout);
      },
    );
  } else {
    exec(
      `xdg-open ${path.join(__dirname, '..', 'android/app/build/outputs/bundle/release')}`,
      {},
      (error, stdout, _stderr) => {
        if (error) {
          console.log(chalk.redBright(error));
        }

        console.log(stdout);
      },
    );
  }

  process.exit(0);
});
