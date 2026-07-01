import { TypeInfo } from "./types";

export const TYPES: TypeInfo[] = [
  { key: "shachiku", label: "社畜", color: "#8899aa", keywords: ["会議", "残業", "上司", "有給", "終電", "出社", "納期", "部長", "休みたい"] },
  { key: "indoor", label: "インドア派", color: "#5dcaa5", keywords: ["家から出たくない", "引きこもり", "家でゴロゴロ", "布団", "ソシャゲ", "家が一番"] },
  { key: "youkya", label: "陽キャ", color: "#ef9f27", keywords: ["飲み会", "パリピ", "フェス", "バーベキュー", "ウェイ", "合コン", "陽キャ"] },
  { key: "otaku", label: "限界オタク", color: "#7f77dd", keywords: ["尊い", "供給", "円盤", "布教", "限界", "現場", "担当", "沼"] },
  { key: "aori", label: "煽り魔", color: "#e24b4a", keywords: ["ww", "知らんけど", "論破", "マウント", "はい論破", "釣り", "炎上", "それな"] },
  { key: "oshikatsu", label: "推し活勢", color: "#d4537e", keywords: ["推し活", "グッズ", "チェキ", "参戦", "現場", "尊い"] },
  { key: "ishiki", label: "意識高い系", color: "#639922", keywords: ["自己投資", "朝活", "インプット", "アウトプット", "ビジネス書", "副業", "起業", "人脈"] },
  { key: "rouhi", label: "浪費家", color: "#d85a30", keywords: ["爆買い", "課金", "散財", "給料日", "セール", "ポチった", "買っちゃった"] },
];

export const MOVE_TEMPLATES: string[] = [
  "○○の逆襲", "全力○○", "秘技・○○", "○○ビーム", "禁断の○○",
  "深夜の○○", "○○チャージ", "本気の○○", "渾身の○○", "○○オブザイヤー",
];

export const MOVE_NOUNS: Record<string, string[]> = {
  shachiku: ["残業", "有給消化", "土下座", "終電ダッシュ", "定時退社"],
  indoor: ["布団ダイブ", "コタツ", "引きこもり", "ゴロ寝", "エアコン全開"],
  youkya: ["ウェイウェイ", "テンションMAX", "ノリ", "陽の力", "乾杯コール"],
  otaku: ["尊み", "供給過多", "布教活動", "推し語り", "円盤リピート"],
  aori: ["論破", "煽りリプ", "煽りスクショ", "マウント", "知らんけど宣言"],
  oshikatsu: ["チェキ会", "現場乱入", "サイリウム乱舞", "担当報告", "物販列"],
  ishiki: ["朝活マウント", "人脈自慢", "自己啓発本", "副業自慢", "名刺配り"],
  rouhi: ["ポチり", "爆買い", "課金", "セール突撃", "後先考えない散財"],
};

export interface Happening {
  text: string;
  effect: "skip" | "buff" | "crit";
}

export const HAPPENINGS: Happening[] = [
  { text: "{n}は推しの配信が始まったため戦線離脱した！", effect: "skip" },
  { text: "{n}は急に電話がかかってきて動けない！", effect: "skip" },
  { text: "{n}はSNSの通知が気になって集中できない！", effect: "skip" },
  { text: "{n}はうっかり寝落ちしてしまった…", effect: "skip" },
  { text: "{n}は差し入れのタピオカに気を取られた！", effect: "skip" },
  { text: "{n}はコンビニに寄り道してしまった！", effect: "skip" },
  { text: "{n}は謎のやる気に目覚めた！ 次の一撃が強化される！", effect: "buff" },
  { text: "{n}は謎の勇気を振り絞った！ 会心の一撃！", effect: "crit" },
  { text: "{n}は不謹慎な技を繰り出そうとしたが自主規制した！", effect: "skip" },
  { text: "{n}は限界を超えて覚醒した！ 次の一撃が強化される！", effect: "buff" },
];

export const ACCESSORY: Record<string, [number, number, string][]> = {
  shachiku: [[4, 6, "#d0342c"], [4, 7, "#d0342c"], [3, 6, "#e8e8e8"], [5, 6, "#e8e8e8"]],
  indoor: [[1, 7, "#8fd6ff"], [2, 7, "#8fd6ff"], [6, 7, "#8fd6ff"], [7, 7, "#8fd6ff"]],
  youkya: [[3, 2, "#151515"], [4, 2, "#151515"], [5, 2, "#151515"], [2, 2, "#151515"], [6, 2, "#151515"]],
  otaku: [[3, 0, "#ffe66d"], [5, 0, "#ffe66d"], [3, -1, "#ffe66d"], [5, -1, "#ffe66d"]],
  aori: [[3, 1, "#e24b4a"], [5, 1, "#e24b4a"], [2, 1, "#e24b4a"], [6, 1, "#e24b4a"]],
  oshikatsu: [[4, 0, "#ff8fc7"], [3, 0, "#ff8fc7"], [5, 0, "#ff8fc7"]],
  ishiki: [[2, 2, "#222222"], [6, 2, "#222222"], [2, 3, "#222222"], [6, 3, "#222222"]],
  rouhi: [[4, 5, "#ffd23f"], [4, 4, "#ffd23f"]],
};

export function typeByKey(key: string): TypeInfo {
  return TYPES.find((t) => t.key === key) ?? TYPES[0];
}
