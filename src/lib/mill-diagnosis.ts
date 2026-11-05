import { getModel, type GrinderModel } from "@/data/grinders";
import { isJpTaggedAmazonUrl } from "@/lib/affiliate";

/**
 * ミル選びの診断。
 * ブラウザ内の対応表だけで1台に決める。AI は使わない。
 * 候補は、公開中の記事と、既にある Amazon リンク（tag=stocknotelife-22）がある手挽きだけ。
 * 売り切れの栗子 S5 Pro は入れない。
 * 栗子 S3 は個別記事と Amazon の商品ページ（ASIN B0CMZCK9PR）があるので候補に入れる。
 */

export const diagnosisPath = "/mill-diagnosis/";

export type Cups = "one" | "twoThree" | "fourPlus";
export type Place = "home" | "both" | "out";
export type Budget = "known" | "role" | "spendOk";
export type Noise = "quiet" | "compact" | "counter";
export type Effort = "enjoy" | "light" | "espresso";

export type Answers = {
  cups: Cups;
  place: Place;
  budget: Budget;
  noise: Noise;
  effort: Effort;
};

export type AnswerKey = keyof Answers;

export type Choice<T extends string> = {
  value: T;
  label: string;
};

export type Question = {
  key: AnswerKey;
  prompt: string;
  choices: readonly Choice<string>[];
};

export const diagnosisQuestions: readonly Question[] = [
  {
    key: "cups",
    prompt: "1日に、何杯くらい飲みますか",
    choices: [
      { value: "one", label: "1杯" },
      { value: "twoThree", label: "2〜3杯" },
      { value: "fourPlus", label: "4杯以上" },
    ],
  },
  {
    key: "place",
    prompt: "どこで淹れますか",
    choices: [
      { value: "home", label: "家のキッチンだけ" },
      { value: "both", label: "家と、持ち出す日がある" },
      { value: "out", label: "外で淹れることが多い" },
    ],
  },
  {
    key: "budget",
    prompt: "予算の感じに近いものはどれですか",
    choices: [
      { value: "known", label: "サイトに円の目安がある機種でよい" },
      { value: "role", label: "金額より、役割が分かれていればよい" },
      { value: "spendOk", label: "高くても、長く置く一台でよい" },
    ],
  },
  {
    key: "noise",
    prompt: "音と、置く場所はどれに近いですか",
    choices: [
      { value: "quiet", label: "朝、機械の音は出したくない" },
      { value: "compact", label: "しまう場所は小さい方がよい" },
      { value: "counter", label: "音は気にしない。カウンターに置いたままでよい" },
    ],
  },
  {
    key: "effort",
    prompt: "挽くときの手間は、どれに近いですか",
    choices: [
      { value: "enjoy", label: "挽く時間も、ドリップの楽しみ" },
      { value: "light", label: "回す力は軽い方がよい" },
      { value: "espresso", label: "エスプレッソまで、目盛りを細かく残したい" },
    ],
  },
];

export type ProductId = "chestnut-s3" | "essence-go" | "q2" | "x-ultra" | "zp6" | "k-ultra" | "j-ultra" | "c40";

export type DiagnosisModelId = "timemore-chestnut-s3" | "epeios-essence-go";

export type DiagnosisProduct = {
  id: ProductId;
  name: string;
  /** 一人称を書いてよいのは栗子 S3 と Essence Go だけ。ほかはレビューまとめ。 */
  voice: "owner-line" | "review-summary";
  summary: string;
  specs: readonly string[];
  articleHref: string;
  articleLabel: string;
  /** model のときは grinders.ts の既存リンクを出す。search は記事にある検索 URL。 */
  buy:
    | { kind: "model"; modelId: DiagnosisModelId }
    | { kind: "search"; href: string };
};

const searchNote =
  "このボタンは、サイトに既にある Amazon の検索リンクです。検索結果には別の型番が混ざります。商品名と在庫は、開いたページで確認してください。在庫ありとは書いていません。";

