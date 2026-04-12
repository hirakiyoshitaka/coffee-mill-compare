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
  type: GrinderType;
  burrMaterial: string;
  burrDiameterMm?: number;
  adjustment: string;
  weightGrams?: number;
  priceJpyHint: string;
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
    cuppingNotes: [
      "大径バーと外調整の使い勝手が支持されることが多い",
      "エスプレッソ寄りの細挽きにも挑戦しやすい設計",
    ],
    caveats: [
      "パーツ供給はブランド・世代で要確認",
      "外観はやや工業的と感じるユーザーも",
    ],
  },
  "epeios-essence-go": {
    id: "epeios-essence-go",
    brandSlug: "epeios",
    name: "EPEIOS Essence Go",
    shortLabel: "Essence Go",
    type: "manual",
    burrMaterial: "コニカル（10枚刃・38mm）",
    burrDiameterMm: 38,
    adjustment: "0〜80 段階",
    weightGrams: undefined,
    priceJpyHint: "公式・小売の表示価格帯を参照（発売時は約2万円台の案内あり）",
    cuppingNotes: [
      "バリスタ監修を前面に出した手挽きとして注目を集めたモデル",
      "携帯性とケース付属などライフスタイル訴求",
    ],
    caveats: [
      "ロングセラーブランドとの比較検証は個人の抽出環境に依存",
      "スペア・サポート体制は購入前に公式情報で要確認",
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
    slug: "timemore",
    nameJa: "タイムモア",
    nameEn: "Timemore",
    country: "中国",
    blurb:
      "デザイン性とスペックのバランスでグローバルに展開。Chestnut シリーズから X クラスまで幅があり、本サイトでは代表的フラッグシップとして Chestnut X を取り上げます。",
    flagshipIds: ["timemore-chestnut-x"],
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
      "調理・生活家電ブランドとして知られる EPEIOS。コーヒーでは Essence シリーズ（電動・手挽き・2WAY）を展開し、監修・デザインを強みに訴求しています。",
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

export const comparisonRows = [
  { key: "type", label: "駆動", get: (m: GrinderModel) => (m.type === "manual" ? "手動" : m.type === "electric" ? "電動" : "ハイブリッド") },
  { key: "burr", label: "バー", get: (m: GrinderModel) => m.burrMaterial },
  { key: "dia", label: "バー径（参考）", get: (m: GrinderModel) => (m.burrDiameterMm ? `${m.burrDiameterMm} mm` : "公表値要確認") },
  { key: "adj", label: "粒度調整", get: (m: GrinderModel) => m.adjustment },
  { key: "w", label: "重量（参考）", get: (m: GrinderModel) => (m.weightGrams ? `${m.weightGrams} g` : "—") },
  { key: "price", label: "価格の目安", get: (m: GrinderModel) => m.priceJpyHint },
] as const;
