import { useState } from "react";
import ProductImageCarousel from "@/src/components/ProductView/ProductImageCarousel";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Box } from "lucide-react";
import { Product } from "@/src/types/product";
import { formatPrice } from "@/src/util/format";
import { useCart } from "@/src/hooks/useCart";
import { CartItem } from "@/src/context/cartContext";

export default function ProductViewRender({ product }: { product: Product }) {
  const [show3D, setShow3D] = useState(false);
  const { add } = useCart();

  const handlerIncrement = async (data: CartItem) => {
    add({
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        {/* Toggle demo mode */}
        <div className="flex justify-center mb-8">
          <Button
            variant={show3D ? "default" : "outline"}
            className="gap-2"
            onClick={() => setShow3D(!show3D)}
          >
            <Box className="w-4 h-4" />
            {show3D ? "Modo 3D ativo" : "Ativar modo 3D"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images / 3D */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductImageCarousel
              mainImage={product.image}
              sideImages={product.image_sides}
              productName={product.name}
              model3dUrl={show3D ? product.model_3d_url : undefined}
              model3dPreview={show3D ? product.model_3d_preview : undefined}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="flex flex-col justify-center space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Coleção Premium
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              {product.description}
            </p>

            <div className="pt-4">
              {product.Price.reverse().map((price, index) => (
                <div key={price.id} className={`${index != 0 ? "underline" : "text-xl"}`}>
                  {price.quantity > 1 ? (
                    <p>
                      Buy {price.quantity} for {formatPrice(price.price)} each
                    </p>
                  ) : (
                    <p>{formatPrice(price.price)}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-sm tracking-wide hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  handlerIncrement({
                    id: product.id,
                    name: product.name,
                    image: product.image!,
                    price: product.Price[0].price,
                    qtd: 1
                  })
                }}
              >
                Adicionar ao carrinho
              </motion.button>
              <motion.button
                className="px-8 py-4 border border-border rounded-full font-medium text-sm tracking-wide hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Comprar agora
              </motion.button>
            </div>

            <div className="pt-8 border-t border-border mt-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Frete grátis", value: "Brasil" },
                  { label: "Garantia", value: "5 anos" },
                  { label: "Entrega", value: "7-14 dias" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-sm font-medium">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