export const diagnosisProducts: Record<ProductId, DiagnosisProduct> = {
  "chestnut-s3": {
    id: "chestnut-s3",
    name: "タイムモア栗子 S3",
    voice: "owner-line",
    summary:
      "運営者がふだん使っています。1回に約30gを挽き、2〜3杯分です。色、重さ、挽く時間の感想は書いていません。",
    specs: [
      "刃は S2C890。米国公式は、材質 SUS420、加工は 6軸 CNC、硬度は 58HRC、と書いています",
      "調整は外ダイヤル。米国公式の S3 のページは 0.015mm/grid。S5 Pro の比較表では、S3 を 0.015mm/click、90 clicks/rotation としています",
      "ゼロのときの刃のすき間は 0.075mm、と米国公式の注記にあります",
      "米国公式のクリックの目安は、エスプレッソ 1–15、モカ 5–20、プアオーバー 50–80、フレンチプレス 80–90 です",
      "ハンドルは折りたたみです。重量の数字は、2026年11月4日の公式商品ページ本文では確認できませんでした",
      "日本公式は 2026年11月4日に ¥26,000 と ¥22,800 を併記。表示は変わります",
    ],
    articleHref: "/articles/timemore-chestnut-s3/",
    articleLabel: "タイムモア栗子 S3 の記事",
    buy: { kind: "model", modelId: "timemore-chestnut-s3" },
  },
  "essence-go": {
    id: "essence-go",
    name: "エペイオス Essence Go",
    voice: "owner-line",
    summary:
      "運営者が書いている一言は「とにかく軽く回る」です。公式は、38mm・10枚刃で挽きはじめの軽さを狙い、分解して専用ケースに入る、と説明しています。それ以外の使用感は足していません。",
    specs: [
      "刃はステンレスのコニカル。外刃 38mm、10枚刃",
      "挽き目は 0〜80 段階。外側で目盛りを見る、と公式が説明しています",
      "重量は約 870g",
      "ホッパー容量は最大約 30g、と公式が説明しています",
      "本体は幅 6.5cm×高さ 19cm、ハンドル 12.5cm、と公式が説明しています",
      "価格の目安は ¥23,100（税込・公式掲載を基準としたサイト内固定値／改定は手動更新）",
    ],
    articleHref: "/articles/epeios-essence-go/",
    articleLabel: "エペイオス Essence Go の記事",
    buy: { kind: "model", modelId: "epeios-essence-go" },
  },
  q2: {
    id: "q2",
    name: "1Zpresso Q2",
    voice: "review-summary",
    summary:
      "レビューまとめです。運営者は 1Zpresso を使っていません。数字は、2026年10月31日に開いた公式ページの表示を、選び方の記事へ転記したものです。",
    specs: [
      "公式は Q Series を、ラインナップで小さく軽い旅行向けとしています",
      "折りたたみハンドルが要るのは Q2 S。公式の表では 465g、容量 15–20g",
      "調整は内側。Q Series は 1回転 30 クリック、1クリック 0.025mm",
      "ドリップ向けの小さい刃、という公式の位置づけです",
      "円の価格は、選び方の記事には書いていません",
    ],
    articleHref: "/articles/1zpresso-hand-grinder-lineup/",
    articleLabel: "1Zpresso の選び方（Q の節）",
    buy: { kind: "search", href: "https://www.amazon.co.jp/s?tag=stocknotelife-22&k=1Zpresso+Q2" },
  },
  "x-ultra": {
    id: "x-ultra",
    name: "1Zpresso X-Ultra",
    voice: "review-summary",
    summary:
      "レビューまとめです。運営者は使っていません。味の飲み比べは、このサイトにはありません。数字は公式ページの表示です。",
    specs: [
      "公式は、小さめの七角刃で、ドリップとエスプレッソの両方、としています",
      "重量 590g。容量 25–30g。折りたたみハンドルとマグネットの受けカップ",
      "調整は外側。1クリック 12.5 ミクロン",
      "公式は、小さめの刃なので力が要りにくい、と説明しています。当サイトが力を測った数字ではありません",
      "円の価格は、選び方の記事には書いていません",
    ],
    articleHref: "/articles/1zpresso-hand-grinder-lineup/",
    articleLabel: "1Zpresso の選び方（X-Ultra の節）",
    buy: { kind: "search", href: "https://www.amazon.co.jp/s?tag=stocknotelife-22&k=1Zpresso+X-Ultra" },
  },
  zp6: {
    id: "zp6",
    name: "1Zpresso ZP6 Special",
    voice: "review-summary",
    summary:
      "レビューまとめです。運営者は使っていません。ドリップ向け、という置き方は公式の説明です。",
    specs: [
      "刃は 48mm の六角ステンレス。公式は、ほかの 1Zpresso より微粉が少ないドリップ向け、と説明しています",
      "調整は外側。1回転 90 クリック、1クリック 22 ミクロン",
      "容量 30–35g。重量 700g",
      "円の価格は、選び方の記事には書いていません",
    ],
    articleHref: "/articles/1zpresso-hand-grinder-lineup/",
    articleLabel: "1Zpresso の選び方（ZP6 Special の節）",
    buy: { kind: "search", href: "https://www.amazon.co.jp/s?tag=stocknotelife-22&k=1Zpresso+ZP6" },
  },
  "k-ultra": {
    id: "k-ultra",
    name: "1Zpresso K-Ultra",
    voice: "review-summary",
    summary:
      "レビューまとめです。運営者は使っていません。一台で抽出方法をまたぐ、という位置づけは公式の説明です。",
    specs: [
      "公式はオールメソッド向けに置いています。刃は七角",
      "調整は外側。1回転 100 クリック、1クリック 20 ミクロン（0.02mm）",
      "容量 35–40g。重量 700g",
      "刃の径のミリ数は、2026年10月31日に開いた商品ページにはありませんでした",
      "円の価格は、選び方の記事には書いていません",
    ],
    articleHref: "/articles/1zpresso-hand-grinder-lineup/",
    articleLabel: "1Zpresso の選び方（K-Ultra の節）",
    buy: { kind: "search", href: "https://www.amazon.co.jp/s?tag=stocknotelife-22&k=1Zpresso+K-Ultra" },
  },
  "j-ultra": {
    id: "j-ultra",
    name: "1Zpresso J-Ultra",
    voice: "review-summary",
    summary:
      "レビューまとめです。運営者は使っていません。推奨クリック番号は、選び方の記事でも転記していません。手挽きでふだんショットを挽く負担は、刻みが細かくても残る、と選び方の記事に書いてあります。",
    specs: [
      "公式は、1Zpresso でいちばん細かい 8 ミクロン刻みのエスプレッソ向け、としています",
      "刃はコーティングした 48mm。調整は外側",
      "容量 35–40g。重量 670g。受けはマグネット",
      "円の価格は、選び方の記事には書いていません",
    ],
    articleHref: "/articles/1zpresso-hand-grinder-lineup/",
    articleLabel: "1Zpresso の選び方（J-Ultra の節）",
    buy: { kind: "search", href: "https://www.amazon.co.jp/s?tag=stocknotelife-22&k=1Zpresso+J-Ultra" },
  },
  c40: {
    id: "c40",
    name: "コマンダンテ C40 MK4",
    voice: "review-summary",
    summary:
      "レビューまとめです。運営者はコマンダンテ C40 を使っていません。回した感じも、手に取った重さも書いていません。公式ページから整理した内容だけです。比較記事には栗子 S5 Pro も出ます。この診断が勧めるのは C40 です。S5 Pro は売り切れのため候補にしていません。",
    specs: [
      "商品ページは、ドイツ製で、刃は高窒素合金の Nitro Blade だと説明しています",
      "公式は、摩耗に強く、手入れが少ない、とも書いています",
      "調整は底の三つ足ダイヤルです。刃が触れる位置をゼロにして、開いたクリック数を数えます",
      "付属のジャーは、ガラスとポリマーが各1つで、それぞれ 40g",
      "2026年10月31日に開いた公式商品ページには、グラム数も、円の価格もありませんでした",
    ],
    articleHref: "/articles/comandante-c40-vs-timemore/",
    articleLabel: "コマンダンテ C40 と栗子 S5 Pro の比較",
    buy: {
      kind: "search",
      href: "https://www.amazon.co.jp/s?tag=stocknotelife-22&k=%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%80%E3%83%B3%E3%83%86+C40",
    },
  },
};

