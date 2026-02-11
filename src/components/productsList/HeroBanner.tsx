import { motion } from "framer-motion";

const HeroBanner = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-hero rounded-2xl bg-muted my-6"
    >
      <div className="flex flex-col md:flex-row items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full md:w-1/2"
        >
          <motion.img
            src={"/assets/hero-banner.jpg"}
            alt="Collection Banner"
            className="w-full h-64 md:h-80 object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full md:w-1/2 p-8 md:p-12 h-full"
        >
          <span className="text-sm text-muted-foreground mb-2 block">• Collections</span>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 leading-tight">
            Explore The Various Collection of Wink Collection
          </h2>
          <p className="text-muted-foreground text-sm">
            Don't miss out on shopping collection from us! you'll not be let down.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroBanner;
