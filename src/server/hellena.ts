'use server'

import { cacheLife, cacheTag } from "next/cache";
import { hellena } from "../lib/hellena"

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