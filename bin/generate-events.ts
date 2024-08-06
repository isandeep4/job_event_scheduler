import { randomUUID } from "crypto";
import axios from 'axios';

const eventNames = [
    'gameStarted',
    'levelStarted',
    'levelCompleted',
    'levelFailed'
];

const games = [
    'lilysgarden',
    'pennyandflo',
    'simonscat'
];

const platforms = [
    'IOS',
    'ANDROID'
];

const versions = [
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.3.0",
    "1.4.0",
    "1.4.1",
    "1.4.2"
];

const randomIPs = [
    '137.183.83.119',
    '108.58.228.213',
    '133.209.191.218',
    '43.73.202.35',
    '89.87.106.27',
    '77.23.76.214',
    '163.165.109.94',
    '160.74.60.87',
    '48.216.14.45',
    '221.132.176.49',
    '6.7.249.220',
    '2.96.22.31',
    '140.52.153.93',
    '72.226.21.81'
];

function sampleArray<T>(arr: Array<T>) : T {
    const res = arr[Math.floor(Math.random() * arr.length)];
    console.log(arr + " " + res);
    return res;
}

function generateUsers(count: number) {
    const users = new Array<any>();
    for(let i = 0; i < count; ++i) {
        users.push({
            installId: randomUUID(),
            platform: sampleArray(platforms),
            version: sampleArray(versions),
            clientIp: sampleArray(randomIPs),
            game: sampleArray(games)
        });
    }
    return users;
}

async function sendRandomEvent(user: any, sessionId: string) {
    const event = {
        eventName: sampleArray(eventNames),
        eventTimestamp: Math.floor(new Date().getTime() / 1000),
        installId: user.installId,
        sessionId,
        platform: user.platform,
        version: user.version,
        eventData: { someKey: "someValue", someOtherKey: 42 }
    };

    const options = {
        method: "POST",
        url: "http://localhost:4000/events/collect",
        headers: {
            "Content-Type": "application/json",
            "x-tactile-game-id": user.game,
            'x-forwarded-for': user.clientIp
        },
        data: event
    };
    console.log(options);
    await axios.request(options);
}

async function main(numberOfUsers: number) {
    const users = generateUsers(numberOfUsers);
    for(const user of users) {
        const sessionId = randomUUID();

        const numberOfEvents = Math.floor(Math.random() * 10);
        for(let i = 0; i < numberOfEvents; ++i) {
            await (sendRandomEvent(user, sessionId));
        }
    }
}

const NUMBER_OF_USERS = 10;
main(NUMBER_OF_USERS);
