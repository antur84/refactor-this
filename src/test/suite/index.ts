import { glob } from 'glob';
import * as Mocha from 'mocha';
import * as path from 'path';

export function run(): Promise<void> {
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'bdd',
        timeout: 600000,
        color: true,
    });

    const testsRoot = path.resolve(__dirname, '..');

    return new Promise((c, e) => {
        async function findFiles() {
            try {
                const files = await glob('**/*.js', { cwd: './src' });
                console.log('Files found:', files);

                // Add files to the test suite
                files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

                try {
                    // Run the mocha test
                    mocha.run(failures => {
                        if (failures > 0) {
                            e(new Error(`${failures} tests failed.`));
                        } else {
                            c();
                        }
                    });
                } catch (err) {
                    e(err);
                }
            } catch (err) {
                console.error('Error:', err);
                return err(err);
            }
        }

        return findFiles();
    });
}
