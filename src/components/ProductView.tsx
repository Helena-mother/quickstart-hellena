'use client'

import { getProductById } from "@/src/server/hellena";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Header from "./layouts/Header";
import { Suspense } from "react";
import ProductViewRender from "./ProductView/ProductViewRender";

export default function ProductView({ id }: { id: string }) {

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => getProductById(id),
    enabled: !!id
  });

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <Header />
      <Suspense>
        <main className="container mx-auto px-4 pb-12">
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            <div className="flex gap-4 flex-wrap">
              {isLoading && <h1>LOADING</h1>}
              {product && (
                <ProductViewRender product={product} />
              )}
            </div>
          </div>
        </main>
      </Suspense>
    </motion.div>
  );
}
