import fs from 'node:fs';

fs.mkdirSync('dist', {recursive: true});

for (const file of fs.readdirSync('docs/assets')) {
	if (/^tweakpane.*\.js$/.test(file)) {
		fs.copyFileSync(`docs/assets/${file}`, `dist/${file}`);
	}
}

fs.copyFileSync('../../README.md', 'README.md');
