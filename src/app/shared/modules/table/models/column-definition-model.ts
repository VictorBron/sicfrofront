export interface ColumnDefinition {
  id: string;
  header: string;
  maxWidth?: string;
  minWidth?: string;
  order?: boolean;
  dataType: DataType;
}

export enum OrderType {
  ASC,
  DESC,
}

export enum DataType {
  DATE,
  NUMBER,
  STRING,
}
