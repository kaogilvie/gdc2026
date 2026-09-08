import { notFound } from "next/navigation";
import { SlideDeck } from "@/components/SlideDeck";
import { getPresentation, presentations } from "@/lib/config";

type PresentationPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return presentations.map((presentation) => ({
    slug: presentation.slug,
  }));
}

export default async function PresentationPage({
  params,
}: PresentationPageProps) {
  const { slug } = await params;
  const presentation = getPresentation(slug);

  if (!presentation) {
    notFound();
  }

  return (
    <div className="flex-1 px-4 py-10">
      <SlideDeck presentation={presentation} />
    </div>
  );
}
