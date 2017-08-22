export interface DaoService {
  execute(query: string): Promise<string>;
  select(query: string): Promise<string>;
}
