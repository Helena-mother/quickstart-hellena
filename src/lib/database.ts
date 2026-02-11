import { IndexedORM } from "./wrisma";

export const db = new IndexedORM("appDB", {
  cart: { keyPath: "id" }
});
