export interface StorageAdapter<T> {
  save(key: string, value: T): Promise<void>;
  load(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  listKeys(): Promise<string[]>;
}
