"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button, Input, Spinner } from "@/components/ui";
import { ProductImage } from "@/components/shared/product-image";
import { QUERY_KEYS } from "@/lib/constants";
import { productsService } from "@/services";
import type { Product } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

type ProductFormProps = {
  mode: "create" | "edit";
  product?: Product;
};

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);

    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const parsedPrice = Number(price);
      const parsedStock = Number(stock);

      if (mode === "create") {
        if (!imageFile) {
          setError("Please select a product image.");
          setLoading(false);
          return;
        }
        const created = await productsService.createWithImage({
          title,
          price: parsedPrice,
          stock: parsedStock,
          image: imageFile,
        });
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
        router.push(`/products/${created.id}`);
        return;
      }

      if (!product) return;

      if (!imageFile) {
        setError("Select a new image to update this product.");
        setLoading(false);
        return;
      }

      await productsService.updateImage(product.id, imageFile);

      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.product(product.id),
      });
      router.push(`/products/${product.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const displayImageUrl = previewUrl ?? product?.imageUrl ?? null;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <ProductImage
          title={title || "Product"}
          imageUrl={displayImageUrl}
          className="aspect-[16/9] w-full"
          sizes="(max-width: 768px) 100vw, 672px"
        />
        <div className="border-t border-slate-100 p-4">
          <label className="block text-sm font-medium text-slate-700">
            Product image{" "}
            {mode === "create" ? "(required)" : "(optional — replaces current)"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {previewUrl ? (
            <p className="mt-2 text-xs text-emerald-600">
              Preview ready — save to upload
            </p>
          ) : null}
        </div>
      </div>

      <Input
        label="Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={mode === "edit"}
      />
      <Input
        label="Price (USD)"
        name="price"
        type="number"
        min="0.01"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        disabled={mode === "edit"}
      />
      <Input
        label="Stock"
        name="stock"
        type="number"
        min="0"
        step="1"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
        disabled={mode === "edit"}
      />
      {mode === "edit" ? (
        <p className="text-sm text-slate-500">
          Title, price, and stock cannot be changed here. Upload a new image
          below.
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="h-4 w-4 border-white border-t-transparent" />
              Saving…
            </span>
          ) : mode === "create" ? (
            "Create product"
          ) : (
            "Update product"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
