type Operator<T> = {
  equals?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
};

type Where<T> = {
  [K in keyof T]?: T[K] | Operator<T[K]>;
};

export class IndexedORM {
  private db: IDBDatabase | null = null;

  constructor(
    private dbName: string,
    private schema: Record<string, { keyPath: string; autoIncrement?: boolean }>
  ) { }

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        Object.entries(this.schema).forEach(([name, config]) => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, {
              keyPath: config.keyPath,
              autoIncrement: config.autoIncrement ?? false,
            });
          }
        });
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  private getStore(name: string, mode: IDBTransactionMode) {
    if (!this.db) throw new Error("Database not initialized");
    return this.db.transaction(name, mode).objectStore(name);
  }

  private matchWhere<T>(item: T, where?: Where<T>): boolean {
    if (!where) return true;

    return Object.entries(where).every(([key, condition]) => {
      const value = (item as any)[key];

      if (typeof condition !== "object" || condition === null) {
        return value === condition;
      }

      if ((condition as any).equals !== undefined) return value === (condition as any).equals;
      if ((condition as any).gt !== undefined) return value > (condition as any).gt;
      if ((condition as any).gte !== undefined) return value >= (condition as any).gte;
      if ((condition as any).lt !== undefined) return value < (condition as any).lt;
      if ((condition as any).lte !== undefined) return value <= (condition as any).lte;
      if ((condition as any).contains !== undefined) return String(value).includes((condition as any).contains);
      if ((condition as any).startsWith !== undefined) return String(value).startsWith((condition as any).startsWith);
      if ((condition as any).endsWith !== undefined) return String(value).endsWith((condition as any).endsWith);

      return true;
    });
  }

  async findMany<T>(store: string, options?: { where?: Where<T> }): Promise<T[]> {
    const all = await this.getAll<T>(store);
    return all.filter(item => this.matchWhere(item, options?.where));
  }

  async findFirst<T>(store: string, options?: { where?: Where<T> }): Promise<T | null> {
    const results = await this.findMany<T>(store, options);
    return results[0] ?? null;
  }

  async insert<T>(store: string, data: T): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = this.getStore(store, "readwrite").add(data);
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  async update<T>(store: string, options: { where: Where<T>; data: Partial<T> }): Promise<void> {
    const items = await this.findMany<T>(store, { where: options.where });
    for (const item of items) {
      const updated = { ...item, ...options.data };
      await new Promise((resolve, reject) => {
        const request = this.getStore(store, "readwrite").put(updated);
        request.onsuccess = () => resolve(null);
        request.onerror = () => reject(request.error);
      });
    }
  }

  async delete<T>(store: string, options: { where: Where<T> }): Promise<void> {
    const items = await this.findMany<T>(store, { where: options.where });
    const keyPath = this.schema[store].keyPath;

    for (const item of items as any[]) {
      await new Promise((resolve, reject) => {
        const request = this.getStore(store, "readwrite").delete(item[keyPath]);
        request.onsuccess = () => resolve(null);
        request.onerror = () => reject(request.error);
      });
    }
  }

  async clear(store: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this.getStore(store, "readwrite").clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getAll<T>(store: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const request = this.getStore(store, "readonly").getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