export function buyLinkNote(product: DiagnosisProduct): string {
  if (product.buy.kind === "search") return searchNote;
  return "在庫と価格は、開いた販売ページで確認してください。ボタンは、データに入っている購入リンクだけです。";
}

export type DiagnosisRule = {
  id: string;
  /** 対応表に出す条件。先の行に当てはまったら、後の行は見ません。 */
  when: string;
  productId: ProductId;
  reason: string;
  matches: (answers: Answers) => boolean;
};

const travel = (answers: Answers) => answers.place === "out" || answers.noise === "compact";

export const diagnosisRules: readonly DiagnosisRule[] = [
  {
    id: "light-essence",
    when: "手間が「回す力は軽い方がよい」",
    productId: "essence-go",
    reason:
      "回す力を軽くしたい、という回答です。Essence Go は、公式が 10 枚刃で挽きはじめを軽くしたと説明している手挽きです。専用ケースに入る、という説明も公式のものです。",
    matches: (answers) => answers.effort === "light",
  },
  {
    id: "travel-espresso-x",
    when: "手間が軽さ以外で、場所が「外が多い」か、音と場所が「しまう場所を小さく」、かつ手間が「エスプレッソまで目盛りを残したい」",
    productId: "x-ultra",
    reason:
      "持ち出しや、小さい収納を先にして、エスプレッソまで目盛りを残したい、という回答です。公式は X-Ultra を、外側の調整でドリップとエスプレッソの両方、容量 25–30g、としています。",
    matches: (answers) => answers.effort !== "light" && travel(answers) && answers.effort === "espresso",
  },
  {
    id: "travel-volume-x",
    when: "手間が軽さでもエスプレッソでもなく、場所が「外が多い」か「しまう場所を小さく」、かつ杯数が 4 杯以上",
    productId: "x-ultra",
    reason:
      "持ち出しや、小さい収納を先にして、1日 4 杯以上、という回答です。Q2 の公式容量は 15–20g なので、容量 25–30g の X-Ultra にしています。",
    matches: (answers) =>
      answers.effort !== "light" && travel(answers) && answers.effort !== "espresso" && answers.cups === "fourPlus",
  },
  {
    id: "travel-q2",
    when: "手間が軽さでもエスプレッソでもなく、場所が「外が多い」か「しまう場所を小さく」、かつ杯数が 4 杯未満",
    productId: "q2",
    reason:
      "外で淹れるか、しまう場所を小さくしたい、という回答で、杯数は 4 杯未満です。公式は Q2 S を、折りたたみハンドルの旅行サイズ（465g、容量 15–20g）としています。",
    matches: (answers) =>
      answers.effort !== "light" && travel(answers) && answers.effort !== "espresso" && answers.cups !== "fourPlus",
  },
  {
    id: "espresso-both-x",
    when: "持ち出し専用でも小さい収納でもなく、場所が「家と持ち出し」、手間が「エスプレッソまで目盛りを残したい」",
    productId: "x-ultra",
    reason:
      "家と持ち出しの両方で、エスプレッソまで目盛りを残したい、という回答です。公式は X-Ultra を、外側調整でドリップとエスプレッソ、重量 590g、としています。",
    matches: (answers) => !travel(answers) && answers.effort === "espresso" && answers.place === "both",
  },
  {
    id: "espresso-home-j",
    when: "持ち出し専用でも小さい収納でもなく、場所が「家だけ」、手間が「エスプレッソまで目盛りを残したい」",
    productId: "j-ultra",
    reason:
      "家で、エスプレッソまで細かい目盛りを残したい、という回答です。公式は J-Ultra を、1Zpresso でいちばん細かい 8 ミクロン刻みのエスプレッソ向けとしています。",
    matches: (answers) => !travel(answers) && answers.effort === "espresso" && answers.place === "home",
  },
  {
    id: "four-k",
    when: "軽さ・持ち出し・小さい収納・エスプレッソ専用のどれでもなく、杯数が 4 杯以上",
    productId: "k-ultra",
    reason:
      "1日 4 杯以上で、持ち出し専用でも、しまう場所の小ささでもない、という回答です。公式は K-Ultra を、抽出方法をまたぐ刃、容量 35–40g、としています。",
    matches: (answers) => !travel(answers) && answers.effort === "enjoy" && answers.cups === "fourPlus",
  },
  {
    id: "known-price-s3",
    when: "上に当てはまらず、場所が「家だけ」、予算が「サイトに円の目安がある機種でよい」、杯数が 4 杯未満、手間がドリップ",
    productId: "chestnut-s3",
    reason:
      "家で使い、円の目安がサイトにある機種でよい、という回答です。家に置く一台として先に勧めているのは栗子 S3 です。日本公式は 2026年11月4日に ¥26,000 と ¥22,800 を併記しています。表示は変わります。",
    matches: (answers) =>
      !travel(answers) &&
      answers.effort === "enjoy" &&
      answers.cups !== "fourPlus" &&
      answers.place === "home" &&
      answers.budget === "known",
  },
  {
    id: "counter-c40",
    when: "上に当てはまらず、場所が「家だけ」、音と場所が「カウンターに置いたまま」、予算が「高くても長く置く」、杯数が 4 杯未満、手間がドリップ",
    productId: "c40",
    reason:
      "家のカウンターに置き、高くても長く置く一台で、ドリップの時間を楽しみたい、という回答です。C40 MK4 は、公式がドイツ製の Nitro Blade と説明している手挽きです。使用感の記録はありません。",
    matches: (answers) =>
      !travel(answers) &&
      answers.effort === "enjoy" &&
      answers.cups !== "fourPlus" &&
      answers.place === "home" &&
      answers.budget === "spendOk" &&
      answers.noise === "counter",
  },
  {
    id: "both-x",
    when: "上に当てはまらず、場所が「家と持ち出し」、杯数が 4 杯未満、手間がドリップ",
    productId: "x-ultra",
    reason:
      "家と持ち出しの両方で、ドリップを手挽きしたい、という回答です。公式は X-Ultra を 590g、折りたたみハンドル、容量 25–30g、としています。",
    matches: (answers) =>
      !travel(answers) && answers.effort === "enjoy" && answers.cups !== "fourPlus" && answers.place === "both",
  },
  {
    id: "home-drip-zp6",
    when: "上のどれにも当てはまらない（家でドリップを手挽きし、杯数は 4 杯未満）",
    productId: "zp6",
    reason:
      "家でドリップを手挽きする、という回答です。公式は ZP6 Special を、ほかの 1Zpresso より微粉が少ないドリップ向け、容量 30–35g、としています。",
    matches: (answers) =>
      !travel(answers) &&
      answers.effort === "enjoy" &&
      answers.cups !== "fourPlus" &&
      answers.place === "home" &&
      answers.budget !== "known" &&
      !(answers.budget === "spendOk" && answers.noise === "counter"),
  },
];

