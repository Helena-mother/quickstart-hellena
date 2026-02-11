'use client'

import { useState } from "react";
import { useCart } from "@/src/hooks/useCart";
import { motion } from "framer-motion";
import Header from "@/src/components/layouts/Header";
import { Button } from "@/src/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { newOrder } from "@/src/server/hellena";

export default function Page() {
    const { cart, increment, decrement, remove, total, clear } = useCart();

    const [form, setForm] = useState({
        customerName: "",
        customerEmail: "",
        address: "",
        lat: "",
        lng: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const createOrderMutation = useMutation({
        mutationFn: async () => {
            return await newOrder({ form, cart })
        },
        onSuccess: (data) => {
            alert(`Pedido realizado com sucesso! ${data.id}`);
            console.log(data)
            clear();
        },
        onError: (error) => {
            console.error(error);
            alert("Erro ao finalizar pedido");
        }
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Carrinho vazio");
            return;
        }

        createOrderMutation.mutate();
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background"
        >
            <Header />

            <main className="container mx-auto px-4 pb-12">
                <div className="mt-8">

                    {/* Carrinho */}
                    <div className="mb-10">
                        <h2 className="text-xl font-bold mb-4">Carrinho</h2>
                        <h3>Total: {total}</h3>

                        {cart.map((item, index) => (
                            <div key={index} className="border p-4 rounded mb-3">
                                <h4>{item.name}</h4>
                                <p>
                                    {item.price} {item.qtd > 1 && `x${item.qtd}`}
                                </p>

                                {item.qtd > 1 ? (
                                    <Button onClick={() => decrement(item.id)}>
                                        -
                                    </Button>
                                ) : (
                                    <Button onClick={() => remove(item.id)}>
                                        delete
                                    </Button>
                                )}

                                <Button onClick={() => increment(item.id)}>
                                    +
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Formulário */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 max-w-md"
                    >
                        <input
                            type="text"
                            name="customerName"
                            placeholder="Nome"
                            value={form.customerName}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />

                        <input
                            type="email"
                            name="customerEmail"
                            placeholder="Email"
                            value={form.customerEmail}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            name="address"
                            placeholder="Endereço"
                            value={form.address}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />

                        <input
                            type="number"
                            step="any"
                            name="lat"
                            placeholder="Latitude"
                            value={form.lat}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />

                        <input
                            type="number"
                            step="any"
                            name="lng"
                            placeholder="Longitude"
                            value={form.lng}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />

                        <Button
                            type="submit"
                            disabled={createOrderMutation.isPending}
                        >
                            {createOrderMutation.isPending
                                ? "Finalizando..."
                                : "Finalizar Pedido"}
                        </Button>
                    </form>

                </div>
            </main>
        </motion.div>
    );
}
