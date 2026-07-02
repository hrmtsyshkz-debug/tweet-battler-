import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー - つぶやきバトラー",
  description: "つぶやきバトラーのプライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="wrap">
      <h1 className="title" aria-hidden="true">
        つぶやき バトラー
      </h1>
      <p className="sub">プライバシーポリシー</p>

      <div className="panel">
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          つぶやきバトラー（以下「本サービス」）における利用者の情報の取り扱いについて、以下のとおりお知らせします。
        </p>

        <h2 style={{ color: "var(--ink)", fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>
          アカウント登録・個人情報について
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          本サービスはアカウント登録が不要で、サーバーに個人情報を保存することはありません。
        </p>

        <h2 style={{ color: "var(--ink)", fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>
          ブラウザへの保存について
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          実績・モンスター図鑑・効果音設定などのデータは、ブラウザのlocalStorageに端末内のみで保存されます。これらのデータは外部サーバーには送信されません。削除したい場合は、ブラウザの設定から該当サイトのデータを削除するか、本サービス内のリセットボタンをご利用ください。
        </p>

        <h2 style={{ color: "var(--ink)", fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>
          アクセス解析について
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          本サービスはアクセス状況の把握のためVercel Analyticsを利用しています。Cookieを使わない匿名の計測であり、個人を特定する情報は取得しません。
        </p>

        <h2 style={{ color: "var(--ink)", fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>
          Xアイコンの取得について
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          X（Twitter）IDを入力した場合、そのアイコン画像を外部サービス（unavatar.io）経由で取得します。これは任意の機能であり、X IDを入力しない限り通信は発生しません。
        </p>

        <h2 style={{ color: "var(--ink)", fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>
          シェア機能について
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          結果のシェア機能は、X（Twitter）の共有画面を開くのみです。本サービスが投稿内容を取得・保存することはありません。
        </p>

        <h2 style={{ color: "var(--ink)", fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>
          広告について
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          現在、本サービスは広告を掲載していません。将来、広告を掲載する場合は本ポリシーを更新してお知らせします。
        </p>

        <h2 style={{ color: "var(--ink)", fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>
          お問い合わせ
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.9, marginBottom: 24 }}>
          本サービスに関するお問い合わせは、GitHubリポジトリの
          <a
            href="https://github.com/hrmtsyshkz-debug/tweet-battler-"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
          >
            Issue
          </a>
          までお願いいたします。
        </p>

        <p style={{ fontSize: 12, color: "var(--ink-faint)", lineHeight: 1.9, marginBottom: 24 }}>
          制定日: 2026年7月2日
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
