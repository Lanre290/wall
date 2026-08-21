import WallClient from "./WallClient";

export default async function WallPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <WallClient slug={resolvedParams.id} />;
}
