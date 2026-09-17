export type RepositoryId = string;

export interface Repository<TRecord, TCreate, TUpdate = Partial<TCreate>> {
  findById(id: RepositoryId): Promise<TRecord | null>;
  list(): Promise<readonly TRecord[]>;
  create(input: TCreate): Promise<TRecord>;
  update(id: RepositoryId, input: TUpdate): Promise<TRecord>;
}

export interface ReadOnlyRepository<TRecord> {
  findById(id: RepositoryId): Promise<TRecord | null>;
  list(): Promise<readonly TRecord[]>;
}

export interface AppendOnlyRepository<TEvent> {
  append(event: TEvent): Promise<void>;
}
