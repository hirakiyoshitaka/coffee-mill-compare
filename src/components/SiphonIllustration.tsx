import styles from "./SiphonIllustration.module.css";

// サイフォンの動くイラスト（SVG と CSS だけ。画像・外部素材・クライアント JS は使わない）。
// 動きは prefers-reduced-motion が「減らさない」のときだけ。それ以外は止まった絵。
const FLASK = "M158 178 L158 215.7 A44 44 0 1 0 182 215.7 L182 178";
const FUNNEL = "M140 66 L140 140 Q140 160 164 172 L164 182 L176 182 L176 172 Q200 160 200 140 L200 66 Z";

// compact は、トップと /categories の道具カードに小さく置くとき。
export function SiphonIllustration({ compact = false }: { compact?: boolean } = {}) {
  return (
    <figure className={compact ? `${styles.figure} ${styles.compact}` : styles.figure}>
      <svg
        className={styles.svg}
        viewBox="0 0 340 360"
        role="img"
        aria-label="サイフォンのしくみのイラスト。ランプの火でお湯が上のロートへ上がり、火を消すとコーヒーが下へ落ちる流れをくり返す。"
      >
        <defs>
          <clipPath id="siphon-flask-clip"><path d={FLASK} /></clipPath>
          <clipPath id="siphon-funnel-clip"><path d={FUNNEL} /></clipPath>
        </defs>

        {/* 台 */}
        <rect x="70" y="340" width="220" height="8" rx="3" fill="#2a241f" />
        <rect x="250" y="62" width="6" height="280" fill="#2a241f" />
        <rect x="200" y="96" width="52" height="5" fill="#2a241f" />

        {/* 下のフラスコの中身 */}
        <g clipPath="url(#siphon-flask-clip)">
          <rect className={styles.lowerWater} x="120" y="232" width="100" height="72" fill="#e3c9a6" />
          <rect className={styles.lowerCoffee} x="120" y="232" width="100" height="72" fill="#5a3220" />
          <g className={styles.bubbles}>
            <circle className={styles.b1} cx="158" cy="285" r="2.5" fill="#faf7f3" />
            <circle className={styles.b2} cx="172" cy="290" r="2" fill="#faf7f3" />
            <circle className={styles.b3} cx="184" cy="283" r="3" fill="#faf7f3" />
          </g>
        </g>
        <path d={FLASK} fill="none" stroke="#2a241f" strokeWidth="2.5" strokeLinejoin="round" />

        {/* 上のロートの中身 */}
        <g clipPath="url(#siphon-funnel-clip)">
          <rect className={styles.upperWater} x="140" y="100" width="60" height="72" fill="#e3c9a6" />
          <rect className={styles.upperCoffee} x="140" y="100" width="60" height="72" fill="#5a3220" />
          <ellipse cx="170" cy="166" rx="24" ry="8" fill="#3a2418" />
        </g>
        <path d={FUNNEL} fill="none" stroke="#2a241f" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="166" y="182" width="8" height="108" fill="none" stroke="#2a241f" strokeWidth="2" />

        {/* 竹べら */}
        <line className={styles.stick} x1="182" y1="58" x2="170" y2="150" stroke="#b08a5b" strokeWidth="4" strokeLinecap="round" />

        {/* アルコールランプ */}
        <path d="M148 340 L152 324 L188 324 L192 340 Z" fill="#e4dbd0" stroke="#2a241f" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="168" y="318" width="4" height="7" fill="#2a241f" />
        <g className={styles.flameGroup}>
          <g className={styles.flame}>
            <path d="M170 300 C179 308 181 314 170 319 C159 314 161 308 170 300 Z" fill="#d9822b" />
            <path d="M170 308 C174 312 174 315 170 318 C166 315 166 312 170 308 Z" fill="#f5c46b" />
          </g>
        </g>

        {/* いまの段階 */}
        <g className={styles.labels} fontSize="16" textAnchor="middle" fill="#9a4e36" fontWeight="600">
          <text className={styles.l1} x="170" y="30">火を灯す</text>
          <text className={styles.l2} x="170" y="30">お湯が上がっていく</text>
          <text className={styles.l3} x="170" y="30">粉とまぜる</text>
          <text className={styles.l4} x="170" y="30">火を消す</text>
          <text className={styles.l5} x="170" y="30">コーヒーが落ちてくる</text>
        </g>
      </svg>
      <figcaption className={styles.caption}>イラスト（動きます）</figcaption>
    </figure>
  );
}
