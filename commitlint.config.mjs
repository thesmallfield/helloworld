const aiTrailer =
    /^(co-authored-by:.*(claude|anthropic|openai|copilot|gemini|cursor)|claude-session:|.*generated with \[?claude)/im;

export default {
    extends: ['@commitlint/config-conventional'],
    plugins: [
        {
            rules: {
                'no-ai-trailers': ({ body, footer }) => {
                    const text = `${body ?? ''}\n${footer ?? ''}`;
                    return [
                        !aiTrailer.test(text),
                        'no-ai-trailers: remove AI co-author or session lines',
                    ];
                },
            },
        },
    ],
    rules: {
        'no-ai-trailers': [2, 'always'],
    },
};
