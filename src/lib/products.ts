export interface Product {
  id: string;
  name: string;
  image_url: string;
  price: number;
  wa_number: string;
  created_at: string;
  label?: string | null;
}

export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildWaUrl(product: Product): string {
  const num = product.wa_number.replace(/\D/g, "");
  const msg = `Assalamualaikum min, saya mau beli ${product.name} ${formatIDR(product.price)}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}
