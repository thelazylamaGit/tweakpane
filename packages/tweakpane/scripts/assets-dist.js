import Fs from 'fs';
import Path from 'path';

const distDir = Path.resolve('dist');
const assetsDir = Path.resolve('docs/assets');

Fs.mkdirSync(distDir, {recursive: true});
for (const entry of Fs.readdirSync(assetsDir)) {
	if (/^tweakpane.*\.js$/.test(entry)) {
		Fs.copyFileSync(Path.join(assetsDir, entry), Path.join(distDir, entry));
	}
}
Fs.copyFileSync(Path.resolve('../../README.md'), Path.resolve('README.md'));
