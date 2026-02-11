'use server'

import { cacheLife, cacheTag } from "next/cache";
import { hellena } from "../lib/hellena"
import { CartItem } from "../context/cartContext";

export async function getProducts() {
    'use cache'
    cacheTag('products')

    const products = await hellena.product.findMany();

    if (!products) {
        throw new Error("No products found");
    }

    return products;
}

export async function getProductById(productID: string) {
    'use cache: private'
    cacheTag(`product-${productID}`)
    cacheLife({ stale: 60 })


    const product = await hellena.product.findOne({
        id: productID
    })

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
}

export async function newOrder({ form, cart }: { form: any, cart: CartItem[] }) {
    const order = hellena.order.new({
        info: {
            customerName: form.customerName,
            customerEmail: form.customerEmail,
            address: form.address,
            lat: Number(form.lat),
            lng: Number(form.lng),
        },
        items: cart.map(item => ({
            productId: item.id,
            quantity: item.qtd,
            price: item.price,
            image: item.image,
            name: item.name
        }))
    });

    return order;
}