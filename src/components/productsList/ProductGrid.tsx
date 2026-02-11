import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../server/hellena";

const ProductGrid = () => {

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex-1"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Home / Wink Collection</p>
          <h1 className="text-2xl font-semibold mt-1">Wink Collection</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products ? products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        )) : (
          <div>
            <h1>Nenhum Producto disponivel</h1>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductGrid;
