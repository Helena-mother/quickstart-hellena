import { Suspense } from "react";
import ProductsList from "../components/ProductsList";

export default function Home() {
  return (
    <Suspense fallback={<span>loading</span>}>
      <ProductsList />
    </Suspense>
  );
}