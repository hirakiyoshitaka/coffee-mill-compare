/**
 * Amazon の在庫を、公式の Product Advertising API（PA-API）で見るための入口。
 * 今は止めてある。売上 3 件のあと、社長の OK が出てからだけ有効にする。
 * この関数は Amazon へリクエストしない。
 */
export const AMAZON_PAAPI_ENABLED = false;

export type AmazonStockHookResult = {
  enabled: false;
  fetched: false;
  detail: string;
};

export function amazonStockHook(url: string): AmazonStockHookResult {
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    host = "";
  }
  const where = host ? ` (${host})` : "";
  return {
    enabled: false,
    fetched: false,
    detail: `Amazon PA-API は停止中${where}。売上 3 件と社長の OK のあとで有効にする`,
  };
}
