export type CategoryStatus = "live" | "soon";

export type Category = {
  slug: string;
  /** カードやナビで使う短い名前 */
  shortName: string;
  /** ページの見出し */
  name: string;
  /** 一覧カードの一文 */
  summary: string;
  /** カテゴリページの導入 */
  lead: string;
  /** これから比べる軸。未掲載の商品名は書かない */
  planned: string[];
  status: CategoryStatus;
};

export const categories: Category[] = [
  {
    slug: "mill",
    shortName: "ミル",
    name: "コーヒーミル（手挽き・電動）",
    summary: "おすすめは栗子 S5 Pro とエペイオス Essence Go。電動はまだありません。",
    lead: "豆を挽く道具です。手挽きはタイムモア 栗子 S5 Pro と EPEIOS Essence Go を掲載しています。電動は枠だけ先にあり、機種は準備中です。",
    planned: ["駆動（手挽き / 電動）", "バーの素材と径", "粒度調整", "重量", "価格の目安"],
    status: "live",
  },
  {
    slug: "dripper",
    shortName: "ドリッパー",
    name: "ドリッパー",
    summary: "円すいや台形など、淹れ方に合う形を比べる予定です。",
    lead: "ハンドドリップの受け皿です。形、素材、リブの有無で抽出の傾向が分かれますが、このサイトにはまだ機種を載せていません。",
    planned: ["形（円すい・台形など）", "素材", "対応サーバーやカップ", "価格の目安"],
    status: "soon",
  },
  {
    slug: "kettle",
    shortName: "ケトル",
    name: "ドリップケトル",
    summary: "細い注ぎ口の上位3台を、公式仕様のレビューまとめで並べています。",
    lead: "運営者が書ける体験は、ドリップ専用のケトルは注ぎ口が細く、こぼしにくくなった、というところまでです。銘柄は書いていません。掲載の3台はレビューまとめです。",
    planned: ["注ぎ口", "温度調整の有無", "容量", "電源の電圧"],
    status: "live",
  },
  {
    slug: "scale",
    shortName: "スケール",
    name: "スケール",
    summary: "タイマー付きの計量など、抽出の秤を比べる予定です。",
    lead: "豆と湯の量を見るための秤です。最小表示やタイマーの有無で使い勝手が変わります。機種はまだありません。",
    planned: ["最小表示", "タイマー", "防滴", "価格の目安"],
    status: "soon",
  },
  {
    slug: "coffee-maker",
    shortName: "コーヒーメーカー",
    name: "コーヒーメーカー",
    summary: "上質な3台を、公式仕様のレビューまとめで並べています。",
    lead: "運営者は、このハブの3台を使っていません。デロンギ、バルミューダ、ツインバードを公式の仕様だけで比べ、詳しい既存記事へつなぎます。",
    planned: ["淹れ方（全自動・ドリップ）", "ミルの有無", "杯数", "電源の電圧"],
    status: "live",
  },
  {
    slug: "espresso-machine",
    shortName: "エスプレッソマシン",
    name: "エスプレッソマシン",
    summary: "家庭用マシンを、置き場所と手入れの観点から比べる予定です。",
    lead: "家庭でエスプレッソを淹れる機械です。音、立ち上がり、日々の手入れが選ぶときの軸になります。機種データはまだありません。",
    planned: ["置き場所の目安", "立ち上げ", "手入れ", "価格の目安"],
    status: "soon",
  },
  {
    slug: "canister",
    shortName: "キャニスター",
    name: "キャニスター",
    summary: "豆の保存容器を、密閉と容量で比べる予定です。",
    lead: "挽く前の豆を置く容器です。密閉、容量、遮光を比べる予定で、商品は未掲載です。",
    planned: ["容量", "密閉", "遮光", "価格の目安"],
    status: "soon",
  },
  {
    slug: "beans",
    shortName: "豆",
    name: "豆の店",
    summary: "5店の焙煎と、お試し・定期便の目安を紹介しています。",
    lead: "家に届く焙煎豆を、店の焙煎と豆の選び方から紹介します。金額があるものは目安です。",
    planned: ["注文後の焙煎", "豆の選び方", "お試しと定期便", "価格の目安"],
    status: "live",
  },
  {
    slug: "golf",
    shortName: "ゴルフ",
    name: "ゴルフ用レーザー距離計",
    summary: "運営者が使うのは、手ブレ補正の最上位ニコン COOLSHOT PROIII STABILIZED。",
    lead: "週末のラウンドで距離が落ち着いた、という運営者の一台と、使っていない2台のレビューまとめです。仕様は各社公式だけを見ています。",
    planned: ["手ブレ補正", "測距範囲と表示の速さ", "高低差", "重さと電源"],
    status: "live",
  },
  {
    slug: "home-work",
    shortName: "在宅",
    name: "折りたたみ昇降デスク",
    summary: "しまうときに折れて、立つ高さまで上がる机を、公式仕様で3台。",
    lead: "運営者は、邪魔なときにしまえて立つ高さまで上がる机を使っています。メーカー名は書いていません。掲載の3台は、その条件に近いレビューまとめです。",
    planned: ["しまうときの厚さ", "立ち作業の高さ", "天板の広さ", "耐荷重"],
    status: "live",
  },
  {
    slug: "knife",
    shortName: "包丁",
    name: "日本の牛刀",
    summary: "高い牛刀は未使用。日本で選ぶときの公式仕様を3本。",
    lead: "運営者は高級な包丁を使っていません。関と燕三条の公式ページだけを見て、最初の一本を狭めるためのレビューまとめです。切れ味の感想はありません。",
    planned: ["刃渡り", "鋼材の公表", "作り手の所在", "両刃かどうか"],
    status: "live",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function categoryHref(slug: string): string {
  if (slug === "beans") return "/beans";
  return `/categories/${slug}`;
}
