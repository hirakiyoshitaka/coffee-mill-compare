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
    imageUrl: "https://image.rakuten.co.jp/timemore/cabinet/13690744/imgrc0132385734.jpg",
    imageAlt: "TIMEMORE 栗子 S5 Pro グリーンの楽天市場商品画像",
    type: "manual",
    burrMaterial: "420ステンレス TriB-048-I（5軸CNC、硬度58HRC）",
    burrDiameterMm: 48,
    adjustment: "外ダイヤル 1回転90クリック、1クリック15ミクロン",
    weightGrams: 910,
    priceJpyHint: "公式サイト表示 ¥25,800（2026年10月26日閲覧。プレセール価格の記載。税の扱いと在庫は購入ページで確認）",
    highlight: "運営者のおすすめはグリーンです。公式の色名は Olive Green。もう一色は Matt Black です。",
    purchaseNote: "このリンク先では「S5 Pro」と「グリーン」を選んでください。",
    reviewSlug: "timemore-chestnut-s5-pro",
    rakutenUrl:
      "https://hb.afl.rakuten.co.jp/ichiba/58d84d03.7b0724e9.58d84d04.7cac0326/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftimemore%2Fs5series%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9",
    amazonUrl: "",
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
  "comandante-c40": {
    id: "comandante-c40",
    brandSlug: "comandante",
    name: "Comandante C40 MK4",
    shortLabel: "C40 MK4",
    type: "manual",
    burrMaterial: "窒化鋼（Nitro Blade）",
    burrDiameterMm: 39,
    adjustment: "ダイヤル式ステップ（クリック）",
    weightGrams: 600,
    priceJpyHint: "約45,000〜55,000円台（リテーラー・為替により変動）",
    rakutenUrl: "",
    amazonUrl: "",
    yahooUrl: "",
    moshimoHtml: "",
    cuppingNotes: [
      "粒子の均一さと甘みの出方で定評",
      "ハンドドリップ〜カップ向けのバランス型",
      "ビルド品質とリセールの高さ",
    ],
    caveats: [
      "価格帯が高め",
      "エスプレッソ極細は習熟と時間が必要な声も",
    ],
  },
  "timemore-chestnut-x": {
    id: "timemore-chestnut-x",
    brandSlug: "timemore",
    name: "Timemore Chestnut X",
    shortLabel: "Chestnut X",
    type: "manual",
    burrMaterial: "S2C 880 ステンレス（特許形状）",
    burrDiameterMm: undefined,
    adjustment: "24段階＋微調整リング",
    weightGrams: 765,
    priceJpyHint: "約35,000〜45,000円台（セール・店舗により変動）",
    rakutenUrl: "",
    amazonUrl: "",
    yahooUrl: "",
    moshimoHtml: "",
    cuppingNotes: [
      "切れ味とスルー速度のバランス",
      "デザイン性とコストパフォーマンスの両立を狙う層に人気",
    ],
    caveats: [
      "サイズ・重量は携帯より据え置き寄り",
      "極細域の再現性は個体差・メンテ感度の指摘も",
    ],
  },
  "1zpresso-k-ultra": {
    id: "1zpresso-k-ultra",
    brandSlug: "1zpresso",
    name: "1Zpresso K-Ultra",
    shortLabel: "K-Ultra",
    type: "manual",
    burrMaterial: "ステンレス コニカル",
    burrDiameterMm: 48,
    adjustment: "外ダイヤル式 100 クリック/回（8.8µm/click 目安）",
    weightGrams: 700,
    priceJpyHint: "約28,000〜38,000円台（直販・代理店により変動）",
    rakutenUrl: "",
    amazonUrl: "",
    yahooUrl: "",
    moshimoHtml: "",
    cuppingNotes: [
      "大径バーと外調整の使い勝手が支持されることが多い",
      "エスプレッソ寄りの細挽きにも挑戦しやすい設計",
    ],
    caveats: [
      "パーツ供給はブランド・世代で要確認",
      "外観はやや工業的と感じるユーザーも",
    ],
  },
  /** EPEIOS: 比較対象は Essence Go のみ固定。価格・スペックは静的（公式 URL の定期同期なし・要更新時は手動で編集）。 */
  "epeios-essence-go": {
    id: "epeios-essence-go",
    brandSlug: "epeios",
    name: "エペイオス Essence Go",
    shortLabel: "Essence Go",
    highlight: "公式は、38mm・10枚刃で挽きはじめの軽さを狙った、と説明しています。専用ケース付きです。",
    reviewSlug: "epeios-essence-go",
    imageUrl:
      "https://hbb.afl.rakuten.co.jp/hgb/58d84e37.d92dccda.58d84e38.b6bc4022/?me_id=1408256&item_id=10000052&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fepeios-official%2Fcabinet%2F10681556%2Fbg003-01.jpg&s=800x800&t=picttext",
    imageAlt: "エペイオス Essence Go の楽天市場商品画像",
    type: "manual",
    burrMaterial: "ステンレス コニカル（10枚刃・38mm）",
    burrDiameterMm: 38,
    adjustment: "0〜80 段階（公式表記に合わせたサイト内固定値）",
    weightGrams: 870,
    priceJpyHint: "¥23,100（税込・公式掲載を基準としたサイト内固定値／改定は手動更新）",
    rakutenUrl:
      "https://hb.afl.rakuten.co.jp/ichiba/58d84e37.d92dccda.58d84e38.b6bc4022/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fepeios-official%2Fbg003abjp1%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MSwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9",
    amazonUrl: "",
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
  "kinu-m47-classic": {
    id: "kinu-m47-classic",
    brandSlug: "kinu",
    name: "Kinu M47 Classic",
    shortLabel: "M47 Classic",
    type: "manual",
    burrMaterial: "硬化鋼 コニカル（ブラックコーティング）",
    burrDiameterMm: 47,
    adjustment: "マイクロメトリック ステンレスダイヤル（無段階）",
    weightGrams: 715,
    priceJpyHint: "約55,000〜75,000円台（輸入ルート・在庫により変動）",
    rakutenUrl: "",
    amazonUrl: "",
    yahooUrl: "",
    moshimoHtml: "",
    cuppingNotes: [
      "47mm コニカルと無段階調整の操作感が高評価になりやすい",
      "挽き心地の滑らかさを挙げるレビューが多い",
    ],
    caveats: [
      "重量・サイズは携帯より据え置き寄り",
      "価格帯はフラッグシップ級で予算との相談になりやすい",
    ],
  },
};

