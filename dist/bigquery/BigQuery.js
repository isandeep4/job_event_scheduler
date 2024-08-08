"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigQuery = void 0;
const bigquery_1 = require("@google-cloud/bigquery");
class BigQuery {
    constructor(projectId, credentialsKeyFilename) {
        this.bigQuery = new bigquery_1.BigQuery({
            projectId,
            keyFilename: credentialsKeyFilename
        });
    }
    async insertRows(dataset, table, rows) {
        await this.bigQuery.dataset(dataset).table(table).insert(rows);
    }
}
exports.BigQuery = BigQuery;
//# sourceMappingURL=BigQuery.js.map