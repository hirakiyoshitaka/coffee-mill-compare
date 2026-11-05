import type { TranslationLocale } from "@/lib/articles";
import type { GrinderModel, GrinderType } from "@/data/grinders";

/** 翻訳ページの商品カード用テキスト。未設定の項目は日本語にフォールバックする */
export type GrinderText = Partial<
  Pick<GrinderModel, "name" | "imageAlt" | "burrMaterial" | "adjustment" | "priceJpyHint" | "highlight" | "purchaseNote" | "cuppingNotes" | "caveats">
>;

export const grinderTexts: Record<string, Partial<Record<TranslationLocale, GrinderText>>> = {
  "timemore-chestnut-s3": {
    "zh-tw": {
      name: "TIMEMORE 栗子 S3",
      burrMaterial: "S2C890（官方產品頁為 SUS420、六軸 CNC、硬度 58HRC）",
      adjustment: "外部調節環。官方產品頁為每格 0.015mm",
      priceJpyHint: "這裡不抄日圓定價。2026年11月4日在 Amazon.co.jp 的商品頁確認有貨（顯示價格會變）",
      highlight: "站長平常在用的手搖磨豆機。一次大約磨 30g，做 2–3 杯。",
      purchaseNote: "這是 Amazon.co.jp 上栗子 S3 的商品頁。請確認商品名是栗子 S3。",
      cuppingNotes: ["站長平常在用的手搖磨豆機", "一次大約 30g，做 2–3 杯"],
      caveats: ["沒有寫味道分數，也沒有寫研磨時間的實測", "官方產品頁寫零點的刀盤間隙為 0.075mm（2026年11月4日，timemore.com）"],
    },
    "zh-hk": {
      name: "TIMEMORE 栗子 S3",
      burrMaterial: "S2C890（官方產品頁為 SUS420、六軸 CNC、硬度 58HRC）",
      adjustment: "外置調節環。官方產品頁為每格 0.015mm",
      priceJpyHint: "這裡不抄日圓定價。2026年11月4日在 Amazon.co.jp 的商品頁確認有貨（顯示價格會變）",
      highlight: "站長平常在用的手磨。一次大約磨 30g，做 2–3 杯。",
      purchaseNote: "這是 Amazon.co.jp 上栗子 S3 的商品頁。請確認商品名是栗子 S3。",
      cuppingNotes: ["站長平常在用的手磨", "一次大約 30g，做 2–3 杯"],
      caveats: ["沒有寫味道分數，也沒有寫研磨時間的實測", "官方產品頁寫歸零時刀盤間隙為 0.075mm（2026年11月4日，timemore.com）"],
    },
    "zh-cn": {
      name: "TIMEMORE 栗子 S3",
      burrMaterial: "S2C890（官方产品页为 SUS420、六轴 CNC、硬度 58HRC）",
      adjustment: "外部调节环。官方产品页为每格 0.015mm",
      priceJpyHint: "这里不抄日元定价。2026年11月4日在 Amazon.co.jp 的商品页确认有货（显示价格会变）",
      highlight: "站长平时在用的手摇磨豆机。一次大约磨 30g，做 2–3 杯。",
      purchaseNote: "这是 Amazon.co.jp 上栗子 S3 的商品页。请确认商品名是栗子 S3。",
      cuppingNotes: ["站长平时在用的手摇磨豆机", "一次大约 30g，做 2–3 杯"],
      caveats: ["没有写味道分数，也没有写研磨时间的实测", "官方产品页写零点的刀盘间隙为 0.075mm（2026年11月4日，timemore.com）"],
    },
    ko: {
      name: "TIMEMORE 밤(栗子) S3",
      burrMaterial: "S2C890(공식 제품 페이지는 SUS420, 6축 CNC, 경도 58HRC)",
      adjustment: "외부 다이얼. 공식 제품 페이지는 1클릭 0.015mm",
      priceJpyHint: "엔화 정가는 옮기지 않았습니다. 2026년 11월 4일 Amazon.co.jp 상품 페이지에서 재고를 확인했습니다(표시 가격은 변합니다).",
      highlight: "운영자가 평소에 쓰는 핸드밀입니다. 한 번에 약 30g을 갈고, 2–3잔분입니다.",
      purchaseNote: "Amazon.co.jp의 밤 S3 상품 페이지입니다. 상품명이 밤 S3인지 확인하세요.",
      cuppingNotes: ["운영자가 평소에 쓰는 핸드밀입니다", "한 번에 약 30g, 2–3잔분입니다"],
      caveats: ["맛 점수와 가는 시간의 실측은 쓰지 않았습니다", "공식 제품 페이지는 영점의 버 간격을 0.075mm로 적습니다(2026년 11월 4일, timemore.com)"],
    },
    vi: {
      name: "TIMEMORE Chestnut S3",
      burrMaterial: "S2C890 (trang sản phẩm chính thức ghi SUS420, CNC 6 trục, độ cứng 58HRC)",
      adjustment: "Vòng chỉnh bên ngoài. Trang chính thức ghi mỗi nấc 0.015mm",
      priceJpyHint: "Không chép giá yên cố định. Ngày 4/11/2026 đã thấy còn hàng trên trang sản phẩm Amazon.co.jp (giá hiển thị thay đổi)",
      highlight: "Máy xay tay người vận hành dùng thường ngày. Mỗi lần xay khoảng 30g, cho 2–3 tách.",
      purchaseNote: "Đây là trang sản phẩm Chestnut S3 trên Amazon.co.jp. Hãy xác nhận tên sản phẩm là Chestnut S3.",
      cuppingNotes: ["Máy xay tay người vận hành dùng thường ngày", "Mỗi lần khoảng 30g, cho 2–3 tách"],
      caveats: ["Không chấm điểm vị, cũng không đo thời gian xay", "Trang chính thức ghi khe lưỡi ở mức 0 là 0.075mm (4/11/2026, timemore.com)"],
    },
    en: {
      name: "TIMEMORE Chestnut S3",
      burrMaterial: "S2C890 (the official product page says SUS420, 6-axis CNC, 58HRC)",
      adjustment: "External dial. The official product page says 0.015mm per click",
      priceJpyHint: "No yen list price is copied here. Stock was confirmed on the Amazon.co.jp product page on Nov 4, 2026. The displayed price changes.",
      highlight: "The hand grinder I usually use. I grind about 30g at a time, for 2–3 cups.",
      purchaseNote: "This is the Chestnut S3 product page on Amazon.co.jp. Confirm the product name is Chestnut S3.",
      cuppingNotes: ["The hand grinder I usually use", "About 30g at a time, for 2–3 cups"],
      caveats: ["No taste score, and no timed grind", "The official product page says the burr gap at zero is 0.075mm (timemore.com, Nov 4, 2026)"],
    },
    th: {
      name: "TIMEMORE Chestnut S3",
      burrMaterial: "S2C890 (หน้าสินค้าทางการระบุ SUS420, CNC 6 แกน, ความแข็ง 58HRC)",
      adjustment: "ปุ่มหมุนด้านนอก หน้าสินค้าทางการระบุคลิกละ 0.015mm",
      priceJpyHint: "ไม่ได้คัดลอกราคาเยนตายตัว วันที่ 4 พ.ย. 2026 ตรวจแล้วว่ามีสินค้าบนหน้า Amazon.co.jp (ราคาที่แสดงเปลี่ยนได้)",
      highlight: "เครื่องบดมือหมุนที่ผู้ดูแลใช้ปกติ บดครั้งละประมาณ 30g สำหรับ 2–3 ถ้วย",
      purchaseNote: "นี่คือหน้าสินค้า Chestnut S3 บน Amazon.co.jp ให้ตรวจว่าชื่อสินค้าคือ Chestnut S3",
      cuppingNotes: ["เครื่องบดมือหมุนที่ผู้ดูแลใช้ปกติ", "ครั้งละประมาณ 30g สำหรับ 2–3 ถ้วย"],
      caveats: ["ไม่ได้ให้คะแนนรส และไม่ได้จับเวลาบด", "หน้าสินค้าทางการระบุช่องว่างฟันบดที่จุดศูนย์เป็น 0.075mm (4 พ.ย. 2026, timemore.com)"],
    },
  },
  "timemore-chestnut-s5-pro": {
    "zh-tw": {
      name: "TIMEMORE 泰摩 栗子 S5 Pro",
      imageAlt: "TIMEMORE 栗子 S5 Pro 綠色",
      burrMaterial: "420 不鏽鋼 TriB-048-I（五軸 CNC，硬度 58HRC）",
      adjustment: "外部旋鈕，一圈 90 格，每格 15 微米",
      priceJpyHint: "官網標示 ¥25,800（2026 年 10 月 26 日查閱，為預售價。稅與庫存請於購買頁確認）",
      highlight: "評測整理。站長沒有在用。規格來自官方，評價是公開評測的摘要。",
      purchaseNote: "請在連結頁面選擇「S5 Pro」與「綠色」。",
      cuppingNotes: ["在寬 56mm 的機身裡裝進 48mm 刀盤的手搖磨豆機", "放在家裡的第一名是栗子 S3。這張卡片是 S5 Pro 的規格"],
      caveats: [
        "官方重量約 910g。雖然有折疊把手，但我們不把它列為旅行首選",
        "歸零時刀盤間隙約 0.075mm。官方提醒，施力不均時可能出現摩擦聲",
      ],
    },
    "zh-hk": {
      name: "TIMEMORE 泰摩 栗子 S5 Pro",
      imageAlt: "TIMEMORE 栗子 S5 Pro 綠色",
      burrMaterial: "420 不銹鋼 TriB-048-I（五軸 CNC，硬度 58HRC）",
      adjustment: "外置調節環，一圈 90 格，每格 15 微米",
      priceJpyHint: "官網標示 ¥25,800（2026 年 10 月 26 日查閱，屬預售價。稅項及存貨請在購買頁確認）",
      highlight: "評測整理。站長沒有在用。規格來自官方，評價是公開評測的摘要。",
      purchaseNote: "請在連結頁面選擇「S5 Pro」及「綠色」。",
      cuppingNotes: ["在闊 56mm 的機身內裝上 48mm 刀盤的手磨", "放在家中的第一名是栗子 S3。這張卡片是 S5 Pro 的規格"],
      caveats: [
        "官方重量約 910g。雖然設有摺疊手柄，但本站不將其列為旅行首選",
        "歸零時刀盤間隙約 0.075mm。官方提醒，用力不均時可能有摩擦聲",
      ],
    },
    "zh-cn": {
      name: "TIMEMORE 泰摩 栗子 S5 Pro",
      imageAlt: "TIMEMORE 栗子 S5 Pro 绿色",
      burrMaterial: "420 不锈钢 TriB-048-I（五轴 CNC，硬度 58HRC）",
      adjustment: "外部旋钮，一圈 90 格，每格 15 微米",
      priceJpyHint: "官网标价 ¥25,800（2026 年 10 月 26 日查看，为预售价。税费和库存请在购买页确认）",
      highlight: "评测整理。站长没有在用。规格来自官方，评价是公开评测的摘要。",
      purchaseNote: "请在链接页面选择「S5 Pro」和「绿色」。",
      cuppingNotes: ["在宽 56mm 的机身里装进 48mm 刀盘的手摇磨豆机", "放在家里的第一名是栗子 S3。这张卡片是 S5 Pro 的规格"],
      caveats: [
        "官方重量约 910g。虽然有折叠把手，但本站不把它列为旅行首选",
        "归零时刀盘间隙约 0.075mm。官方提醒，用力不均时可能出现摩擦声",
      ],
    },
    ko: {
      name: "TIMEMORE 밤(栗子) S5 Pro",
      imageAlt: "TIMEMORE 밤 S5 Pro 그린",
      burrMaterial: "420 스테인리스 TriB-048-I(5축 CNC, 경도 58HRC)",
      adjustment: "외부 다이얼, 1회전 90클릭, 1클릭 15마이크론",
      priceJpyHint: "공식 사이트 표시 ¥25,800(2026년 10월 26일 확인, 프리세일 가격. 세금과 재고는 구매 페이지에서 확인)",
      highlight: "리뷰 정리입니다. 운영자는 쓰지 않습니다. 스펙은 공식, 평가는 공개 리뷰의 요약입니다.",
      purchaseNote: "링크된 페이지에서 「S5 Pro」와 「그린」을 선택하세요.",
      cuppingNotes: ["폭 56mm 바디에 48mm 버를 넣은 핸드 그라인더", "집에 두는 1위는 밤 S3입니다. 이 카드는 S5 프로의 스펙입니다"],
      caveats: [
        "공식 무게는 약 910g. 접이식 핸들이 있지만 여행용 1순위로는 두지 않습니다",
        "영점에서도 버 간격은 약 0.075mm. 힘이 한쪽으로 쏠리면 마찰음이 날 수 있다고 공식이 안내합니다",
      ],
    },
    vi: {
      name: "TIMEMORE Chestnut S5 Pro",
      imageAlt: "TIMEMORE Chestnut S5 Pro màu xanh lá",
      burrMaterial: "Thép không gỉ 420 TriB-048-I (CNC 5 trục, độ cứng 58HRC)",
      adjustment: "Vòng chỉnh bên ngoài, 90 nấc mỗi vòng, mỗi nấc 15 micron",
      priceJpyHint: "Trang chính thức Nhật ghi ¥25,800 (xem ngày 26/10/2026, giá đặt trước. Thuế và hàng còn hay hết, xem trên trang mua)",
      highlight: "Bài tổng hợp đánh giá. Người vận hành không dùng máy này. Thông số theo hãng, nhận xét là tóm tắt đánh giá công khai.",
      purchaseNote: "Trên trang được liên kết, chọn \"S5 Pro\" và màu xanh lá.",
      cuppingNotes: ["Máy xay tay đặt lưỡi 48 mm trong thân rộng 56 mm", "Lựa chọn số 1 để ở nhà là Chestnut S3. Thẻ này là thông số của S5 Pro"],
      caveats: [
        "Khối lượng chính thức khoảng 910 g. Có tay cầm gập, nhưng trang này không xếp nó là lựa chọn đầu tiên khi đi đường",
        "Kể cả khi về 0, khe lưỡi vẫn khoảng 0.075 mm. Hãng lưu ý lực không đều có thể gây tiếng cọ",
      ],
    },
    en: {
      name: "TIMEMORE Chestnut S5 Pro",
      imageAlt: "TIMEMORE Chestnut S5 Pro in green",
      burrMaterial: "420 stainless steel TriB-048-I (5-axis CNC, 58HRC)",
      adjustment: "External dial, 90 clicks per turn, 15 microns per click",
      priceJpyHint: "Listed at ¥25,800 on the official Japanese site (checked Oct 26, 2026, pre-sale price; confirm tax and stock on the store page)",
      highlight: "A review summary. I do not use this grinder. Specs are from the maker, and the comments summarize published reviews.",
      purchaseNote: "On the linked page, choose \"S5 Pro\" and the green color.",
      cuppingNotes: ["A hand grinder that fits 48mm burrs into a 56mm-wide body", "Our No.1 for a grinder that lives at home is the Chestnut S3. This card is the S5 Pro's specs"],
      caveats: [
        "Officially about 910g. It has a folding handle, but we don't rank it first for travel",
        "Even at zero the burr gap is about 0.075mm; the maker notes uneven pressure can cause some rubbing noise",
      ],
    },
    th: {
      name: "TIMEMORE Chestnut S5 Pro",
      imageAlt: "TIMEMORE Chestnut S5 Pro สีเขียว",
      burrMaterial: "สเตนเลส 420 รุ่น TriB-048-I (CNC 5 แกน ความแข็ง 58HRC)",
      adjustment: "ปุ่มหมุนด้านนอก หนึ่งรอบ 90 คลิก คลิกละ 15 ไมครอน",
      priceJpyHint: "ราคาบนเว็บทางการ ¥25,800 (ดูเมื่อ 26 ต.ค. 2026 เป็นราคาพรีเซลล์ ภาษีและสต็อกให้ตรวจที่หน้าซื้อ)",
      highlight: "บทสรุปรีวิว ผู้ดูแลไม่ได้ใช้เครื่องนี้ สเปกมาจากผู้ผลิต ความเห็นสรุปจากรีวิวที่เผยแพร่",
      purchaseNote: "ที่หน้าลิงก์ ให้เลือก «S5 Pro» และสีเขียว",
      cuppingNotes: ["เครื่องบดมือหมุนที่ใส่ฟันบด 48mm ในตัวกว้าง 56mm", "อันดับ 1 สำหรับเครื่องที่วางไว้ที่บ้านคือ Chestnut S3 การ์ดนี้เป็นสเปกของ S5 Pro"],
      caveats: [
        "น้ำหนักทางการประมาณ 910g มีด้ามพับได้ แต่เว็บนี้ไม่ได้จัดเป็นตัวเลือกแรกสำหรับเดินทาง",
        "แม้ที่จุดศูนย์ ช่องว่างฟันบดยังประมาณ 0.075mm ผู้ผลิตเตือนว่าถ้าออกแรงไม่สม่ำเสมออาจมีเสียงครูด",
      ],
    },
  },
  "epeios-essence-go": {
    "zh-tw": {
      name: "EPEIOS Essence Go",
      imageAlt: "EPEIOS Essence Go（EPEIOS 官網產品照片）",
      burrMaterial: "不鏽鋼錐刀（10 爪・38mm）",
      adjustment: "0〜80 段（依官方標示的站內固定值）",
      priceJpyHint: "¥23,100（含稅・以官網刊載為準的站內固定值／價格調整時手動更新）",
      highlight: "官方說明以 38mm・10 爪刀盤追求起磨時的輕盈，附專用收納盒。站長的一句話：「轉起來真的很輕」。",
      cuppingNotes: ["井崎英典監修，38mm・10 爪刀盤的手搖磨豆機", "官方說明可拆解收進專用盒"],
      caveats: ["與長銷品牌的比較結果取決於個人的沖煮環境", "備品與售後支援請於購買前查看官方資訊"],
    },
    "zh-cn": {
      name: "EPEIOS Essence Go",
      imageAlt: "EPEIOS Essence Go（EPEIOS 官网产品照片）",
      burrMaterial: "不锈钢锥刀（10 刃・38mm）",
      adjustment: "0〜80 段（按官方标示的站内固定值）",
      priceJpyHint: "¥23,100（含税・以官网刊载为准的站内固定值／价格调整时手动更新）",
      highlight: "官方说明以 38mm・10 刃刀盘追求起步时的轻盈，附专用收纳盒。站长的一句话：「转起来真的很轻」。",
      cuppingNotes: ["井崎英典监修，38mm・10 刃刀盘的手摇磨豆机", "官方说明可拆开放进专用盒"],
      caveats: ["和长销品牌的比较结果取决于个人的冲煮环境", "配件和售后请在购买前查看官方信息"],
    },
    "zh-hk": {
      name: "EPEIOS Essence Go",
      imageAlt: "EPEIOS Essence Go（EPEIOS 官網產品相片）",
      burrMaterial: "不銹鋼錐形刀盤（10 爪・38mm）",
      adjustment: "0〜80 段（按官方標示的站內固定值）",
      priceJpyHint: "¥23,100（含稅・以官網刊載為準的站內固定值／價格調整時人手更新）",
      highlight: "官方表示以 38mm・10 爪刀盤追求起磨時的輕巧，附專用收納盒。站長的一句話：「轉動起來真的很輕」。",
      cuppingNotes: ["井崎英典監修，38mm・10 爪刀盤的手磨", "官方表示可拆開收入專用盒"],
      caveats: ["與長銷品牌的比較結果視乎個人沖煮環境", "零件及售後支援請在購買前查閱官方資料"],
    },
    ko: {
      name: "EPEIOS Essence Go",
      imageAlt: "EPEIOS Essence Go(EPEIOS 공식 사이트 제품 사진)",
      burrMaterial: "스테인리스 코니컬 버(10날・38mm)",
      adjustment: "0~80단계(공식 표기에 맞춘 사이트 내 고정값)",
      priceJpyHint: "¥23,100(세금 포함・공식 게재 기준 사이트 내 고정값/가격 변경 시 수동 업데이트)",
      highlight: "공식 설명으로는 38mm・10날 버로 첫 회전의 가벼움을 노렸고, 전용 케이스가 포함됩니다. 운영자의 한마디는 「정말 가볍게 돌아간다」.",
      cuppingNotes: ["이자키 히데노리 감수, 38mm・10날 핸드 그라인더", "분해해서 전용 케이스에 넣을 수 있다고 공식이 설명합니다"],
      caveats: ["스테디셀러 브랜드와의 비교는 개인의 추출 환경에 따라 다릅니다", "부품・지원 체계는 구매 전 공식 정보를 확인하세요"],
    },
    vi: {
      name: "EPEIOS Essence Go",
      imageAlt: "EPEIOS Essence Go (ảnh sản phẩm trên trang chính thức EPEIOS)",
      burrMaterial: "Lưỡi nón thép không gỉ (10 cánh, 38 mm)",
      adjustment: "0–80 mức (số cố định trên trang, theo công bố của hãng)",
      priceJpyHint: "¥23,100 (đã gồm thuế, số cố định trên trang theo giá hãng công bố; cập nhật tay khi giá đổi)",
      highlight: "Hãng nói lưỡi 38 mm, 10 cánh được làm để những vòng đầu quay nhẹ, và có hộp đựng riêng. Một câu của người vận hành: \"quay nhẹ thật\".",
      cuppingNotes: ["Máy xay tay lưỡi 38 mm, 10 cánh, do Hidenori Izaki giám sát", "Hãng mô tả có thể tháo ra và xếp vào hộp riêng"],
      caveats: ["So với các hãng bán lâu năm thì kết quả tùy cách pha của từng người", "Phụ kiện và hỗ trợ sau bán, xem thông tin chính thức trước khi mua"],
    },
    en: {
      name: "EPEIOS Essence Go",
      imageAlt: "EPEIOS Essence Go (official EPEIOS product photo)",
      burrMaterial: "Stainless steel conical burrs (10-blade, 38mm)",
      adjustment: "0–80 settings (as officially listed)",
      priceJpyHint: "¥23,100 incl. tax (as listed officially in Japan; updated manually when prices change)",
      highlight: "The maker says the 38mm 10-blade burrs were designed to make the first turns feel light, and it comes with a dedicated case. My one-line take: \"it just spins so easily.\"",
      cuppingNotes: ["Supervised by barista Hidenori Izaki; 38mm 10-blade hand grinder", "Officially designed to come apart and pack into its own case"],
      caveats: ["How it compares with long-established brands depends on your brewing setup", "Check official info on parts and support before buying"],
    },
    th: {
      name: "EPEIOS Essence Go",
      imageAlt: "EPEIOS Essence Go (ภาพสินค้าจากเว็บทางการของ EPEIOS)",
      burrMaterial: "ฟันบดทรงกรวยสเตนเลส (10 ใบ・38mm)",
      adjustment: "0–80 ระดับ (ค่าที่เว็บนี้ตรึงไว้ตามตัวเลขที่ผู้ผลิตระบุ)",
      priceJpyHint: "¥23,100 (รวมภาษี・ค่าที่เว็บนี้ตรึงไว้ตามที่เว็บทางการลงไว้ / อัปเดตเองเมื่อราคาเปลี่ยน)",
      highlight: "ผู้ผลิตอธิบายว่าออกแบบฟันบด 38mm 10 ใบให้ตอนเริ่มหมุนรู้สึกเบา และมีกล่องเฉพาะ คำหนึ่งของผู้ดูแลคือ «หมุนเบามาก»",
      cuppingNotes: ["ฮิเดโนริ อิซากิ (井崎英典) เป็นที่ปรึกษา เครื่องบดมือหมุนฟันบด 38mm 10 ใบ", "ผู้ผลิตอธิบายว่าถอดแล้วใส่กล่องเฉพาะได้"],
      caveats: ["การเทียบกับแบรนด์ที่ขายมานานขึ้นกับวิธีชงของแต่ละคน", "อะไหล่และการซัพพอร์ตให้ตรวจข้อมูลทางการก่อนซื้อ"],
    },
  },
};

