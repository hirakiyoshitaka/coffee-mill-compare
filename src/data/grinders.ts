export type GrinderType = "manual" | "electric" | "hybrid";

export type CommunityReview = {
  id: string;
  /** 口コミ・レビューで繰り返し見られる論点 */
  theme: string;
  /** 編集部が要約したコミュニティの声（特定の投稿の転載ではありません） */
  summary: string;
  tendency: "good" | "mixed" | "watch";
};

export type GrinderModel = {
  id: string;
  brandSlug: string;
  name: string;
  shortLabel: string;
  /**
   * 実機と確認でき、このサイトの利用条件に合う写真だけを入れる。
   * 未設定のときは名前だけのプレースホルダを出す。
   */
  imageUrl?: string;
  imageAlt?: string;
  /** 写真がないときの注記。色名など、公式で確認した事実だけ */
  placeholderNote?: string;
  type: GrinderType;
  burrMaterial: string;
  burrDiameterMm?: number;
  adjustment: string;
  weightGrams?: number;
  /** 価格の目安。店・為替・改定で変わることがある */
  priceJpyHint: string;
  /** カードに出す、運営者の一言。味の断定は書かない */
  highlight?: string;
  /** 購入ボタンの直前に出す注意。リンク先の選び方など */
  purchaseNote?: string;
  /** 専用レビュー記事のスラッグ */
  reviewSlug?: string;
  /**
   * アフィリエイト用の購入リンク。すべて任意。
   * 空文字または未設定のものはボタンを出さない。
   * URL 系は https のアドレス、moshimoHtml はもしもアフィリエイト等の HTML。
   */
  rakutenUrl?: string;
  amazonUrl?: string;
  yahooUrl?: string;
  /** Shopee マレーシア（Involve Asia 経由）。マレーシアの読者向け */
  shopeeMyUrl?: string;
  moshimoHtml?: string;
  cuppingNotes: string[];
  caveats: string[];
};

export type Brand = {
  slug: string;
  nameJa: string;
  nameEn: string;
  country: string;
  blurb: string;
  flagshipIds: string[];
  communityReviews: CommunityReview[];
};

export const grinderModels: Record<string, GrinderModel> = {
  "timemore-chestnut-s5-pro": {
    id: "timemore-chestnut-s5-pro",
    brandSlug: "timemore",
    name: "TIMEMORE 栗子 S5 Pro",
    shortLabel: "栗子 S5 Pro",
    imageUrl: "/images/timemore-s5-pro-green.webp",
    imageAlt: "TIMEMORE 栗子 S5 Pro グリーン",
    type: "manual",
    burrMaterial: "420ステンレス TriB-048-I（5軸CNC、硬度58HRC）",
    burrDiameterMm: 48,
    adjustment: "外ダイヤル 1回転90クリック、1クリック15ミクロン",
    weightGrams: 910,
    priceJpyHint: "公式サイト表示 ¥25,800（2026年10月26日閲覧。プレセール価格の記載。税の扱いと在庫は購入ページで確認）",
    highlight: "運営者本人が毎日使っている一台です。色はグリーン（公式名 Olive Green）。ドリップ中心で、約910gの重さは毎日使っても気にならない、というのが本人の感想です。",
    purchaseNote: "このリンク先では「S5 Pro」と「グリーン」を選んでください。",
    reviewSlug: "timemore-chestnut-s5-pro",
    rakutenUrl:
      "https://hb.afl.rakuten.co.jp/ichiba/58d84d03.7b0724e9.58d84d04.7cac0326/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftimemore%2Fs5series%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9",
    amazonUrl: "https://www.amazon.co.jp/dp/B0HF4LXCCY?tag=stocknotelife-22",
    shopeeMyUrl: "https://invl.me/clo6h9w",
    yahooUrl: "",
    moshimoHtml: "",
    cuppingNotes: [
      "48mmの刃を、幅56mmのボディに積んだ手挽き",
      "家に置く一台として、このサイトの No.1 に置いています",
    ],
    caveats: [
      "公式重量は約910g。折りたたみハンドルはあっても、旅行の第一候補にはしていません",
      "ゼロ点でも刃のすき間は約0.075mm。偏った力では摩擦音が出ることがある、と公式が注意しています",
    ],
  },
  /** EPEIOS: 比較対象は Essence Go のみ固定。価格・スペックは静的（公式 URL の定期同期なし・要更新時は手動で編集）。 */
  "epeios-essence-go": {
    id: "epeios-essence-go",
    brandSlug: "epeios",
    name: "エペイオス Essence Go",
    shortLabel: "Essence Go",
    highlight: "公式は、38mm・10枚刃で挽きはじめの軽さを狙った、と説明しています。専用ケース付きです。運営者の一言は「とにかく軽く回る」。",
    reviewSlug: "epeios-essence-go",
    imageUrl:
      "https://epeios.jp/cdn/shop/files/20250121_epeios_3177.jpg?v=1744272927&width=1200",
    imageAlt: "エペイオス Essence Go（EPEIOS公式サイトの製品写真）",
    type: "manual",
    burrMaterial: "ステンレス コニカル（10枚刃・38mm）",
    burrDiameterMm: 38,
    adjustment: "0〜80 段階（公式表記に合わせたサイト内固定値）",
    weightGrams: 870,
    priceJpyHint: "¥23,100（税込・公式掲載を基準としたサイト内固定値／改定は手動更新）",
    rakutenUrl:
      "https://hb.afl.rakuten.co.jp/ichiba/58d84e37.d92dccda.58d84e38.b6bc4022/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fepeios-official%2Fbg003abjp1%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9",
    amazonUrl: "https://www.amazon.co.jp/dp/B0D3PZHGBX?tag=stocknotelife-22",
    shopeeMyUrl: "https://invl.me/clo6h9y",
    yahooUrl: "",
    moshimoHtml: "",
    cuppingNotes: [
      "井崎英典氏監修。38mm・10枚刃の手挽き",
      "分解して専用ケースに入れられる、と公式が説明しています",
    ],
    caveats: [
      "ロングセラーブランドとの比較検証は個人の抽出環境に依存",
      "スペア・サポート体制は購入前に公式情報で要確認",
    ],
  },
};

