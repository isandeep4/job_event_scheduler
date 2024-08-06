import express from 'express';
import bodyParser from 'body-parser';

import { createEventsRouter } from './events/router';
import { Redis } from './redis/Redis';

async function main() {
    const redis = await Redis.CreateAndConnect("redis://localhost:6379");

    const app = express();
    app.use(bodyParser.text({limit: '1mb', type: 'application/json'}));

    app.use('/events', await createEventsRouter(redis));

    const port = 4000;
    app.listen(port, () => {
        console.log('Web service started on port ' + port);
    });
}

main();
