import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setEntryPoint('./src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
// استخدم متصفحاً محلياً إن توفر (بيئات بلا إنترنت)، وإلا يُنزّل Remotion متصفحه
const LOCAL_SHELL =
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = process.env.REMOTION_BROWSER ?? (existsSync(LOCAL_SHELL) ? LOCAL_SHELL : null);
if (browser) {
  Config.setBrowserExecutable(browser);
}
