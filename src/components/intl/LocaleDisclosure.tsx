import type { Metadata } from "next";
import { LanguageSwitcher } from "@/components/intl/LanguageSwitcher";
import { getSiteUrl, siteConfig, localizedSiteName } from "@/data/site";
import { hreflangOf, translationLocales, type TranslationLocale } from "@/lib/articles";
import { chromeDict } from "@/lib/i18n";

type Section = { h: string; p: string[]; list?: string[] };
type Doc = { title: string; description: string; updated: string; sections: Section[] };

const programs = ["A8.net", "Rakuten Affiliate", "Amazon Associates (Amazon.co.jp)", "Yahoo! Shopping (ValueCommerce, etc.)", "Moshimo Affiliate"];

const docs: Record<TranslationLocale, Doc> = {
  "zh-tw": {
    title: "廣告揭露",
    description: "居家時光工具箱的聯盟行銷廣告、文章開頭的 PR 標示、排名與參考價格的原則。",
    updated: "最後更新",
    sections: [
      { h: "先告訴你：這裡有廣告", p: ["本站含廣告與聯盟行銷連結。", "繁體中文（台灣）頁面不放 Amazon 購買按鈕。已登錄的 Amazon 聯盟標籤只有日本的 tag=stocknotelife-22，海外用的 Amazon 標籤沒有收錄，所以不另造、也不把日本標籤放在這些頁面上。", "本站可能從商品購買連結獲得報酬。依照日本《景品表示法》的隱性行銷規範，我們會清楚標示廣告：文章本文前會寫「廣告（PR）」，標題上方也會顯示 PR，每頁頁尾也放有上面兩句。"] },
      { h: "哪些連結是廣告", p: ["前往樂天市場、A8.net 的購買連結，以及已收錄的 Shopee 馬來西亞連結，都是聯盟廣告。連結會加上 rel=\"sponsored noopener\" 與 target=\"_blank\"。沒有設定網址的商品，不會顯示購買按鈕。", "已參加或預計參加的計畫如下："], list: programs },
      { h: "排名不看報酬", p: ["文章的排序與推薦，不是依聯盟報酬高低決定，而是依用途、規格、參考價格，以及社群中反覆出現的評論重點整理。資料中沒有的風味分數或虛構的最低價，我們不寫。"] },
      { h: "價格僅供參考", p: ["金額為日本市場的「參考價格」（日圓），會因商店、促銷、匯率與廠商調價而變動，並非台灣售價。透過 AmazonGlobal 寄送時，運費與關稅會在結帳時顯示。實際金額以商店頁面為準。"] },
      { h: "評論的處理方式", p: ["評論欄不是轉載特定貼文或星等，而是編輯部整理論壇與評測中反覆出現的重點。"] },
      { h: "營運者", p: [`${siteConfig.operatorName}。聯絡方式：${siteConfig.contactEmail}`] },
    ],
  },
  "zh-hk": {
    title: "廣告披露",
    description: "居家時光工具箱的聯盟推廣廣告、文章開頭的 PR 標示，以及排名與參考價錢的原則。",
    updated: "最後更新",
    sections: [
      { h: "先行說明：本站含廣告", p: ["本站含廣告及聯盟推廣連結。", "本站為 Amazon 日本（Amazon.co.jp）的聯盟會員，透過合資格銷售賺取收入。", "本站或會從商品購買連結收取報酬。根據日本《景品表示法》對隱性營銷的規範，本站會清楚標示廣告：文章正文前會註明「廣告（PR）」，標題上方亦會顯示 PR，每頁頁尾均載有以上兩句。"] },
      { h: "哪些連結屬於廣告", p: ["前往樂天市場、Amazon、Yahoo!購物、A8.net 的購買連結，以及聯盟推廣用的 HTML，均屬聯盟廣告。連結會加上 rel=\"sponsored noopener\" 及 target=\"_blank\"。Amazon 商品連結附有聯盟標籤 tag=stocknotelife-22。商品相片本身亦可能是購買連結（Amazon）。未設定網址的商品，不會顯示購買按鈕。", "已參加或計劃參加的計劃如下："], list: programs },
      { h: "排名不以報酬決定", p: ["文章排序及推介並非按聯盟報酬高低決定，而是按用途、規格、參考價錢，以及社群中反覆出現的評論重點整理。資料中沒有的風味評分或虛構的最低價，本站一概不寫。"] },
      { h: "價錢僅供參考", p: ["金額為日本市場的「參考價錢」（日圓），會因商店、優惠、匯率及廠商調價而變動，並非香港售價。經 AmazonGlobal 寄送時，運費會在結帳時顯示。實際金額以商店頁面為準。"] },
      { h: "評論的處理方式", p: ["評論欄並非轉載特定帖文或星級，而是編輯部整理論壇及評測中反覆出現的重點。"] },
      { h: "營運者", p: [`${siteConfig.operatorName}。聯絡方法：${siteConfig.contactEmail}`] },
    ],
  },
  "zh-cn": {
    title: "广告说明",
    description: "居家时光工具箱如何标注联盟营销广告、文章开头的 PR，以及排序和参考价格的原则。",
    updated: "最后更新",
    sections: [
      { h: "先说清楚：本站有广告", p: ["本站含广告和联盟营销链接。", "本站是亚马逊日本（Amazon.co.jp）联盟会员，通过合格销售获得收入。", "本站可能从商品购买链接获得报酬。按照日本《景品表示法》对隐性营销的要求，广告会写在明处：正文前标注「广告（PR）」，标题上方也有 PR，每页页脚都有上面两句。"] },
      { h: "哪些链接是广告", p: ["前往乐天市场、Amazon、Yahoo!购物、A8.net 的购买链接，以及联盟营销用的 HTML，都是联盟广告。链接带有 rel=\"sponsored noopener\" 和 target=\"_blank\"。Amazon 商品链接附有联盟标签 tag=stocknotelife-22。商品图片本身也可能是购买链接（Amazon）。没有填写网址的商品，不显示购买按钮。", "已参加或计划参加的项目如下："], list: programs },
      { h: "排序不看报酬", p: ["文章的顺序和推荐不按联盟报酬高低决定，而是按用途、规格、参考价格，以及社区里反复出现的评价要点来整理。资料里没有的风味分数，或编造的最低价，本站不写。"] },
      { h: "价格只供参考", p: ["金额是日本市场的「参考价格」（日元），会随商店、促销、汇率和厂商调价变化，不是中国大陆零售价。通过 AmazonGlobal 寄送时，运费和关税显示在结算页。实际金额以商店页面为准。"] },
      { h: "评价怎么处理", p: ["评价栏不是转载某一条帖子或星级，而是编辑部归纳论坛和评测里反复出现的要点。"] },
      { h: "运营者", p: [`${siteConfig.operatorName}。联系方式：${siteConfig.contactEmail}`] },
    ],
  },
  ko: {
    title: "광고 고지",
    description: "집콕 시간의 도구상자의 제휴 광고, 글머리 PR 표시, 순위와 참고 가격에 대한 원칙입니다.",
    updated: "최종 업데이트",
    sections: [
      { h: "광고가 있다는 것을 먼저 알립니다", p: ["이 사이트에는 광고·제휴 마케팅 링크가 포함되어 있습니다.", "아마존 재팬(Amazon.co.jp) 어소시에이트로서 적격 판매를 통해 수익을 얻습니다.", "이 사이트는 상품 구매 링크를 통해 보수를 받을 수 있습니다. 일본 경품표시법의 스텔스 마케팅 규제에 따라 광고임을 알기 쉽게 표시합니다. 글 본문 앞에 「광고(PR)」를, 제목 위에도 PR을 표시하며, 모든 페이지 하단에 위 두 문장을 둡니다."] },
      { h: "어떤 링크가 광고인가", p: ["라쿠텐 시장, Amazon, Yahoo!쇼핑, A8.net으로 가는 구매 링크와 제휴용 HTML은 제휴 광고입니다. 링크에는 rel=\"sponsored noopener\"와 target=\"_blank\"를 붙입니다. Amazon 상품 링크에는 어소시에이트 태그 tag=stocknotelife-22가 붙습니다. 상품 사진 자체가 구매 링크(Amazon)인 경우도 있습니다. URL이 없는 상품에는 구매 버튼을 표시하지 않습니다.", "참여 중이거나 참여 예정인 프로그램은 다음과 같습니다."], list: programs },
      { h: "순위는 보수로 정하지 않습니다", p: ["글의 순서와 추천은 제휴 보수가 높은 순이 아닙니다. 용도, 사양, 참고 가격, 커뮤니티에서 반복되는 논점으로 정리합니다. 데이터에 없는 맛 점수나 가상의 최저가는 쓰지 않습니다."] },
      { h: "가격은 참고용입니다", p: ["금액은 일본 시장의 「참고 가격」(엔)이며 매장, 세일, 환율, 제조사 가격 변경에 따라 달라집니다. 한국 판매가가 아닙니다. AmazonGlobal 배송 시 배송비와 관세는 결제 화면에 표시됩니다. 실제 금액은 매장 페이지가 우선합니다."] },
      { h: "후기의 취급", p: ["후기란은 특정 게시물이나 별점을 옮긴 것이 아니라, 포럼과 리뷰에서 반복되는 논점을 편집부가 요약한 것입니다."] },
      { h: "운영", p: [`${siteConfig.operatorName}. 연락처: ${siteConfig.contactEmail}`] },
    ],
  },
  vi: {
    title: "Công bố quảng cáo",
    description: "Cách Hộp dụng cụ cho thời gian ở nhà ghi liên kết tiếp thị liên kết, nhãn PR đầu bài, thứ tự giới thiệu và giá tham khảo.",
    updated: "Cập nhật lần cuối",
    sections: [
      { h: "Nói trước: trang này có quảng cáo", p: ["Trang này có quảng cáo và liên kết tiếp thị liên kết.", "Là thành viên Amazon Associates của Amazon Nhật (Amazon.co.jp), chúng tôi nhận hoa hồng từ các đơn hàng đủ điều kiện.", "Trang có thể nhận thù lao từ liên kết mua hàng. Theo quy định của Nhật về quảng cáo trá hình (Luật Biểu thị giải thưởng, 景品表示法), quảng cáo được ghi rõ: trước phần thân bài có dòng 「Quảng cáo (PR)」, phía trên tiêu đề cũng có PR, và chân mỗi trang có hai câu trên."] },
      { h: "Liên kết nào là quảng cáo", p: ["Liên kết mua tới Rakuten, Amazon, Yahoo! Shopping, A8.net, cùng HTML dùng cho tiếp thị liên kết, đều là quảng cáo liên kết. Liên kết có rel=\"sponsored noopener\" và target=\"_blank\". Liên kết sản phẩm Amazon gắn thẻ liên kết tag=stocknotelife-22. Ảnh sản phẩm cũng có thể chính là liên kết mua (Amazon). Sản phẩm chưa có địa chỉ thì không hiện nút mua.", "Các chương trình đang tham gia hoặc dự định tham gia:"], list: programs },
      { h: "Thứ tự không theo thù lao", p: ["Thứ tự bài và phần giới thiệu không xếp theo mức thù lao liên kết. Trang sắp theo nhu cầu sử dụng, thông số, giá tham khảo, và những điểm được nhắc đi nhắc lại trong đánh giá công khai. Điểm hương vị không có trong dữ liệu, hoặc giá thấp nhất bịa ra, trang này không viết."] },
      { h: "Giá chỉ để tham khảo", p: ["Số tiền là 「giá tham khảo」 của thị trường Nhật (yên). Giá đổi theo cửa hàng, khuyến mãi, tỷ giá và lần điều chỉnh của hãng, không phải giá bán lẻ tại Việt Nam. Khi gửi qua AmazonGlobal, phí vận chuyển và thuế hiện ở trang thanh toán. Số tiền thực tế lấy theo trang cửa hàng."] },
      { h: "Cách xử lý đánh giá", p: ["Phần đánh giá không chép một bài đăng hay số sao cụ thể. Ban biên tập gom những điểm được nhắc đi nhắc lại trên diễn đàn và bài đánh giá. Trang chỉ viết trải nghiệm cá nhân với đồ đã thực sự dùng."] },
      { h: "Người vận hành", p: [`${siteConfig.operatorName}. Liên hệ: ${siteConfig.contactEmail}`] },
    ],
  },
  th: {
    title: "เปิดเผยโฆษณา",
    description: "กล่องเครื่องมือเวลาอยู่บ้านระบุโฆษณาพันธมิตรอย่างไร มีเครื่องหมาย PR ต้นบทความ และจัดลำดับกับราคาอ้างอิงด้วยหลักใด",
    updated: "อัปเดตล่าสุด",
    sections: [
      {
        h: "บอกก่อนว่าที่นี่มีโฆษณา",
        p: [
          "เว็บไซต์นี้มีโฆษณาและลิงก์พันธมิตร",
          "ในฐานะ Amazon Associates ของ Amazon.co.jp เว็บไซต์ได้รับรายได้จากการขายที่มีคุณสมบัติ",
          "เว็บไซต์อาจได้รับค่าตอบแทนจากลิงก์ซื้อสินค้า ตามหลักของกฎหมายญี่ปุ่นเรื่องการโฆษณาที่ปิดบัง เราจึงเขียนให้เห็นชัดว่าเป็นโฆษณา ก่อนเนื้อหาบทความมีข้อความ «โฆษณา (PR)» เหนือหัวข้อก็มี PR และท้ายทุกหน้ามีสองประโยคด้านบน",
        ],
      },
      {
        h: "ลิงก์แบบไหนคือโฆษณา",
        p: [
          "ลิงก์ซื้อที่ไปยัง Rakuten, Amazon, Yahoo! Shopping และ A8.net รวมถึง HTML สำหรับพันธมิตร เป็นโฆษณาพันธมิตร ลิงก์ใส่ rel=\"sponsored noopener\" และ target=\"_blank\" ลิงก์สินค้า Amazon มีแท็กพันธมิตร tag=stocknotelife-22 รูปสินค้าเองก็อาจเป็นลิงก์ซื้อ (Amazon) ลิงก์ Shopee มาเลเซียที่อยู่ในบัตรสินค้าแล้ว (ผ่าน Involve Asia) ก็เป็นโฆษณาเช่นกัน สินค้าที่ไม่ได้ใส่ URL จะไม่แสดงปุ่มซื้อ",
          "โปรแกรมที่เข้าร่วมอยู่หรือมีแผนจะเข้าร่วมมีดังนี้",
        ],
        list: [...programs, "Involve Asia (Shopee Malaysia)"],
      },
      {
        h: "ลำดับไม่ได้ดูจากค่าตอบแทน",
        p: [
          "ลำดับและการแนะนำในบทความไม่ได้เรียงตามค่าตอบแทนพันธมิตร แต่จัดจากงานที่ใช้ สเปก ราคาอ้างอิง และประเด็นที่โผล่ซ้ำในชุมชน เว็บนี้ไม่เขียนคะแนนรสชาติที่ไม่มีในข้อมูล และไม่แต่งราคาต่ำสุดขึ้นมา",
        ],
      },
      {
        h: "ราคาเป็นเพียงตัวเลขอ้างอิง",
        p: [
          "จำนวนเงินคือ «ราคาอ้างอิง» ของตลาดญี่ปุ่น (เยน) ซึ่งเปลี่ยนตามร้าน โปรโมชัน อัตราแลกเปลี่ยน และการปรับราคาของผู้ผลิต ไม่ใช่ราคาขายในไทย หากส่งผ่าน AmazonGlobal ค่าส่งและภาษีจะแสดงที่หน้าชำระเงิน จำนวนจริงให้ยึดหน้าร้าน",
        ],
      },
      {
        h: "รีวิวถูกจัดอย่างไร",
        p: [
          "ช่องรีวิวไม่ได้คัดลอกโพสต์หรือดาวดวงใดดวงหนึ่ง แต่เป็นประเด็นที่กองบรรณาธิการรวบจากฟอรัมและบททดสอบที่พูดซ้ำ ประสบการณ์ใช้จริงเขียนเฉพาะอุปกรณ์ที่ผู้ดูแลใช้เอง",
        ],
      },
      { h: "ผู้ดูแล", p: [`${siteConfig.operatorName} ติดต่อ ${siteConfig.contactEmail}`] },    ],
  },
  en: {
    title: "Advertising Disclosure",
    description: "How Ouchi Dougubako handles affiliate advertising, PR labels, rankings, and reference prices.",
    updated: "Last updated",
    sections: [
      { h: "Up front: this site has ads", p: ["This site contains ads and affiliate links.", "As an Amazon Associate, we earn from qualifying purchases. English pages link to Amazon.com (tag ouchidougub03-20), and Japanese pages link to Amazon.co.jp (tag stocknotelife-22). An Amazon.com buy button appears only for a model we have matched on Amazon.com.", "We may earn a commission from product links, at no extra cost to you. In line with Japan's rules on stealth marketing, every article is labeled as advertising before the main text, and a PR mark appears above the title."] },
      { h: "Which links are ads", p: ["Purchase links to Amazon.com, Rakuten, A8.net, and Shopee (via Involve Asia), where a URL is already on file, are affiliate links. They carry rel=\"sponsored noopener\" and open in a new tab. Products with no URL do not get a buy button.", "Programs we take part in or plan to join:"], list: [...programs, "Amazon Associates (Amazon.com)", "Involve Asia (Shopee Malaysia)"] },
      { h: "Rankings aren't for sale", p: ["Our order and recommendations are not based on commission rates. They are based on use case, specs, reference prices, and points that come up repeatedly in public reviews. We don't make up flavor scores or lowest prices."] },
      { h: "Prices are for reference", p: ["Prices are Japanese market estimates in yen unless stated otherwise. They change with stores, sales, exchange rates, and manufacturer price changes. Shipping, duties, and availability in your country are shown by the store at checkout."] },
      { h: "How we handle reviews", p: ["Review summaries condense points that come up repeatedly in forums and reviews; they are not copies of individual posts or star ratings. We only describe personal use for gear we actually use."] },
      { h: "Operator", p: [`${siteConfig.operatorName}. Contact: ${siteConfig.contactEmail}`] },
    ],
  },
};

