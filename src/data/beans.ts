export const priceAsOfLabel = "2026年10月27日時点の紹介に基づく目安";

export type BeanOffer = {
  id: string;
  name: string;
  /** 金額がデータにあるときだけ。表示側で「目安」と時点を添える */
  priceHint?: string;
  note?: string;
};

export type BeanShop = {
  slug: string;
  name: string;
  area?: string;
  company?: string;
  officialUrl?: string;
  /** アフィリエイトではない、店の公開ページ */
  rakutenShopUrl?: string;
  /** A8.net などのアフィリエイトURL。空ならボタンを出さない */
  a8Url?: string;
  /** 楽天アフィリエイトURL。空ならボタンを出さない */
  rakutenUrl?: string;
  summary: string;
  story: string[];
  roasting: string[];
  selection: string[];
  offers: BeanOffer[];
  position: string;
  /** 運営者本人の購入体験。確認できた事実とは分けて書く */
  ownerExperience?: string[];
};

export const beanShops: BeanShop[] = [
  {
    slug: "coffee-carrot",
    name: "珈琲きゃろっと",
    area: "北海道・恵庭",
    officialUrl: "https://coffeecarrot.jp/",
    a8Url: "https://px.a8.net/svt/ejp?a8mat=4BEQHR+383JQQ+2CG0+5YJRM",
    rakutenUrl: "",
    summary: "注文を受けてから、国際的な資格を持つロースターが焙煎する店です。",
    ownerExperience: [
      "私は、珈琲きゃろっとの定期便「くるべさ」を1年ほど続けていました。",
      "続いた理由はシンプルで、本当に美味しかったからです。派手な感想より、この「1年続いた」という事実が一番正直な推薦だと思います。",
      "届いた銘柄の感想や、店主との会話は、ここには書きません。確認できた事実と、この体験だけを分けて置いています。",
    ],
    story: [
      "北海道・恵庭の珈琲きゃろっとです。確認できた範囲では、注文のあとで焙煎し、昨年販売した豆の平均は85点以上でした。",
      "上の体験は、運営者の購入の事実です。店主の発言の引用ではありません。",
    ],
    roasting: ["国際的な資格を持つロースターが、注文を受けてから焙煎します。"],
    selection: ["昨年販売した豆は、平均で85点以上でした。これからのロットが同じ点数だとは書いていません。"],
    offers: [
      {
        id: "trial-400",
        name: "お試し 400g（200g×2）",
        priceHint: "2,138円（カード）",
      },
      {
        id: "bag-200",
        name: "200g",
        priceHint: "2,220円〜",
      },
      {
        id: "kurubesa",
        name: "定期便「くるべさ」",
        priceHint: "4,990円〜",
        note: "配送は最低3回です。",
      },
    ],
    position: "このサイトで最初に開く店です。運営者自身が、定期便を1年ほど続けていた店です。",
  },
  {
    slug: "doi-coffee",
    name: "土居珈琲",
    area: "大阪・堺",
    officialUrl: "https://www.doicoffee.com/",
    rakutenShopUrl: "https://www.rakuten.co.jp/doicoffee/",
    a8Url: "",
    rakutenUrl: "",
    summary: "1971年から続く店で、注文ごとに生豆を小型の焙煎機で焙いています。",
    story: [
      "大阪・堺の土居珈琲です。1971年に始まっています。注文のたびに、生豆から小型の焙煎機で焙煎します。",
      "創業者の氏名や言葉は、このサイトの材料にないので書いていません。",
    ],
    roasting: ["注文ごとに、生豆の状態から小型の焙煎機で焙煎します。"],
    selection: [
      "豆は農園単位で選ばれています。例として挙がっているのは、グァテマラのカペティロ農園と、ハワイコナです。この2つだけを扱っている、とは書いていません。",
    ],
    offers: [
      {
        id: "trial",
        name: "お試しセット",
        note: "お試しセットはあります。中身と金額は、このサイトの掲載データにはありません。",
      },
    ],
    position: "農園の名前まで見てから頼みたいときの候補です。楽天にも店舗ページがあります。",
  },
  {
    slug: "leo-specialty-coffee",
    name: "LEO SPECIALTY COFFEE",
    officialUrl: "https://leo-specialty-coffee.com/",
    a8Url: "",
    rakutenUrl: "",
    summary: "国際資格のコーヒーグレーダーが豆を選び、欠点豆を手で除いてから届ける店です。",
    story: [
      "LEO SPECIALTY COFFEE です。所在地は、このサイトの材料にはありません。",
      "豆の選定は、国際的な資格を持つコーヒーグレーダー（Qグレーダーにあたる資格）が行っています。",
    ],
    roasting: ["欠点豆は、焙煎の前と、焙煎の後に、手で摘みます。発送は焙煎から1週間以内です。"],
    selection: ["選ぶ人は、国際的な資格を持つコーヒーグレーダー（Qグレーダーにあたる資格）です。"],
    offers: [
      {
        id: "subscription-300",
        name: "定期便 300g",
        priceHint: "4,980円",
        note: "毎月、異なる豆が2種類です。300gが合計か1種類分かは、掲載データには書いてありません。",
      },
    ],
    position: "毎月2種類を飲み比べたい定期便として紹介できます。",
  },
  {
    slug: "lab-cafe",
    name: "ラボカフェ",
    company: "株式会社オークス",
    a8Url: "",
    rakutenUrl: "",
    summary: "注文のあとで焙煎し、AIの味診断で豆を選ぶ店です。定期便もあります。",
    story: [
      "ラボカフェは、株式会社オークスが扱っています。公式サイトのURLは、この紹介には載せていません。",
      "注文を受けてから焙煎します。どの豆にするかは、AIによる味の診断で決まります。",
    ],
    roasting: ["注文のあとで焙煎します。"],
    selection: ["豆は、AIによる味の診断で選びます。診断の質問項目や、使っているシステムの名前は載せていません。"],
    offers: [
      {
        id: "subscription",
        name: "定期便",
        note: "定期便はあります。金額と量は、掲載データにありません。",
      },
    ],
    position: "自分で銘柄を決める前に、味の診断で一袋を決めたい人向けの紹介です。",
  },
  {
    slug: "sawai-coffee",
    name: "澤井珈琲",
    area: "鳥取",
    rakutenShopUrl: "https://www.rakuten.co.jp/sawaicoffee-tea/",
    a8Url: "",
    rakutenUrl: "",
    summary: "量が多く、お試しの入口が低い、たっぷり飲む人向けの店です。",
    story: [
      "鳥取の澤井珈琲です。楽天の店舗ページがあり、楽天グルメ大賞を受けています。受賞年は、このサイトの材料にはありません。",
      "紹介時点の公開表示として、レビューの平均は4.81、件数は約29万件です。当サイトが件数を数え直した数字ではありません。",
    ],
    roasting: ["焙煎のタイミングや焙煎機の大きさは、この紹介の材料にありません。"],
    selection: ["銘柄の選び方の詳細は載せていません。袋の量が多く、価格を抑えやすい売り方です。"],
    offers: [
      {
        id: "trial",
        name: "お試し",
        priceHint: "1,000円〜",
        note: "量の多い袋もあります。たっぷり飲む人向け、という位置づけです。",
      },
    ],
    position: "毎日の杯数が多い人が、まず小さく試す入口として開けます。",
  },
];

export function getBeanShop(slug: string): BeanShop | undefined {
  return beanShops.find((shop) => shop.slug === slug);
}
