const runId = process.env.SF_RUN_ID ?? 'local';
const job = process.env.SF_JOB ?? 'cleanup';

function say(message) {
    process.stdout.write(`${new Date().toISOString()} ${message}\n`);
}

say(`${job} started, run ${runId}`);
if (process.env.SF_JOB_INPUT) {
    say(`input ${process.env.SF_JOB_INPUT}`);
}
say('nothing to clean up');
say(`${job} finished, run ${runId}`);
