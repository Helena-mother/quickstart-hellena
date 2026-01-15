'use client'

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../server/hellena";
import Image from "next/image";

export default function Home() {

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => getProducts()
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {
        products?.map((product) => (
          <div key={product.id} className="border">
            <div>
              <Image
                src={product.image || "/default-image.png"}
                width={200}
                height={200}
                alt={product.name}
              />
            </div>
            <div>
              <h2>{product.name}</h2>
              <p>{product.category}</p>
              {product.Price.map((price) => (
                <div key={price.id}>
                  {price.quantity > 1 ? (
                    <p>
                      Buy {price.quantity} for ${(price.price).toFixed(2)} each
                    </p>
                  ) : (
                    <p>Price: ${(price.price).toFixed(2)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  );
}