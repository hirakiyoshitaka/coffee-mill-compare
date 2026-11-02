import { hreflangOf, translationLocales, type TranslationLocale } from "@/lib/articles";

export const campingArticleSlugs = [
  "solo-camp-coffee-gear-best-3",
  "camp-burner-best-3",
  "camp-chair-best-3",
] as const;

export type CampingLocale = "ja" | TranslationLocale;

export function orderCamping<T extends { slug: string }>(articles: T[]): T[] {
  const rank = new Map<string, number>(campingArticleSlugs.map((slug, index) => [slug, index]));
  return [...articles].sort((a, b) => (rank.get(a.slug) ?? 99) - (rank.get(b.slug) ?? 99) || a.slug.localeCompare(b.slug));
}

export function campingHubPaths(): { locale: CampingLocale; href: string }[] {
  return [{ locale: "ja", href: "/camping/" }, ...translationLocales.map((locale) => ({ locale, href: `/${locale}/camping/` }))];
}

export function campingLanguages(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const path of campingHubPaths()) languages[hreflangOf[path.locale]] = path.href;
  languages["x-default"] = "/camping/";
  return languages;
}

export const campingHubCopy: Record<
  CampingLocale,
  { title: string; description: string; kicker: string; lead: string; note: string }
> = {
  ja: {
    title: "キャンプギア",
    description:
      "ソロキャンプのコーヒー道具、バーナー、チェアを、公式仕様のベスト3で比べるノート。編集部はこれらの製品を使っていません。口コミは要約で、価格は目安です。",
    kicker: "火のそばの道具を、役割で三つ",
    lead: "まだ静かな朝と、鍋が一つ乗る夜のために、最初の三本を置きました。一人のコーヒー、バーナー、チェアです。点数で競わせた順位ではなく、運ぶ重さと役割で並べています。",
    note: "編集部は掲載製品を使っていません。数値は2026年11月2日に確認したメーカー公式の公表値です。口コミ欄は、特定の投稿や星の転載ではなく、選ぶときに繰り返される論点の要約です。価格は目安で、購入リンクは広告です。",
  },
  en: {
    title: "Camping gear",
    description:
      "Best-3 notes for solo-camp coffee tools, camp stoves, and camp chairs. Specs are manufacturer figures checked on 2 November 2026. We have not used these products. Prices are guides.",
    kicker: "Three roles beside the fire",
    lead: "The first three notes are for a quiet morning and a single pot: coffee, a stove, and a chair. The order follows what you carry and what each item is for. It is not a scored contest.",
    note: "We have not used the products on these pages. Figures are manufacturer specifications checked on 2 November 2026. Review summaries are recurring buying questions, not copied posts or star ratings. Prices are guides, and purchase links are ads.",
  },
  "zh-tw": {
    title: "露營裝備",
    description:
      "以官方規格整理的一人露營咖啡器具、爐具、椅子推薦三件。編輯部沒有用過這些產品。評論是摘要，價格僅供參考。",
    kicker: "火旁邊的三個角色",
    lead: "先放三篇：一個人的早晨咖啡、一口鍋的爐具、能把背靠上去的椅子。順序看的是你要背多重、每件東西負責什麼，不是打分數。",
    note: "編輯部沒有使用過所列產品。數字是 2026 年 11 月 2 日對過的原廠公開規格。評論摘要整理的是選購時反覆出現的確認點，不是轉載某則留言或星等。價格僅供參考，購買連結為廣告。",
  },
  "zh-hk": {
    title: "露營裝備",
    description:
      "用官方規格整理的一人露營咖啡器具、爐具、椅子推介三件。編輯部未用過這些產品。評論是摘要，價錢只供參考。",
    kicker: "火旁邊的三個角色",
    lead: "先放三篇：一個人的早晨咖啡、一口鍋的爐具、可以靠背的椅子。次序看你要帶多重、每件負責什麼，而不是打分。",
    note: "編輯部未用過所列產品。數字是 2026 年 11 月 2 日核對的原廠公開規格。評論摘要整理選購時反覆出現的確認點，不是轉載某一則留言或星級。價錢只供參考，購買連結是廣告。",
  },
  "zh-cn": {
    title: "露营装备",
    description:
      "用官方规格整理的单人露营咖啡器具、炉具、椅子推荐三件。编辑部没有用过这些产品。评论是摘要，价格仅供参考。",
    kicker: "火边的三个角色",
    lead: "先放三篇：一个人的早晨咖啡、一口锅的炉子、能靠背的椅子。顺序看的是你要背多重、每件东西做什么，不是打分。",
    note: "编辑部没有使用过所列产品。数字是 2026 年 11 月 2 日核对过的厂商公开规格。评论摘要整理的是选购时反复出现的确认点，不是转载某一条留言或星级。价格仅供参考，购买链接是广告。",
  },
  ko: {
    title: "캠핑 기어",
    description:
      "솔로 캠핑 커피 도구, 버너, 의자를 제조사 공개 규격으로 정리한 베스트 3. 편집부는 이 제품을 쓰지 않았습니다. 리뷰는 요약이고 가격은 참고용입니다.",
    kicker: "불 옆의 세 가지 역할",
    lead: "처음 세 편은 조용한 아침과 냄비 하나 위한 것입니다. 커피, 버너, 의자. 순서는 점수가 아니라, 얼마나 들고 가는지와 각 도구의 역할입니다.",
    note: "편집부는 소개 제품을 사용하지 않았습니다. 수치는 2026년 11월 2일에 확인한 제조사 공개 규격입니다. 리뷰 요약은 고를 때 반복되는 확인 지점이며, 글이나 별점을 옮긴 것이 아닙니다. 가격은 참고용이고 구매 링크는 광고입니다.",
  },
  vi: {
    title: "Đồ cắm trại",
    description:
      "Ba bài best 3 cho cà phê, bếp và ghế cắm trại một người. Số liệu là thông số hãng, kiểm tra ngày 2 tháng 11 năm 2026. Ban biên tập chưa dùng các sản phẩm này. Giá chỉ để tham khảo.",
    kicker: "Ba vai trò bên lửa",
    lead: "Ba bài đầu dành cho buổi sáng yên và một nồi: cà phê, bếp, ghế. Thứ tự theo trọng lượng phải mang và việc từng món làm, không phải điểm số.",
    note: "Ban biên tập chưa dùng các sản phẩm này. Số liệu là thông số hãng đã kiểm tra ngày 2 tháng 11 năm 2026. Phần tóm tắt đánh giá là các điểm người mua hay phải kiểm tra, không phải chép lại bài viết hay số sao. Giá chỉ để tham khảo. Liên kết mua là quảng cáo.",
  },
  th: {
    title: "อุปกรณ์แคมป์ปิ้ง",
    description:
      "โน้ต 3 ชิ้นสำหรับอุปกรณ์ชงกาแฟ เตา และเก้าอี้แคมป์ปิ้งคนเดียว ตัวเลขเป็นสเปกผู้ผลิตที่ตรวจเมื่อ 2 พฤศจิกายน 2026 กองบรรณาธิการไม่ได้ใช้ของเหล่านี้ ราคาเป็นตัวเลขอ้างอิง",
    kicker: "สามบทบาทข้างกองไฟ",
    lead: "สามบทแรกสำหรับเช้าที่ยังเงียบและหม้อใบเดียว: กาแฟ เตา และเก้าอี้ ลำดับดูจากน้ำหนักที่ต้องแบกกับหน้าที่ของแต่ละชิ้น ไม่ใช่การให้คะแนน",
    note: "กองบรรณาธิการไม่ได้ใช้สินค้าในหน้านี้ ตัวเลขเป็นสเปกที่ผู้ผลิตเปิดเผยและตรวจเมื่อ 2 พฤศจิกายน 2026 สรุปรีวิวคือจุดที่คนซื้อมักต้องเช็กซ้ำ ไม่ใช่การคัดลอกโพสต์หรือดาว ราคาเป็นตัวเลขอ้างอิง ลิงก์ซื้อเป็นโฆษณา",
  },
};
