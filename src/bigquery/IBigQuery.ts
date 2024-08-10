export interface IBigQuery {
  insertRows(dataset: string, table: string, rows: any[]): Promise<void>;
  loadBatch(
    dataset: string,
    table: string,
    tempFilePath: string
  ): Promise<void>;
}
