import { IBigQuery } from "./IBigQuery";
import { BigQuery as GCP_BigQuery } from "@google-cloud/bigquery";

export class BigQuery implements IBigQuery {
  private readonly bigQuery: GCP_BigQuery;

  constructor(projectId: string, credentialsKeyFilename: string) {
    this.bigQuery = new GCP_BigQuery({
      projectId,
      keyFilename: credentialsKeyFilename,
    });
  }
  async loadBatch(
    dataset: string,
    table: string,
    tempFilePath: string
  ): Promise<void> {
    await this.bigQuery
      .dataset(dataset)
      .table(table)
      .load(tempFilePath, {
        sourceFormat: "NEWLINE_DELIMITED_JSON",
        schemaUpdateOptions: ["ALLOW_FIELD_ADDITION"],
      });
  }
  async insertRows(dataset: string, table: string, rows: any[]): Promise<void> {
    await this.bigQuery.dataset(dataset).table(table).insert(rows);
  }
}
