import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/types";

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  return (
    <Link
      href={`/product/${product.handle}`}
      className="product-card group rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "#141F35",
        border: "1px solid rgba(30,45,74,0.8)",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden" style={{ background: "#0A0F1E" }}>
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">👕</div>
        )}
      </div>

      {/* Infos */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h2 className="text-sm font-semibold text-wc-text line-clamp-2 flex-1 leading-snug">
          {product.title}
        </h2>
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: "1px solid rgba(30,45,74,0.5)" }}
        >
          <span
            className="font-black text-base"
            style={{ fontFamily: "var(--font-barlow)", color: "#E8C547" }}
          >
            {formattedPrice}
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-md"
            style={{
              background: "rgba(232,197,71,0.08)",
              color: "#E8C547",
              border: "1px solid rgba(232,197,71,0.15)",
            }}
          >
            Fan-made
          </span>
        </div>
      </div>

      <style>{`
        .product-card:hover {
          border-color: rgba(232,197,71,0.35) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transform: translateY(-3px);
        }
      `}</style>
    </Link>
  );
}
