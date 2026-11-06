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
    summary: "おすすめは栗子 S3 とエペイオス Essence Go。電動はまだありません。",
    lead: "豆を挽く道具です。手挽きのおすすめはタイムモア栗子 S3 と EPEIOS Essence Go です。電動は枠だけ先にあり、機種は準備中です。",
    planned: ["駆動（手挽き / 電動）", "バーの素材と径", "粒度調整", "重量", "価格の目安"],
    status: "live",
  },
  {
    slug: "dripper",
    shortName: "ドリッパー",
    name: "ドリッパー",
    summary: "円すい・台形・ウェーブ型の形と素材、フィルターとサーバーの選び方をまとめています。",
    lead: "ハンドドリップの受け皿です。ハリオ V60 やカリタ ウェーブなど、形と素材ごとの違いをまとめ、フィルターとサーバーの選び方も紹介しています。",
    planned: ["形（円すい・台形など）", "素材", "対応サーバーやカップ", "価格の目安"],
    status: "live",
  },
  {
    slug: "kettle",
    shortName: "ケトル",
    name: "ケトル",
    summary: "細口・温度調整・容量で、注ぎやすいケトルの選び方をまとめています。",
    lead: "注ぎの太さと温度が、ハンドドリップの再現性に効きます。細口の形、温度調整、容量、熱源から選ぶ基準をまとめています。",
    planned: ["注ぎ口", "温度調整の有無", "容量", "価格の目安"],
    status: "live",
  },
  {
    slug: "scale",
    shortName: "スケール",
    name: "スケール",
    summary: "0.1g・タイマー・防水で、豆と湯の量をそろえる秤の選び方です。",
    lead: "豆と湯の量を見るための秤です。0.1g単位の表示やタイマー、防水など、量をそろえるための見方をまとめています。",
    planned: ["最小表示", "タイマー", "防滴", "価格の目安"],
    status: "live",
  },
  {
    slug: "coffee-maker",
    shortName: "コーヒーメーカー",
    name: "コーヒーメーカー",
    summary: "ミル付き全自動・ドリップ式・カプセル式や、バルミューダ、ツインバード、ビアレッティなど淹れ方の違いを比べています。",
    lead: "スイッチひとつで淹れたい人向けの機械です。ミル付き全自動・ドリップ式・カプセル式の違いや、バルミューダ ザ・ブリューとツインバード全自動、ビアレッティのモカポット、フレンチプレスとサイフォンの選び方をまとめています。",
    planned: ["杯数", "フィルターの方式", "保温の有無", "価格の目安"],
    status: "live",
  },
  {
    slug: "espresso-machine",
    shortName: "エスプレッソマシン",
    name: "エスプレッソマシン",
    summary: "ブレビルとデロンギのグラインダー内蔵マシンや、家でラテを淹れる3台を比べています。",
    lead: "家庭でエスプレッソを淹れる機械です。ブレビルとデロンギのグラインダー内蔵マシンの比較と、家でラテを淹れる3台、ミルクフォーマーの選び方をまとめています。",
    planned: ["置き場所の目安", "立ち上げ", "手入れ", "価格の目安"],
    status: "live",
  },
  {
    slug: "canister",
    shortName: "キャニスター",
    name: "キャニスター",
    summary: "密閉・遮光・ガス抜きバルブで、豆の保存容器の選び方をまとめています。",
    lead: "挽く前の豆を置く容器です。密閉、遮光、ガス抜きバルブ、容量から選ぶ基準をまとめています。",
    planned: ["容量", "密閉", "遮光", "価格の目安"],
    status: "live",
  },
  {
    slug: "beans",
    shortName: "豆",
    name: "豆の店",
    summary: "4店の焙煎と、お試し・定期便の目安を紹介しています。",
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
