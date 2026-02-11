import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, Box } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/components/ui/dialog";

import { lazy, Suspense } from "react";
const Model3DViewer = lazy(() => import("./Model3DViewer"));

interface ProductImageCarouselProps {
  mainImage: string | null;
  sideImages?: string[] | null;
  productName: string | null;
  isLoading?: boolean;
  model3dUrl?: string | null;
  model3dPreview?: string | null;
}

export default function ProductImageCarousel({
  mainImage,
  sideImages = [],
  productName,
  isLoading = false,
  model3dUrl,
  model3dPreview,
}: ProductImageCarouselProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModel, setShowModel] = useState(!!model3dUrl);

  const has3DModel = !!model3dUrl;
  const allImages = [mainImage, ...sideImages!];

  // Use 3D preview as first thumbnail if available
  const thumbnails = has3DModel && model3dPreview
    ? [model3dPreview, ...allImages]
    : allImages;

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="flex gap-3 justify-center">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-20 h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    if (has3DModel && model3dPreview) {
      if (index === 0) {
        setShowModel(true);
      } else {
        setShowModel(false);
        setSelectedImage(index - 1);
      }
    } else {
      setSelectedImage(index);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main View - 3D or Image */}
      <AnimatePresence mode="wait">
        {showModel && has3DModel ? (
          <motion.div
            key="3d-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense
              fallback={
                <div className="aspect-square w-full rounded-2xl bg-muted flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Box className="w-8 h-8 text-muted-foreground animate-pulse" />
                    <span className="text-sm text-muted-foreground">Carregando modelo 3D...</span>
                  </div>
                </div>
              }
            >
              <Model3DViewer modelUrl={model3dUrl} />
            </Suspense>
          </motion.div>
        ) : (
          <Dialog key="image-viewer">
            <DialogTrigger asChild>
              <motion.div
                className="relative aspect-square overflow-hidden rounded-2xl bg-card cursor-zoom-in group shadow-soft"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={allImages[selectedImage] || "https://www.triggerdrums.com/assets/img/product/default.jpg"}
                    alt={productName || "product"}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-10 h-10 text-background/80" />
                </div>

                {/* Navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedImage((prev) =>
                          prev === 0 ? allImages.length - 1 : prev - 1
                        );
                      }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedImage((prev) =>
                          prev === allImages.length - 1 ? 0 : prev + 1
                        );
                      }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
              <img
                src={allImages[selectedImage] || ""}
                alt={productName || "product"}
                className="w-full h-auto rounded-2xl"
              />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Thumbnails */}
      {thumbnails.length > 1 && (
        <Carousel className="w-full max-w-sm mx-auto">
          <CarouselContent className="-ml-2">
            {thumbnails.map((image, index) => {
              const is3DThumbnail = has3DModel && model3dPreview && index === 0;
              const isActive = is3DThumbnail
                ? showModel
                : !showModel && selectedImage === (has3DModel && model3dPreview ? index - 1 : index);

              return (
                <CarouselItem key={index} className="basis-1/4 pl-2">
                  <motion.button
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${isActive
                        ? "border-accent ring-2 ring-accent/20"
                        : "border-transparent hover:border-muted-foreground/20"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image || ""}
                      alt={`${productName} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {is3DThumbnail && (
                      <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                        <Box className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                  </motion.button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      )}

      {/* Toggle 3D/Image button if 3D model exists */}
      {has3DModel && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            onClick={() => setShowModel(!showModel)}
          >
            {showModel ? (
              <>
                <ZoomIn className="w-4 h-4" />
                Ver fotos
              </>
            ) : (
              <>
                <Box className="w-4 h-4" />
                Ver em 3D
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
