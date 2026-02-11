import ProductView from "@/src/components/ProductView";
import { Suspense } from "react";

interface ProductProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductWrapper({ params, searchParams }: ProductProps) {
  return (
    <Suspense fallback={<span>loading</span>}>
      <Product params={params} searchParams={searchParams} />
    </Suspense>
  );
}

export async function Product({ params }: ProductProps) {
  const productId = (await params).id;

  return <ProductView id={productId}/>;
}

