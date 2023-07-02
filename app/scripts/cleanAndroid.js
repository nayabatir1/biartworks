/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const { spawn } = require('child_process');
const chalk = require('chalk');
/**
 * Check OS platform
 */
const os = process.platform;

console.log('Platform:', chalk.bgBlueBright.black(` ${os} `));

let clean;

if (os === 'win32') {
  clean = spawn('gradlew.bat', ['clean'], {
    cwd: 'android/',
  });
} else {
  clean = spawn('./gradlew', ['clean'], {
    cwd: 'android/',
  });
}

clean.stdout.on('data', data => {
  process.stdout.write(chalk.green(String(data)));
});

clean.stderr.on('data', data => {
  process.stdout.write(chalk.redBright(`!> ${data}`));
});

clean.on('close', code => {
  process.stdout.write(chalk.yellowBright(`Gradle android cleaned, with code: ${code}`));
});