export function disclosureLocalePaths() {
  return [{ locale: "ja" as const, href: "/disclosure/" }, ...translationLocales.map((l) => ({ locale: l, href: `/${l}/disclosure/` }))];
}

export function disclosureLanguages(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const p of disclosureLocalePaths()) languages[hreflangOf[p.locale]] = p.href;
  languages["x-default"] = "/disclosure/";
  return languages;
}

export function localeDisclosureMetadata(locale: TranslationLocale): Metadata {
  const doc = docs[locale];
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { absolute: `${doc.title}｜${localizedSiteName[locale]}` },
    description: doc.description,
    alternates: { canonical: `/${locale}/disclosure/`, languages: disclosureLanguages() },
    robots: { index: true, follow: true },
  };
}

export function LocaleDisclosure({ locale }: { locale: TranslationLocale }) {
  const doc = docs[locale];
  return (
    <main className="page-wrap page-narrow">
      <LanguageSwitcher current={locale} paths={disclosureLocalePaths()} label={chromeDict[locale].lang} />
      <h1 className="page-title">{doc.title}</h1>
      <p className="mt-3 text-sm text-stone-500">
        {doc.updated}: {siteConfig.legalUpdated}
      </p>
      <div className="article-body mt-8">
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((t) => (
              <p key={t}>{t}</p>
            ))}
            {s.list ? (
              <ul>
                {s.list.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
