const CATEGORY_IMAGES = {
  smartphones:  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  laptops:      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  audifonos:    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  auriculares:  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  headphones:   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  tablets:      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop',
  computadores: 'https://images.unsplash.com/photo-1593640408182-31c228696ee1?w=400&h=300&fit=crop',
  monitores:    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
  camaras:      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  impresoras:   'https://images.unsplash.com/photo-1612198790700-0b37a6d15fa5?w=400&h=300&fit=crop',
  accesorios:   'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&h=300&fit=crop',
  teclados:     'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
  ratones:      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  camisetas:    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=300&fit=crop',
  ropa:         'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop',
  zapatos:      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  calzado:      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  muebles:      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
  fitness:      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
  deporte:      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop',
];

export function getPlaceholderImage(image, { category = '', id = 0 } = {}) {
  if (image) return image;

  const key = String(category).trim().toLowerCase();
  if (CATEGORY_IMAGES[key]) return CATEGORY_IMAGES[key];

  return FALLBACK_IMAGES[Number(id) % FALLBACK_IMAGES.length];
}
