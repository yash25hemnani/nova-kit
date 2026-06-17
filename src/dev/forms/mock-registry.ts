
const mockProductForm =
  (): Record<string,
       any> => ({
    company: "",
    sku: `SKU-${Math.floor(Math.random() * 1000)}`,
    name: "Demo Product",
    image_url: "https://picsum.photos/300",
    product_value: "12.50",
    product_price: "29.99",
    weight: "0.5",
    length: "20",
    width: "15",
    height: "10",
    status: "active",
    barcode: String(Date.now()),
    is_dg_item: false,
  });

const registry: Record<string, () => Record<string, any>> = {
  "create-edit-product-form": mockProductForm,
} 

export const fetchMockFormValues = (
  id: string,
) => {
  const generator = registry[id];

  if (!generator) {
    console.warn(
      `No mock form values registered for "${id}"`,
    );

    return null;
  }

  return generator();
};