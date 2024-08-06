import dotenv from "dotenv";
import { BigQuery, Dataset } from '@google-cloud/bigquery';

async function getOrCreateDataset(bigQuery: BigQuery, namespace: string) : Promise<Dataset> {
    const [datasets] = await bigQuery.getDatasets();
    const datasetIds = datasets.map(info => { return info.id; });

    const datasetId = "events_" + namespace;
    if(!datasetIds.includes(datasetId)) {
        const [dataset] = await bigQuery.createDataset(datasetId);
        return dataset;
    }

    return bigQuery.dataset(datasetId);
}

async function ensureRole(dataset: Dataset, email: string) : Promise<void> {
    const newRole = {
        userByEmail: email,
        entity_type: 'userByEmail',
        role: "OWNER"
    };

    const [metadata] = await dataset.getMetadata();
    metadata.access.push(newRole);
    await dataset.setMetadata(metadata);
}

async function ensureTables(dataset: Dataset) {
    const [tables] = await dataset.getTables();
    const tableIds = tables.map(info => { return info.id; });

    const schema = [
        {name: 'eventName', type: 'STRING'},
        {name: 'eventTimestamp', type: 'TIMESTAMP'},
        {name: 'installId', type: 'STRING'},
        {name: 'sessionId', type: 'STRING'},
        {name: 'platform', type: 'STRING'},
        {name: 'version', type: 'STRING'},
        {name: 'countryCode', type: 'STRING'},
        {name: 'eventData', type: 'JSON'}
    ];

    const games = ['lilysgarden', 'pennyandflo', 'simonscat'];
    for(const game of games) {
        if(tableIds.includes(game)) {
            continue;
        }

        try {
            await dataset.createTable(game, { schema });
        }
        catch(e) {
            console.log(JSON.stringify(e, null, 4));
        }
    }
}

async function main() {
    dotenv.config();

    const namespace = process.env.BIG_QUERY_EVENTS_NAMESPACE as string;
    const email = process.env.BIG_QUERY_EMAIL as string;

    if(!namespace || !email || namespace === 'some_unique_string' || email === 'someone@gmail.com') {
        throw new Error("Please specify a valid namespace and email in .env");
    }

    const bigQuery = new BigQuery({
        projectId: "tactile-codetest",
        keyFilename: "./auth/tactile-codetest.json"
    });

    const dataset = await getOrCreateDataset(bigQuery, namespace);
    await ensureRole(dataset, email);
    await ensureTables(dataset);
}

main();
