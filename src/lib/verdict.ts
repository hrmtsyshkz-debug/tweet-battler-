import { hashString, mulberry32 } from "./rng";
import { Fighter } from "./types";

type Category = "atk高" | "atk低" | "def高" | "def低" | "spd高" | "spd低" | "hp高" | "hp低";

const LINES: Record<Category, (f: Fighter) => string[]> = {
  atk高: (f) => [
    `攻撃${f.atk}。つぶやきのトゲがそのまま数値化されています`,
    `攻撃${f.atk}。リプ欄に着弾する威力です`,
    `攻撃${f.atk}。言葉選びのセンスが凶器化しています`,
    `攻撃${f.atk}。煽り耐性のない人は見ない方がいい`,
    `攻撃${f.atk}。正論という名の刃物を振り回すタイプ`,
    `攻撃${f.atk}。フォロワーの何人かは静かに離脱済み`,
  ],
  atk低: (f) => [
    `攻撃${f.atk}。強い言葉を持たない、それはそれで平和`,
    `攻撃${f.atk}。誰も傷つけない代わりに誰の記憶にも残らない`,
    `攻撃${f.atk}。優しさと語彙力のなさは紙一重`,
    `攻撃${f.atk}。バトルよりも共感のいいねが似合う`,
    `攻撃${f.atk}。牙を抜かれたインコみたいな戦闘力`,
    `攻撃${f.atk}。煽りたくても煽り方が分からないタイプ`,
  ],
  def高: (f) => [
    `防御${f.def}。何を言われても心のブロック機能が優秀`,
    `防御${f.def}。批判はだいたい脳内でミュートされる`,
    `防御${f.def}。鋼メンタルすぎて説教が届かない`,
    `防御${f.def}。炎上しても寝れるタイプの図太さ`,
    `防御${f.def}。指摘は右から左、右から左`,
    `防御${f.def}。鈍感力という才能に恵まれています`,
  ],
  def低: (f) => [
    `防御${f.def}。メンタルは紙製です`,
    `防御${f.def}。ちょっとした既読スルーで一週間へこむ`,
    `防御${f.def}。いいねの数だけで一喜一憂する繊細設計`,
    `防御${f.def}。エゴサして自分で傷ついている説あり`,
    `防御${f.def}。ガラスのハートに直撃注意`,
    `防御${f.def}。通知が来るたびビクッとする防御力`,
  ],
  spd高: (f) => [
    `素早さ${f.spd}。逃げ足だけは超一流`,
    `素早さ${f.spd}。話題に食いつく速度が異常`,
    `素早さ${f.spd}。トレンド入りより先に反応している`,
    `素早さ${f.spd}。既読即レスの化身`,
    `素早さ${f.spd}。撤退の判断だけは誰よりも早い`,
    `素早さ${f.spd}。炎上の匂いを嗅ぎつけて即ブロックする俊敏さ`,
  ],
  spd低: (f) => [
    `素早さ${f.spd}。既読を付けるのも遅いタイプ`,
    `素早さ${f.spd}。話題に気づく頃には全員飽きている`,
    `素早さ${f.spd}。返信は基本、翌日以降`,
    `素早さ${f.spd}。トレンドが去ってから参戦するスタイル`,
    `素早さ${f.spd}。マイペースを通り越して周回遅れ`,
    `素早さ${f.spd}。通知に気づくのは大体三日後`,
  ],
  hp高: (f) => [
    `HP${f.hp}。無駄にタフなので残業に向いています`,
    `HP${f.hp}。何度叩かれても翌朝には元気になる回復力`,
    `HP${f.hp}。心配になるレベルの耐久力`,
    `HP${f.hp}。しぶとさだけで生き残っているタイプ`,
    `HP${f.hp}。打たれ強さが唯一の取り柄です`,
    `HP${f.hp}。折れない心というより単純に頑丈`,
  ],
  hp低: (f) => [
    `HP${f.hp}。打たれ弱さが逆に清々しい`,
    `HP${f.hp}。一言でゲージが空になる繊細設計`,
    `HP${f.hp}。無理は続かないタイプ、それも個性`,
    `HP${f.hp}。体力ゲージが常に残業明けの状態`,
    `HP${f.hp}。ちょっとしたことですぐ電池切れになる`,
    `HP${f.hp}。長期戦は最初から想定していない作り`,
  ],
};

export function generateVerdict(f: Fighter): string {
  const seedBase = f.name + "|" + f.typeKey + "|" + f.hp + "-" + f.atk + "-" + f.def + "-" + f.spd + "|verdict";
  const seed = hashString(seedBase);
  const rng = mulberry32(seed);

  const stats: { key: "atk" | "def" | "spd" | "hp"; value: number; normalized: number }[] = [
    { key: "atk", value: f.atk, normalized: f.atk },
    { key: "def", value: f.def, normalized: f.def },
    { key: "spd", value: f.spd, normalized: f.spd },
    { key: "hp", value: f.hp, normalized: f.hp / 1.4 },
  ];

  let highest = stats[0];
  let lowest = stats[0];
  for (const s of stats) {
    if (s.normalized > highest.normalized) highest = s;
    if (s.normalized < lowest.normalized) lowest = s;
  }

  const highCategory = `${highest.key}高` as Category;
  const lowCategory = `${lowest.key}低` as Category;

  // Mix both pools so weaknesses get roasted too; pick one of the two categories via seeded RNG.
  const useHigh = rng() < 0.5;
  const chosenCategory = useHigh ? highCategory : lowCategory;
  const pool = LINES[chosenCategory](f);
  const idx = Math.floor(rng() * pool.length);
  return pool[idx];
}
