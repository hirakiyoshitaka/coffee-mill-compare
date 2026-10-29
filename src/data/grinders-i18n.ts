import type { TranslationLocale } from "@/lib/articles";
import type { GrinderModel, GrinderType } from "@/data/grinders";

/** 翻訳ページの商品カード用テキスト。未設定の項目は日本語にフォールバックする */
export type GrinderText = Partial<
  Pick<GrinderModel, "name" | "imageAlt" | "burrMaterial" | "adjustment" | "priceJpyHint" | "highlight" | "purchaseNote" | "cuppingNotes" | "caveats">
>;

export const grinderTexts: Record<string, Partial<Record<TranslationLocale, GrinderText>>> = {
  "timemore-chestnut-s5-pro": {
    "zh-tw": {
      name: "TIMEMORE 泰摩 栗子 S5 Pro",
      imageAlt: "TIMEMORE 栗子 S5 Pro 綠色",
      burrMaterial: "420 不鏽鋼 TriB-048-I（五軸 CNC，硬度 58HRC）",
      adjustment: "外部旋鈕，一圈 90 格，每格 15 微米",
      priceJpyHint: "官網標示 ¥25,800（2026 年 10 月 26 日查閱，為預售價。稅與庫存請於購買頁確認）",
      highlight: "站長本人每天都在用的一台。顏色是綠色（官方名稱 Olive Green）。以手沖為主，約 910g 的重量每天使用也不覺得困擾——這是站長本人的感想。",
      purchaseNote: "請在連結頁面選擇「S5 Pro」與「綠色」。",
      cuppingNotes: ["在寬 56mm 的機身裡裝進 48mm 刀盤的手搖磨豆機", "作為放在家裡的一台，列為本站 No.1"],
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
      highlight: "站長本人每天都在使用的一台。顏色為綠色（官方名稱 Olive Green）。主要用於手沖，約 910g 的重量每天使用也不覺困擾——這是站長本人的感想。",
      purchaseNote: "請在連結頁面選擇「S5 Pro」及「綠色」。",
      cuppingNotes: ["在闊 56mm 的機身內裝上 48mm 刀盤的手磨", "作為放在家中的一台，列為本站 No.1"],
      caveats: [
        "官方重量約 910g。雖然設有摺疊手柄，但本站不將其列為旅行首選",
        "歸零時刀盤間隙約 0.075mm。官方提醒，用力不均時可能有摩擦聲",
      ],
    },
    ko: {
      name: "TIMEMORE 밤(栗子) S5 Pro",
      imageAlt: "TIMEMORE 밤 S5 Pro 그린",
      burrMaterial: "420 스테인리스 TriB-048-I(5축 CNC, 경도 58HRC)",
      adjustment: "외부 다이얼, 1회전 90클릭, 1클릭 15마이크론",
      priceJpyHint: "공식 사이트 표시 ¥25,800(2026년 10월 26일 확인, 프리세일 가격. 세금과 재고는 구매 페이지에서 확인)",
      highlight: "운영자가 매일 쓰는 그라인더입니다. 색상은 그린(공식명 Olive Green). 주로 핸드드립에 쓰며, 약 910g의 무게도 매일 쓰기에 신경 쓰이지 않는다는 것이 운영자 본인의 소감입니다.",
      purchaseNote: "링크된 페이지에서 「S5 Pro」와 「그린」을 선택하세요.",
      cuppingNotes: ["폭 56mm 바디에 48mm 버를 넣은 핸드 그라인더", "집에 두는 한 대로서 이 사이트의 No.1입니다"],
      caveats: [
        "공식 무게는 약 910g. 접이식 핸들이 있지만 여행용 1순위로는 두지 않습니다",
        "영점에서도 버 간격은 약 0.075mm. 힘이 한쪽으로 쏠리면 마찰음이 날 수 있다고 공식이 안내합니다",
      ],
    },
    en: {
      name: "TIMEMORE Chestnut S5 Pro",
      imageAlt: "TIMEMORE Chestnut S5 Pro in green",
      burrMaterial: "420 stainless steel TriB-048-I (5-axis CNC, 58HRC)",
      adjustment: "External dial, 90 clicks per turn, 15 microns per click",
      priceJpyHint: "Listed at ¥25,800 on the official Japanese site (checked Oct 26, 2026, pre-sale price; confirm tax and stock on the store page)",
      highlight: "The grinder I use every day, in green (officially Olive Green). It's mostly for pour-over, and at about 910g the weight has never bothered me for daily use at home.",
      purchaseNote: "On the linked page, choose \"S5 Pro\" and the green color.",
      cuppingNotes: ["A hand grinder that fits 48mm burrs into a 56mm-wide body", "Our No.1 pick for a grinder that lives at home"],
      caveats: [
        "Officially about 910g. It has a folding handle, but we don't rank it first for travel",
        "Even at zero the burr gap is about 0.075mm; the maker notes uneven pressure can cause some rubbing noise",
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
  },
};

const typeLabels: Record<TranslationLocale, Record<GrinderType, string>> = {
  "zh-tw": { manual: "手搖", electric: "電動", hybrid: "混合式" },
  "zh-hk": { manual: "手磨", electric: "電動", hybrid: "混合式" },
  ko: { manual: "수동", electric: "전동", hybrid: "하이브리드" },
  en: { manual: "Manual", electric: "Electric", hybrid: "Hybrid" },
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
