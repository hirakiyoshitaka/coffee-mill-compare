import styles from "./BalanceSiphonIllustration.module.css";

// 天秤式（バランシング）サイフォンの、デフォルメしたイメージ図。
// 特定のメーカーの形・装飾は写さない一般的な形。SVG と CSS だけ（画像・外部素材・クライアント JS なし）。
// 動きは prefers-reduced-motion が「減らさない」のときだけ。それ以外は止まった絵（傾いたところ）。
const GLOBE = "M78 92 m-36 36 a36 36 0 1 0 72 0 a36 36 0 1 0 -72 0";
const POT = "M232 114 L292 114 L295 160 Q295 169 286 169 L238 169 Q229 169 229 160 Z";

export function BalanceSiphonIllustration() {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox="0 0 340 320"
        role="img"
        aria-label="天秤式サイフォンのイメージ図。左のガラスの球から右のポットへお湯が移ると、天秤が傾いてアルコールランプの火にふたが閉じる流れをくり返す。"
      >
        <defs>
          <clipPath id="bal-globe-clip"><path d={GLOBE} /></clipPath>
          <clipPath id="bal-pot-clip"><path d={POT} /></clipPath>
        </defs>

        {/* 台と支柱（動かない） */}
        <rect x="70" y="296" width="200" height="9" rx="4" fill="#2a241f" />
        <rect x="166" y="172" width="8" height="126" fill="#2a241f" />

        {/* アルコールランプ（動かない）：左のガラスの球の真下 */}
        <path d="M54 296 L60 246 L96 246 L102 296 Z" fill="#e4dbd0" stroke="#2a241f" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="76" y="238" width="4" height="9" fill="#2a241f" />
        <g className={styles.flameGroup}>
          <g className={styles.flame}>
            <path d="M78 208 C88 218 90 228 78 237 C66 228 68 218 78 208 Z" fill="#d9822b" />
            <path d="M78 220 C83 225 83 230 78 235 C73 230 73 225 78 220 Z" fill="#f5c46b" />
          </g>
        </g>
        {/* 火のふた：天秤が傾くと、すべってきて火をおおう */}
        <g className={styles.lid}>
          <rect x="52" y="226" width="52" height="7" rx="3.5" fill="#c9a24a" stroke="#2a241f" strokeWidth="2" />
          <circle cx="78" cy="223" r="3.5" fill="#c9a24a" stroke="#2a241f" strokeWidth="1.5" />
        </g>

        {/* 傾く部分：腕・左の球・右のポット・つなぐ管 */}
        <g className={styles.tilt}>
          {/* 左：ガラスの球 */}
          <g clipPath="url(#bal-globe-clip)">
            <rect className={styles.leftWater} x="40" y="92" width="76" height="72" fill="#e3c9a6" />
          </g>
          <path d={GLOBE} fill="none" stroke="#2a241f" strokeWidth="2.5" />
          <path d="M60 112 Q64 100 74 98" fill="none" stroke="#faf7f3" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <rect x="70" y="84" width="16" height="12" fill="#faf7f3" stroke="#2a241f" strokeWidth="2.5" />

          {/* 右：金属のポット */}
          <g clipPath="url(#bal-pot-clip)">
            <rect x="229" y="114" width="66" height="56" fill="#b98a3e" />
            <rect className={styles.rightWater} x="229" y="114" width="66" height="56" fill="#5a3220" />
          </g>
          <path d={POT} fill="none" stroke="#2a241f" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M229 114 Q262 92 295 114 Z" fill="#d8b85a" stroke="#2a241f" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="262" cy="99" r="4" fill="#d8b85a" stroke="#2a241f" strokeWidth="2" />

          {/* つなぐ管 */}
          <path d="M78 84 Q78 30 170 30 Q262 30 262 100" fill="none" stroke="#2a241f" strokeWidth="5" strokeLinecap="round" />
          <path d="M78 84 Q78 30 170 30 Q262 30 262 100" fill="none" stroke="#faf7f3" strokeWidth="2" strokeLinecap="round" />

          {/* 腕と支点 */}
          <rect x="44" y="167" width="252" height="7" rx="3.5" fill="#c9a24a" stroke="#2a241f" strokeWidth="2" />
          <path d="M60 166 L96 166 L90 176 L66 176 Z" fill="#c9a24a" stroke="#2a241f" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="170" cy="171" r="8" fill="#2a241f" />
          <circle cx="170" cy="171" r="3" fill="#c9a24a" />
        </g>

        {/* いまの段階 */}
        <g className={styles.labels} fontSize="15" textAnchor="middle" fill="#9a4e36" fontWeight="600">
          <text className={styles.l1} x="170" y="16">お湯が右のポットへ移る</text>
          <text className={styles.l2} x="170" y="16">傾いて、火のふたが閉じる</text>
          <text className={styles.l3} x="170" y="16">冷めて、左へ戻る</text>
        </g>
      </svg>
      <figcaption className={styles.caption}>イラスト（イメージ）</figcaption>
    </figure>
  );
}
