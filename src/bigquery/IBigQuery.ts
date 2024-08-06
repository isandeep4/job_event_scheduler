export interface IBigQuery {
    insertRows(dataset: string, table: string, rows: any[]) : Promise<void>;
}
