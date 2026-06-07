/**
 * Remotion CLI config for the ShifaMind launch video.
 * The composition source lives in ./remotion (auto-detected entry:
 * remotion/index.ts) and is fully isolated from the Vite website build.
 */
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// 1080p, high quality H.264.
Config.setCodec('h264');
Config.setCrf(18);