export const brands: Brand[] = [
  {
    slug: "timemore",
    nameJa: "タイムモア",
    nameEn: "Timemore",
    country: "中国",
    blurb:
      "デザインと調整機構で知られる手挽きのブランドです。このサイトが勧めるのは栗子 S5 Pro（Chestnut S5 Pro）です。",
    flagshipIds: ["timemore-chestnut-s5-pro"],
    communityReviews: [
      {
        id: "tm-1",
        theme: "コスパと見た目",
        summary:
          "同価格帯の欧州ブランドと並べても完成度が高い、という評価がレビュー記事・SNS で繰り返されます。",
        tendency: "good",
      },
      {
        id: "tm-2",
        theme: "微調整と極細域",
        summary:
          "エスプレッソ用途ではクリック感や残粉に関する細かな好みの分かれが見られます。",
        tendency: "mixed",
      },
      {
        id: "tm-3",
        theme: "メンテナンス",
        summary:
          "分解清掃のしやすさを褒める声と、パーツの入手性を気にする声が混在します。",
        tendency: "watch",
      },
    ],
  },
  {
    slug: "epeios",
    nameJa: "エペイオス",
    nameEn: "EPEIOS",
    country: "日本（ブランド運営）",
    blurb:
      "調理家電の EPEIOS（エペイオス）です。このサイトの手挽きは Essence Go だけを載せています。井崎英典氏が監修した、という説明は公式のものです。価格と数値は、公式ページを見た時点の固定値です。",
    flagshipIds: ["epeios-essence-go"],
    communityReviews: [
      {
        id: "ep-1",
        theme: "監修ストーリーと初見の印象",
        summary:
          "バリスタ監修という説明に興味を持つ一方、ロングセラー機との盲テスト比較はまだ少ないという慎重な声もあります。",
        tendency: "mixed",
      },
      {
        id: "ep-2",
        theme: "携帯性・ケース",
        summary:
          "アウトドアや出張用としてケース同梱を評価するコメントが見られます。",
        tendency: "good",
      },
      {
        id: "ep-3",
        theme: "段階調整の体感",
        summary:
          "0〜80 段階の細かさを褒める声と、実際の抽出ではマーキングやメモが必要という実用面の指摘が混在します。",
        tendency: "watch",
      },
    ],
  },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getModel(id: string): GrinderModel | undefined {
  return grinderModels[id];
}

export function grinderTypeLabel(type: GrinderType): string {
  if (type === "manual") return "手挽き";
  if (type === "electric") return "電動";
  return "ハイブリッド";
}

const featuredOrder = ["timemore-chestnut-s5-pro", "epeios-essence-go"] as const;

export function featuredLabel(id: string): string | undefined {
  const index = featuredOrder.indexOf(id as (typeof featuredOrder)[number]);
  if (index < 0) return undefined;
  return `おすすめ No.${index + 1}`;
}

export function getFeaturedModels(): GrinderModel[] {
  return featuredOrder.map((id) => grinderModels[id]);
}

export function getFlagshipModels(): GrinderModel[] {
  const models = brands.flatMap((brand) =>
    brand.flagshipIds
      .map((id) => grinderModels[id])
      .filter((model): model is GrinderModel => Boolean(model)),
  );
  return [...models].sort((a, b) => {
    const aRank = featuredOrder.indexOf(a.id as (typeof featuredOrder)[number]);
    const bRank = featuredOrder.indexOf(b.id as (typeof featuredOrder)[number]);
    const aScore = aRank < 0 ? 99 : aRank;
    const bScore = bRank < 0 ? 99 : bRank;
    return aScore - bScore;
  });
}

export const comparisonRows = [
  { key: "type", label: "駆動", get: (m: GrinderModel) => grinderTypeLabel(m.type) },
  { key: "burr", label: "バー", get: (m: GrinderModel) => m.burrMaterial },
  { key: "dia", label: "バー径（参考）", get: (m: GrinderModel) => (m.burrDiameterMm ? `${m.burrDiameterMm} mm` : "公表値要確認") },
  { key: "adj", label: "粒度調整", get: (m: GrinderModel) => m.adjustment },
  { key: "w", label: "重量（参考）", get: (m: GrinderModel) => (m.weightGrams ? `${m.weightGrams} g` : "—") },
  { key: "price", label: "価格の目安", get: (m: GrinderModel) => m.priceJpyHint },
] as const;
