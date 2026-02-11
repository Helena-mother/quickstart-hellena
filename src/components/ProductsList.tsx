'use client'

import Header from "@/src/components/layouts/Header";
import HeroBanner from "@/src/components/productsList/HeroBanner";
import FilterSidebar from "@/src/components/productsList/FilterSidebar";
import ProductGrid from "@/src/components/productsList/ProductGrid";
import { motion } from "framer-motion";

export default function ProductsList() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <Header />
      <main className="container mx-auto px-4 pb-12">
        <HeroBanner />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <FilterSidebar />
          <ProductGrid />
        </div>
      </main>
    </motion.div>
  );
}