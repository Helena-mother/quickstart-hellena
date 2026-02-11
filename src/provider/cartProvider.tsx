"use client"
import React, { useEffect, useState } from "react";
import { CartContext, CartItem } from "../context/cartContext";
import { db } from "../lib/database";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Inicializa DB e carrega carrinho
  useEffect(() => {
    async function init() {
      await db.init();
      const items = await db.findMany<CartItem>("cart");
      setCart(items);
      setReady(true);
    }

    init();
  }, []);

  // Incrementa quantidade de um item
  async function add(item: Omit<CartItem, "qtd">) {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);

      if (exists) {
        const updated = prev.map((p) =>
          p.id === item.id ? { ...p, qtd: p.qtd + 1 } : p
        );

        db.update<CartItem>("cart", {
          where: { id: item.id },
          data: { qtd: exists.qtd + 1 },
        });

        return updated;
      }

      const newItem: CartItem = { ...item, qtd: 1 };
      db.insert("cart", newItem);
      return [...prev, newItem];
    });
  }

  // Decrementa quantidade
  async function decrement(id: string) {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === id);
      if (!exists) return prev;

      if (exists.qtd > 1) {
        const updated = prev.map((p) =>
          p.id === id ? { ...p, qtd: p.qtd - 1 } : p
        );

        db.update<CartItem>("cart", {
          where: { id },
          data: { qtd: exists.qtd - 1 },
        });

        return updated;
      } else {
        db.delete<CartItem>("cart", { where: { id } });
        return prev.filter((p) => p.id !== id);
      }
    });
  }

  // Incrementa quantidade
  async function increment(id: string) {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === id);
      if (!exists) return prev;

      const updated = prev.map((p) =>
        p.id === id ? { ...p, qtd: p.qtd + 1 } : p
      );

      db.update<CartItem>("cart", {
        where: { id },
        data: { qtd: exists.qtd + 1 },
      });

      return updated;
    });
  }

  // Remove item
  async function remove(id: string) {
    setCart((prev) => {
      db.delete<CartItem>("cart", { where: { id } });
      return prev.filter((p) => p.id !== id);
    });
  }

  // Atualiza quantidade
  async function update(id: string, qtd: number) {
    setCart((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, qtd } : p
      );

      db.update<CartItem>("cart", { where: { id }, data: { qtd } });
      return updated;
    });
  }

  // Limpa carrinho
  async function clear() {
    setCart([]);
    await db.clear("cart");
  }

  const count = cart.reduce((acc, item) => acc + item.qtd, 0);
  const total = cart.reduce((acc, item) => acc + item.price * item.qtd, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        add,
        increment,
        decrement,
        remove,
        update,
        clear,
        count,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