const typeLabels: Record<TranslationLocale, Record<GrinderType, string>> = {
  "zh-tw": { manual: "手搖", electric: "電動", hybrid: "混合式" },
  "zh-hk": { manual: "手磨", electric: "電動", hybrid: "混合式" },
  "zh-cn": { manual: "手摇", electric: "电动", hybrid: "混合式" },
  ko: { manual: "수동", electric: "전동", hybrid: "하이브리드" },
  vi: { manual: "Quay tay", electric: "Điện", hybrid: "Kết hợp" },  th: { manual: "มือหมุน", electric: "ไฟฟ้า", hybrid: "ผสม" },  en: { manual: "Manual", electric: "Electric", hybrid: "Hybrid" },
};

export function localizedTypeLabel(type: GrinderType, locale: TranslationLocale): string {
  return typeLabels[locale][type];
}

/** 翻訳がある項目だけ差し替えたモデルを返す（無い項目は日本語のまま） */
export function localizeModel(model: GrinderModel, locale: "ja" | TranslationLocale): GrinderModel & { localized: boolean } {
  if (locale === "ja") return { ...model, localized: false };
  const t = grinderTexts[model.id]?.[locale];
  if (!t) return { ...model, localized: false };
  const out: GrinderModel = { ...model };
  for (const [k, v] of Object.entries(t)) if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  return { ...out, localized: true };
}
