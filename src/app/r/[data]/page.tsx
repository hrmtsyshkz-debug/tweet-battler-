import type { Metadata } from "next";
import Link from "next/link";
import { decodeOgData } from "@/lib/ogPayload";

export async function generateMetadata({ params }: { params: Promise<{ data: string }> }): Promise<Metadata> {
  const { data } = await params;
  const decoded = decodeOgData(data);
  const title = decoded ? `${decoded.winner.name} の勝利！ - つぶやきバトラー` : "つぶやきバトラー";
  const description = decoded
    ? `${decoded.winner.name}が${decoded.loser.name}に「${decoded.finishingMove || "謎の一撃"}」で勝利した。`
    : "あなたのSNSが戦う対戦ゲーム";
  const ogImage = `/api/og?d=${data}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function ResultSharePage({ params }: { params: Promise<{ data: string }> }) {
  const { data } = await params;
  const decoded = decodeOgData(data);

  return (
    <div className="wrap">
      <h1 className="title" aria-hidden="true">
        つぶやき バトラー
      </h1>
      <div className="panel result">
        {decoded ? (
          <>
            <h2>{decoded.winner.name} の勝利！</h2>
            <p style={{ color: "#cdd9f5", fontSize: 14, marginTop: 10 }}>
              決まり技：「{decoded.finishingMove || "不明の一撃"}」
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/og?d=${data}`} alt="バトル結果" style={{ maxWidth: "100%", border: "3px solid #4a5a8a", marginTop: 16 }} />
          </>
        ) : (
          <p>この結果データは読み取れませんでした。</p>
        )}
        <div style={{ marginTop: 20 }}>
          <Link href="/">
            <button className="big" type="button">
              自分もバトルする
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
