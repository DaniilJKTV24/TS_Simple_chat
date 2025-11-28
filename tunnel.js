require('dotenv').config();
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Read env variables
const port = process.env.PORT || 3000;
const authtoken = process.env.NGROK_AUTHTOKEN;

if (!authtoken) {
  console.error('Error: NGROK_AUTHTOKEN is not set in .env');
  process.exit(1);
}

// Determine ngrok executable path
let ngrokCmd = 'ngrok'; // fallback to global if exists

// Check local node_modules/.bin
const localNgrok = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'ngrok.cmd' : 'ngrok');
if (fs.existsSync(localNgrok)) {
  ngrokCmd = localNgrok;
}

// Spawn ngrok
const result = spawnSync(ngrokCmd, ['http', port, '--authtoken', authtoken], { stdio: 'inherit', shell: true });

if (result.error) {
  console.error('Failed to start ngrok:', result.error);
  process.exit(1);
}
