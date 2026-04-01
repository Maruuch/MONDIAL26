import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct, DesignLabel } from "@/types";

interface ProductCardProps {
  product: ShopifyProduct;
  designLabel?: DesignLabel;
}

export function ProductCard({ product, designLabel }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group bg-white rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
            👕
          </div>
        )}
        {designLabel && (
          <span className="absolute top-2 left-2 bg-brand text-white text-xs font-semibold px-2 py-0.5 rounded">
            {designLabel}
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-sm font-semibold text-gray-900 group-hover:text-brand line-clamp-2 mb-auto">
          {product.title}
        </h2>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-brand font-bold">{formattedPrice}</span>
          <span className="text-xs text-gray-400">Fan-made</span>
        </div>
      </div>
    </Link>
  );
}
