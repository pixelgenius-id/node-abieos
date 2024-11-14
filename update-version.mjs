import {promises} from "node:fs";
import {exec} from "node:child_process";

const oldPackageJson = await promises.readFile('package.json', 'utf8');
if (!oldPackageJson) {
    console.error('Failed to read package.json');
    process.exit(1);
}

const parsed = JSON.parse(oldPackageJson.toString());
const [version, hash] = parsed.version.split('-');
console.log(`Old version: ${version}`);
console.log(`Old hash: ${hash}`);

exec('git rev-parse --short HEAD', {
    cwd: './abieos',
}, (error, stdout) => {
    if (error) {
        console.error('Failed to get git hash');
        process.exit(1);
    }
    console.log(`New hash: ${stdout.trim()}`);
    const newVersion = `${version}-${stdout.trim()}`;
    console.log(`New version: ${newVersion}`);
    parsed.version = newVersion;
    const newPackageJson = JSON.stringify(parsed, null, 2);
    promises.writeFile('package.json', newPackageJson).catch((err) => {
        console.error('Failed to write package.json');
        process.exit(1);
    });
});
