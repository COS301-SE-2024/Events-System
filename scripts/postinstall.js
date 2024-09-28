const { execSync } = require('child_process');
const os = require('os');

if (os.platform() === 'linux') {
  try {
    execSync('npm install @nx/nx-linux-x64-gnu', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to install @nx/nx-linux-x64-gnu:', error);
    process.exit(1);
  }
} else {
  console.log('Skipping @nx/nx-linux-x64-gnu installation on non-Linux platform');
}