export type DiagnosisResult = {
  rule: DiagnosisRule;
  product: DiagnosisProduct;
};

export function recommendMill(answers: Answers): DiagnosisResult {
  const hits = diagnosisRules.filter((rule) => rule.matches(answers));
  if (hits.length !== 1) {
    throw new Error(`診断の対応が1行に決まりません（${hits.map((rule) => rule.id).join(",")}）`);
  }
  const rule = hits[0];
  return { rule, product: diagnosisProducts[rule.productId] };
}

export function isCompleteAnswers(value: Partial<Answers>): value is Answers {
  return diagnosisQuestions.every((question) => {
    const picked = value[question.key];
    return question.choices.some((choice) => choice.value === picked);
  });
}

export function choiceLabel(key: AnswerKey, value: string): string {
  const question = diagnosisQuestions.find((item) => item.key === key);
  return question?.choices.find((choice) => choice.value === value)?.label ?? value;
}

const soldOutAsin = "B0HF4LXCCY";

export function diagnosisModel(modelId: DiagnosisModelId): GrinderModel {
  const model = getModel(modelId);
  if (!model) throw new Error(`${modelId} がミルのデータにありません`);
  return model;
}

export function diagnosisArticleSlugs(): string[] {
  return [...new Set(Object.values(diagnosisProducts).map((product) => product.articleHref.split("/").filter(Boolean).at(-1) ?? ""))];
}

