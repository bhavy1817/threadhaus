// Draws an accurate garment illustration from the product's type + colour.
// If a product has a real photo URL (product.image), that is shown instead.

function shade(hex, amt) {
  const n = parseInt(hex.replace('#', ''), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
  return `rgb(${r},${g},${b})`;
}

function Garment({ type, color }) {
  const dark = shade(color, -40);
  const light = shade(color, 35);
  const stroke = shade(color, -70);
  const common = { fill: color, stroke, strokeWidth: 2, strokeLinejoin: 'round' };
  const line = { stroke: dark, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' };

  switch (type) {
    case 'tshirt':
      return (<g>
        <path {...common} d="M62 28 L86 18 Q100 38 114 18 L138 28 L176 66 L152 92 L138 80 L138 206 L62 206 L62 80 L48 92 L24 66 Z" />
        <path d="M86 18 Q100 38 114 18" {...line} strokeWidth={4} />
        <path d="M62 200 H138" {...line} />
      </g>);
    case 'top':
      return (<g>
        <path {...common} d="M64 34 L88 22 Q100 40 112 22 L136 34 L172 66 L150 88 L136 78 L136 170 L64 170 L64 78 L50 88 L28 66 Z" />
        <path d="M88 22 Q100 40 112 22" {...line} strokeWidth={4} />
        <path d="M64 164 H136" {...line} />
      </g>);
    case 'shirt':
      return (<g>
        <path {...common} d="M60 30 L84 18 L100 36 L116 18 L140 30 L182 110 L158 122 L138 88 L138 212 L62 212 L62 88 L42 122 L18 110 Z" />
        <path d="M84 18 L100 44 L116 18 L108 14 L100 24 L92 14 Z" fill={light} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
        <path d="M100 44 V212" {...line} />
        {[64, 88, 112, 136, 160, 184].map((y) => <circle key={y} cx="100" cy={y} r="2.5" fill={stroke} />)}
        <rect x="108" y="66" width="18" height="20" fill="none" stroke={dark} strokeWidth="2" />
      </g>);
    case 'hoodie':
      return (<g>
        <path {...common} d="M62 42 Q100 6 138 42 L182 158 L156 168 L138 108 L138 210 L62 210 L62 108 L44 168 L18 158 Z" />
        <path d="M70 40 Q100 82 130 40 Q100 4 70 40 Z" fill={dark} stroke={stroke} strokeWidth="2" />
        <path d="M94 66 V104 M106 66 V104" {...line} />
        <path d="M74 150 H126 L134 190 H66 Z" fill={light} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
        <path d="M62 200 H138" {...line} />
      </g>);
    case 'jacket':
      return (<g>
        <path {...common} d="M62 34 L86 20 L100 34 L114 20 L138 34 L184 150 L160 162 L138 104 L138 204 L62 204 L62 104 L40 162 L16 150 Z" />
        <path d="M86 20 L100 34 L114 20 L120 36 L100 52 L80 36 Z" fill={light} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
        <path d="M100 52 V204" {...line} strokeWidth={3} />
        <path d="M70 170 H90 M110 170 H130" {...line} />
        <path d="M62 196 H138" {...line} strokeWidth={4} />
      </g>);
    case 'jeans':
      return (<g>
        <path {...common} d="M52 18 H148 L158 226 H108 L100 90 L92 226 H42 Z" />
        <path d="M52 18 H148 V34 H52 Z" fill={light} stroke={stroke} strokeWidth="2" />
        <path d="M100 34 V90" {...line} />
        <path d="M58 40 Q76 54 90 44" {...line} />
        <path d="M142 40 Q124 54 110 44" {...line} />
        <path d="M46 214 H94 M106 214 H154" {...line} />
        {[60, 78, 96, 114, 132, 150, 168, 186, 204].map((x, i) => <rect key={i} x={i % 2 ? 56 : 54} y={22} width="4" height="8" fill={stroke} opacity={0} />)}
      </g>);
    case 'trousers':
      return (<g>
        <path {...common} d="M54 18 H146 L154 226 H108 L100 84 L92 226 H46 Z" />
        <path d="M54 18 H146 V32 H54 Z" fill={light} stroke={stroke} strokeWidth="2" />
        <path d="M76 32 V100 M124 32 V100" {...line} opacity="0.6" />
        <path d="M70 120 V220 M130 120 V220" {...line} opacity="0.35" />
        <circle cx="100" cy="25" r="3" fill={stroke} />
      </g>);
    case 'dress':
      return (<g>
        <path {...common} d="M78 18 L92 18 Q100 34 108 18 L122 18 L128 72 L172 224 L28 224 L72 72 Z" />
        <path d="M72 72 H128" {...line} strokeWidth={3} />
        <path d="M92 18 Q100 34 108 18" {...line} strokeWidth={3} />
        <path d="M60 140 L52 220 M100 90 V222 M140 140 L148 220" {...line} opacity="0.35" />
      </g>);
    case 'kurti':
      return (<g>
        <path {...common} d="M72 22 Q100 48 128 22 L156 46 L172 124 L148 130 L142 100 L142 230 L112 230 L112 168 L88 168 L88 230 L58 230 L58 100 L52 130 L28 124 L44 46 Z" />
        <path d="M72 22 Q100 48 128 22" {...line} strokeWidth={3} />
        <path d="M100 44 V90" {...line} />
        {[52, 62, 72, 82].map((y) => <circle key={y} cx="100" cy={y} r="2" fill={stroke} />)}
        <path d="M58 222 H88 M112 222 H142" {...line} />
      </g>);
    case 'skirt':
      return (<g>
        <path {...common} d="M64 30 H136 L176 214 H24 Z" />
        <path d="M64 30 H136 V46 H64 Z" fill={light} stroke={stroke} strokeWidth="2" />
        <path d="M84 46 L62 212 M100 46 V212 M116 46 L138 212" {...line} opacity="0.35" />
      </g>);
    default:
      return <rect x="50" y="30" width="100" height="180" rx="10" {...common} />;
  }
}

export default function ProductImage({ product, className = '' }) {
  if (product.image) {
    return (
      <div className={`prod-img ${className}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
    );
  }
  const color = product.color || '#333';
  return (
    <div className={`prod-img ${className}`} style={{ background: `radial-gradient(circle at 50% 30%, #fff, ${shade('#eeeeee', -6)})` }}>
      <svg viewBox="0 0 200 240" role="img" aria-label={`${product.colorName || ''} ${product.name}`}>
        <ellipse cx="100" cy="232" rx="62" ry="5" fill="rgba(0,0,0,.12)" />
        <Garment type={product.type} color={color} />
      </svg>
    </div>
  );
}
