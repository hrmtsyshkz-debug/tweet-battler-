import type { Metadata } from "next";
import { decodeChallenge } from "@/lib/challenge";
import { TsubuyakiBattler } from "@/components/TsubuyakiBattler";

export async function generateMetadata({ params }: { params: Promise<{ data: string }> }): Promise<Metadata> {
  const { data } = await params;
  const fighter = decodeChallenge(data);
  const title = fighter ? `${fighter.name} からの挑戦状 - つぶやきバトラー` : "つぶやきバトラー";
  const description = fighter ? `${fighter.name}（${fighter.type.label}）があなたに挑戦している。受けて立とう。` : "あなたのSNSが戦う対戦ゲーム";
  return { title, description, openGraph: { title, description }, twitter: { card: "summary", title, description } };
}

export default async function ChallengePage({ params }: { params: Promise<{ data: string }> }) {
  const { data } = await params;
  const fighter = decodeChallenge(data);
  return <TsubuyakiBattler initialOpponent={fighter} />;
}
