"use client"
import { createContext } from "react";

export interface CartItem {
  id: string;
  name: string;
  image?: string;
  price: number;
  qtd: number;
}

interface CartContextType {
  cart: CartItem[];
  add: (item: Omit<CartItem, "qtd">) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  update: (id: string, qtd: number) => void;
  clear: () => void;
  count: number;
  total: number;
}

export const CartContext = createContext<CartContextType | null>(null);
