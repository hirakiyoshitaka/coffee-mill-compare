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
    summary: "手挽きは5機種を公開中。電動の機種データはまだありません。",
    lead: "豆を挽く道具です。手挽きはコマンダンテ、キヌ、タイムモア、1Zpresso、EPEIOS のフラッグシップを掲載しています。電動は枠だけ先にあり、機種は準備中です。",
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
    name: "ケトル",
    summary: "細口や温度調整など、お湯を注ぐ道具を比べる予定です。",
    lead: "注ぎの太さと温度が、ハンドドリップの再現性に効きます。機種データは未掲載です。",
    planned: ["注ぎ口", "温度調整の有無", "容量", "価格の目安"],
    status: "soon",
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
    summary: "ハンドドリップ以外の淹れ方を比べる予定です。",
    lead: "スイッチひとつで淹れたい人向けの機械です。杯数やフィルターの方式を軸にする予定で、機種は未掲載です。",
    planned: ["杯数", "フィルターの方式", "保温の有無", "価格の目安"],
    status: "soon",
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
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function categoryHref(slug: string): string {
  if (slug === "beans") return "/beans";
  return `/categories/${slug}`;
}
