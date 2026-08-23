import { Metadata } from "next";
import WallClient from "./WallClient";
import { Wall } from "../../../lib/sequelize";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;
  
  let title = "Wall";
  let description = "A collaborative space for notes.";
  
  try {
    const wall = await Wall.findOne({ where: { slug } });
    if (wall) {
      title = `${wall.getDataValue('title')} | Wall`;
      description = wall.getDataValue('description') || `Explore ${wall.getDataValue('title')} on Wall.`;
    }
  } catch (error) {
    console.error("Error fetching wall for metadata:", error);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export default async function WallPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <WallClient slug={resolvedParams.id} />;
}
