'use client'

import { motion } from "framer-motion";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Button } from "@/src/components/ui/button";
import { Slider } from "@/src/components/ui/slider";
import { useState } from "react";

const brands = [
  { name: "Adidas", count: 120 },
  { name: "Zara", count: 30 },
  { name: "Dickies", count: 12 },
  { name: "Nike", count: 8 },
  { name: "Vans", count: 8 },
  { name: "Uniqlo", count: 6 },
];

const categories = [
  { name: "Sneakers", count: 125 },
  { name: "T-Shirts", count: 30 },
  { name: "Jackets", count: 24 },
  { name: "Broeken", count: 18 },
  { name: "Sweaters", count: 12 },
  { name: "Overhemden", count: 10 },
  { name: "Boots", count: 8 },
];

const FilterSidebar = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(["Adidas", "Nike"]);
  const [priceRange, setPriceRange] = useState([100, 3500]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="sticky top-0 w-full lg:w-64 shrink-0"
    >
      <div className="bg-card rounded-xl p-5 space-y-6">
        {/* Brand Filter */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Brand</h3>
            <button className="text-xs text-muted-foreground hover:text-foreground">
              Reset
            </button>
          </div>
          <div className="space-y-3">
            {brands.map((brand) => (
              <motion.label
                key={brand.name}
                whileHover={{ x: 2 }}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedBrands.includes(brand.name)}
                    onCheckedChange={() => toggleBrand(brand.name)}
                  />
                  <span className="text-sm">{brand.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{brand.count}</span>
              </motion.label>
            ))}
          </div>
          <Button variant="default" size="sm" className="w-full mt-4">
            Show more
          </Button>
        </div>

        {/* Category Filter */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Category</h3>
            <button className="text-xs text-muted-foreground hover:text-foreground">
              Reset
            </button>
          </div>
          <div className="space-y-3">
            {categories.map((category) => (
              <motion.label
                key={category.name}
                whileHover={{ x: 2 }}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-sm">{category.name}</span>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </motion.label>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground">
            Show more
          </Button>
        </div>

        {/* Price Filter */}
        <div>
          <h3 className="font-medium mb-4">Price</h3>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={10}
            max={5000}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10K</span>
            <span>100K</span>
            <span>1.500k</span>
            <span>5.000K</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default FilterSidebar;
