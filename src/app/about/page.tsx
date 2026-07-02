import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "遊び方 - つぶやきバトラー",
  description: "つぶやきバトラーの遊び方・対戦方法・やりこみ要素の紹介",
};

export default function AboutPage() {
  return (
    <div className="wrap">
      <h1 className="title" aria-hidden="true">
        つぶやき バトラー
      </h1>
      <p className="sub">遊び方</p>

      <div className="panel">
        <h2 style={{ color: "var(--ink)", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>
          このゲームについて
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          つぶやき（SNS投稿でも適当な一言でもOK）からモンスターを自動生成して戦わせる無料ブラウザゲームです。登録不要で、今すぐ誰でも遊べます。
        </p>

        <h2 style={{ color: "var(--ink)", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>
          遊び方
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          1. ニックネームとつぶやきを入力（属性を直接選んでもOK）
          <br />
          2. 準備完了を押すとキャラが生成される
          <br />
          3. オートで観戦 or 自分で戦うを選んでバトル
          <br />
          4. 結果カードを保存・シェア
        </p>

        <h2 style={{ color: "var(--ink)", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>
          対戦のしかた
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          挑戦状URLを送る／QRバトルカードを見せ合う／バーコードから謎モンスター召喚、といった方法で友達と対戦できます。
        </p>

        <h2 style={{ color: "var(--ink)", fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>
          やりこみ要素
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 8 }}>
          実績・自己満レベル・称号、モンスター図鑑など、コレクションややりこみ要素も充実しています。
        </p>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/">
            <button className="big" type="button">
              あそぶ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
