'use client'

import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/src/util/format";
import { Product } from "@/src/types/product";
import { cn } from "@/src/lib/utils";


const ProductCard = ({ product, index }: { product: Product, index: number }) => {
  const [liked, setLiked] = useState<boolean>(false);

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="group"
      >
        <div className={cn("relative mb-4 aspect-[3/4] overflow-hidden rounded-xl bg-muted")}>
          <motion.img
            src={product.image || product.image || "https://www.triggerdrums.com/assets/img/product/default.jpg"}
            alt={product.name}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-foreground/5"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-foreground">{product.name}</h3>

          {product.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <span>
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
            </span>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setLiked(!liked)}
                className={`rounded-full p-2 transition-colors ${liked
                  ? "text-destructive"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Heart
                  className={`h-5 w-5 ${liked ? "fill-current" : ""}`}
                />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ShoppingBag className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
