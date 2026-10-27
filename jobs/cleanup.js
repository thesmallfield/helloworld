function platformEnv() {
    try {
        const { env = 'SMALLFIELD' } = JSON.parse(process.env.PLATFORM_NAMES ?? '{}');
        return env === 'SMALLFIELD' ? 'SF' : env;
    } catch {
        return 'SF';
    }
}

const p = platformEnv();
const runId = process.env[`${p}_RUN_ID`] ?? 'local';
const job = process.env[`${p}_JOB`] ?? 'cleanup';

function say(message) {
    process.stdout.write(`${new Date().toISOString()} ${message}\n`);
}

say(`${job} started, run ${runId}`);
if (process.env[`${p}_JOB_INPUT`]) {
    say(`input ${process.env[`${p}_JOB_INPUT`]}`);
}
say('nothing to clean up');
say(`${job} finished, run ${runId}`);
