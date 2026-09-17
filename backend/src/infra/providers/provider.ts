export interface ProviderHealth {
  readonly available: boolean;
  readonly provider: string;
}

export interface ProviderAdapter<TRequest, TResult> {
  readonly name: string;
  execute(request: TRequest): Promise<TResult>;
}