/** ビルド時に、全組み合わせが1台へ決まり、売り切れの S5 Pro を出さないことを確認する。 */
export function assertMillDiagnosis(): Record<ProductId, number> {
  const cups: Cups[] = ["one", "twoThree", "fourPlus"];
  const places: Place[] = ["home", "both", "out"];
  const budgets: Budget[] = ["known", "role", "spendOk"];
  const noises: Noise[] = ["quiet", "compact", "counter"];
  const efforts: Effort[] = ["enjoy", "light", "espresso"];
  const counts: Record<ProductId, number> = {
    "chestnut-s3": 0,
    "essence-go": 0,
    q2: 0,
    "x-ultra": 0,
    zp6: 0,
    "k-ultra": 0,
    "j-ultra": 0,
    c40: 0,
  };

  for (const cup of cups) {
    for (const place of places) {
      for (const budget of budgets) {
        for (const noise of noises) {
          for (const effort of efforts) {
            const result = recommendMill({ cups: cup, place, budget, noise, effort });
            counts[result.product.id] += 1;
          }
        }
      }
    }
  }

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  if (total !== 3 ** 5) {
    throw new Error(`診断の組み合わせが ${total} 件です。243 件である必要があります`);
  }
  for (const [id, count] of Object.entries(counts)) {
    if (count === 0) throw new Error(`診断の候補 ${id} に到達する回答がありません`);
  }

  for (const product of Object.values(diagnosisProducts)) {
    if (product.id.includes("s5") || product.name.includes("S5")) {
      throw new Error("売り切れの栗子 S5 Pro が診断の候補に入っています");
    }
    if (product.buy.kind === "model") {
      const model = diagnosisModel(product.buy.modelId);
      const amazonUrl = model.amazonUrl ?? "";
      if (!isJpTaggedAmazonUrl(amazonUrl)) {
        throw new Error(`${product.name} の Amazon リンクに tag=stocknotelife-22 がありません`);
      }
      if (amazonUrl.includes(soldOutAsin) || model.id.includes("s5")) {
        throw new Error("売り切れの栗子 S5 Pro が診断の候補に入っています");
      }
    }
    if (product.buy.kind === "search") {
      if (!isJpTaggedAmazonUrl(product.buy.href)) {
        throw new Error(`${product.name} の Amazon リンクに tag=stocknotelife-22 がありません`);
      }
      if (product.buy.href.includes(soldOutAsin)) {
        throw new Error(`${product.name} のリンクが栗子 S5 Pro の商品ページです`);
      }
    }
    if (product.voice === "owner-line" && product.id !== "essence-go" && product.id !== "chestnut-s3") {
      throw new Error("一人称を書いてよい診断候補は栗子 S3 と Essence Go だけです");
    }
  }

  return counts;
}