export const brands: Brand[] = [
  {
    slug: "comandante",
    nameJa: "コマンダンテ",
    nameEn: "Comandante",
    country: "ドイツ",
    blurb:
      "スペシャルティシーンで広く参照されるハンドミルの一角。C40 は味わいの再現性とブランド資産の両方で語られることが多いです。",
    flagshipIds: ["comandante-c40"],
    communityReviews: [
      {
        id: "c40-1",
        theme: "味の輪郭・甘み",
        summary:
          "同じ豆でも雑味が減り輪郭がはっきりする、という体験談がコミュニティで多く見られます。",
        tendency: "good",
      },
      {
        id: "c40-2",
        theme: "価格と納得感",
        summary:
          "初めての一台としては勇気が要る一方、長く使う前提では投資として妥当という意見が対立しがちです。",
        tendency: "mixed",
      },
      {
        id: "c40-3",
        theme: "エスプレッソ",
        summary:
          "可能だが専用ミルと比べると時間と腕前が要る、という声と、十分楽しめるという声が併存します。",
        tendency: "watch",
      },
    ],
  },
  {
    slug: "kinu",
    nameJa: "キヌ",
    nameEn: "Kinu",
    country: "ドイツ",
    blurb:
      "ベルリン発のハンドミル。M47 シリーズは大径コニカルと無段階微調整で知られ、コマンダンテと並ぶ高級手挽きとしてレビューやフォーラムで頻繁に比較されます。",
    flagshipIds: ["kinu-m47-classic"],
    communityReviews: [
      {
        id: "kn-1",
        theme: "挽き心地・トルク",
        summary:
          "浅煎りではやや重め、深煎りでは滑らか、といった豆依存のコメントと、一貫して滑らかだという評価が混在します。",
        tendency: "mixed",
      },
      {
        id: "kn-2",
        theme: "無段階調整の再現性",
        summary:
          "ダイヤルで微調整できる点は好評一方、日々の記録やマーキングがないと再現に迷うという実用面の指摘も見られます。",
        tendency: "mixed",
      },
      {
        id: "kn-3",
        theme: "携帯性と価格",
        summary:
          "据え置きメインのユーザーには納得感が高い一方、旅行用の第一候補としては重量・価格が壁になる声もあります。",
        tendency: "watch",
      },
    ],
  },
  {
    slug: "timemore",
    nameJa: "タイムモア",
    nameEn: "Timemore",
    country: "中国",
    blurb:
      "デザインと調整機構で知られる手挽きのブランドです。このサイトが先に勧めるのは栗子 S5 Pro（Chestnut S5 Pro）です。Chestnut X は、比較表に残している別モデルです。",
    flagshipIds: ["timemore-chestnut-s5-pro", "timemore-chestnut-x"],
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
    slug: "1zpresso",
    nameJa: "ワンゼットプレッソ",
    nameEn: "1Zpresso",
    country: "台湾",
    blurb:
      "大径バーと直感的な調整機構で支持を集める台湾発ブランド。K シリーズはエスプレッソ志向のユーザーレビューでも名前が上がりやすいです。",
    flagshipIds: ["1zpresso-k-ultra"],
    communityReviews: [
      {
        id: "1z-1",
        theme: "外ダイヤル調整",
        summary:
          "豆を入れたまま粒度を変えられる点が作業導線の改善として好評になることが多いです。",
        tendency: "good",
      },
      {
        id: "1z-2",
        theme: "挽き心地・トルク",
        summary:
          "浅煎りの硬い豆ではやや重い、深煎りでは滑らか、など豆依存のコメントが散見されます。",
        tendency: "mixed",
      },
      {
        id: "1z-3",
        theme: "製品ラインナップ",
        summary:
          "型番が多く、自分の抽出スタイルに合うモデル選びに迷う、という初心者向けの相談がフォーラムで目立ちます。",
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
