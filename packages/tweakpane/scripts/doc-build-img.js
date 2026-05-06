import Fs from 'fs';
import Path from 'path';

const srcDir = Path.resolve('src/doc/img');
const destDir = Path.resolve('docs/assets');

Fs.mkdirSync(destDir, {recursive: true});
for (const entry of Fs.readdirSync(srcDir)) {
	Fs.cpSync(Path.join(srcDir, entry), Path.join(destDir, entry), {
		recursive: true,
	});
}
