export interface Price {
    id: string;
    quantity: number;
    price: number;
}

export interface Product {
    id: string;
    barcode: string;
    name: string;
    category: string | null;
    image: string | null;
    model_3d_preview: string | null;
    model_3d_url: string | null;
    description: string | null;
    image_sides: string[] | null;
    color: string[] | null;
    brand: string | null;
    material: string[] | null;
    size: string[] | null;
    tags: string[] | null;
    Price: Price[];
    unit: string;
    quantity: number;
}