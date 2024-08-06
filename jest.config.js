module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        '/build/',
        '/dist/',
        '/node_modules/'
    ],
    testRegex: [
        'spec\\.[jt]s$'
    ],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    }
};
