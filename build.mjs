import { cp, mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist/assets', { recursive: true });
for (const name of ['index.html', 'style.css', 'fonts.css', 'app.js', 'race.svg']) await copyFile(name, `dist/${name}`);
await cp('assets/fonts', 'dist/assets/fonts', { recursive: true });
await copyFile('palette.css', 'dist/palette.css');
await copyFile('node_modules/motion/dist/motion.js', 'dist/assets/motion.js');
console.log('Built Encore website in dist/');
