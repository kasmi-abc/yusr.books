import type { Metadata } from "next";
import { Suspense } from "react";
import { BOOKS } from "@/lib/data";
import Product from "./product";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const book = BOOKS.find((b) => b.slug === slug);
  if (!book) return { title: "Yusr Books" };
  return {
    title: `${book.title} — مكتبة يُسر للكتب الشرعية`,
    description: book.desc.ar.slice(0, 160),
    openGraph: {
      title: `${book.title} — مكتبة يُسر`,
      description: book.desc.ar.slice(0, 160),
    },
  };
}

export default async function BookPage({ params }: Params) {
  const { slug } = await params;
  return (
    <Suspense>
      <Product slug={slug} />
    </Suspense>
  );
}
