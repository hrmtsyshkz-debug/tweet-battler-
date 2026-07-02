import Link from "next/link";

export function SiteFooter() {
  return (
    <footer
      style={{
        textAlign: "center",
        marginTop: 40,
        paddingBottom: 96,
        paddingTop: 12,
        fontSize: 11,
        color: "var(--ink-faint)",
      }}
    >
      <Link href="/about" style={{ color: "var(--ink-soft)" }}>
        遊び方
      </Link>
      {" ・ "}
      <Link href="/privacy" style={{ color: "var(--ink-soft)" }}>
        プライバシーポリシー
      </Link>
    </footer>
  );
}
