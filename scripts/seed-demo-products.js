/*
  Seed 20 demo products for the admin dashboard.
  - Reads MONGODB_URI from .env.local (or env) and uses mongoose to insert demo products
  - Tags inserted docs with "omkar-demo" so they can be cleaned up later
  - Uses deterministic inline SVG artwork so product images always render cleanly in admin
  Run: `node scripts/seed-demo-products.js`
*/

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

function parseDotEnv(envPath) {
  if (!fs.existsSync(envPath)) return {}
  const content = fs.readFileSync(envPath, 'utf8')
  return content.split(/\r?\n/).reduce((acc, line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return acc
    const idx = trimmed.indexOf('=')
    if (idx === -1) return acc
    const key = trimmed.slice(0, idx)
    const val = trimmed.slice(idx + 1)
    acc[key] = val
    return acc
  }, {})
}

const repoRoot = path.join(__dirname, '..')
const env = parseDotEnv(path.join(repoRoot, '.env.local'))
const MONGODB_URI = process.env.MONGODB_URI || env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || env.MONGODB_DB || 'omkar'

const demoProducts = []

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function createImageDataUri({ title, subtitle, colors }) {
  const [start, end] = colors
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-labelledby="title desc">
      <title>${escapeXml(title)}</title>
      <desc>${escapeXml(subtitle)}</desc>
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
        <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)" rx="64" />
      <circle cx="1020" cy="160" r="180" fill="#ffffff" fill-opacity="0.12" />
      <circle cx="180" cy="760" r="220" fill="#000000" fill-opacity="0.10" />
      <path d="M0 620 C 240 520, 420 760, 660 650 S 1080 560, 1200 680 L 1200 900 L 0 900 Z" fill="#ffffff" fill-opacity="0.08" />
      <rect x="78" y="78" width="1044" height="744" rx="48" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.28" stroke-width="4" />
      <rect x="118" y="118" width="964" height="664" rx="36" fill="#ffffff" fill-opacity="0.10" />
      <text x="120" y="250" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="78" font-weight="700">${escapeXml(title)}</text>
      <text x="120" y="345" fill="#ffffff" fill-opacity="0.88" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="400">${escapeXml(subtitle)}</text>
      <text x="120" y="760" fill="#ffffff" fill-opacity="0.72" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600">Omkar Ceramics Demo</text>
      <rect x="120" y="420" width="460" height="18" rx="9" fill="#ffffff" fill-opacity="0.70" />
      <rect x="120" y="462" width="360" height="18" rx="9" fill="#ffffff" fill-opacity="0.45" />
      <rect x="120" y="504" width="280" height="18" rx="9" fill="#ffffff" fill-opacity="0.30" />
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\n\s+/g, ' ').trim())}`
}

function makeProduct({ name, price = 1200, category, description = '', sku = '', rating = 4.5, colors }) {
  const image = createImageDataUri({
    title: name,
    subtitle: category,
    colors,
  })

  return {
    name,
    price,
    pricingType: 'fixed',
    originalPrice: price + Math.floor(price * 0.15),
    category,
    rating,
    inStock: true,
    images: [image],
    image,
    description,
    sku,
    tags: ['demo', 'omkar-demo'],
  }
}

const productSeeds = [
  makeProduct({
    name: 'Terra Matte 600x600 Ceramic Tile',
    price: 1299,
    category: 'Ceramic Tiles',
    description: 'Durable floor tile with a natural matte finish. Ideal for living rooms and high-traffic areas.',
    sku: 'CT-TERRA-600',
    colors: ['#274c77', '#6096ba'],
  }),
  makeProduct({
    name: 'White Gloss Wall Tile 300x600',
    price: 899,
    category: 'Ceramic Tiles',
    description: 'Bright white glossy wall tile for kitchens and bathrooms. Easy to clean and maintain.',
    sku: 'CT-WG-300',
    colors: ['#3a506b', '#5bc0be'],
  }),
  makeProduct({
    name: 'Vintage Pattern Tile 200x200',
    price: 1499,
    category: 'Ceramic Tiles',
    description: 'Decorative patterned tile for feature walls and backsplashes.',
    sku: 'CT-VINT-200',
    colors: ['#8a5a44', '#c28f5c'],
  }),
  makeProduct({
    name: 'Wood-Look Porcelain Tile 150x900',
    price: 1699,
    category: 'Ceramic Tiles',
    description: 'Natural wood appearance with the durability of porcelain, perfect for modern interiors.',
    sku: 'CT-WOOD-150',
    colors: ['#5e503f', '#9c6644'],
  }),
  makeProduct({
    name: 'Large Format Slate Grey 1200x600',
    price: 2499,
    category: 'Ceramic Tiles',
    description: 'Sleek large-format tile for a premium seamless floor finish.',
    sku: 'CT-LF-1200',
    colors: ['#334155', '#64748b'],
  }),
  makeProduct({
    name: 'Calacatta Marble Slab 2400x1200',
    price: 12999,
    category: 'Marble',
    description: 'Premium Calacatta marble slab with dramatic veining for kitchens and counters.',
    sku: 'MB-CLCT-2400',
    colors: ['#b08968', '#e9d8a6'],
  }),
  makeProduct({
    name: 'Carrara Marble Tile 600x600',
    price: 7999,
    category: 'Marble',
    description: 'Classic Carrara with soft grey veining and a timeless finish.',
    sku: 'MB-CARR-600',
    colors: ['#adb5bd', '#dee2e6'],
  }),
  makeProduct({
    name: 'Mosaic Marble Accent',
    price: 4999,
    category: 'Marble',
    description: 'Artistic marble mosaic for accents and feature areas.',
    sku: 'MB-MOSAIC-1',
    colors: ['#7f5539', '#ddb892'],
  }),
  makeProduct({
    name: 'Polished Marble Tile 800x800',
    price: 8999,
    category: 'Marble',
    description: 'High-gloss polished marble for luxurious interiors.',
    sku: 'MB-POL-800',
    colors: ['#e5e5e5', '#bdbdbd'],
  }),
  makeProduct({
    name: 'Veined Marble Slab 3000x1500',
    price: 15999,
    category: 'Marble',
    description: 'Large veined slabs for dramatic surfaces and feature walls.',
    sku: 'MB-VEIN-3000',
    colors: ['#6c757d', '#ced4da'],
  }),
  makeProduct({
    name: 'Wall-Mounted Basin Model A',
    price: 3999,
    category: 'Bathroom & Sanitary Ware',
    description: 'Sleek ceramic basin with minimalist profile.',
    sku: 'BW-BASIN-A',
    colors: ['#0f766e', '#14b8a6'],
  }),
  makeProduct({
    name: 'Comfort Flush Toilet',
    price: 5499,
    category: 'Bathroom & Sanitary Ware',
    description: 'Water-efficient toilet with soft-close seat.',
    sku: 'BW-TOILET-C',
    colors: ['#166534', '#4ade80'],
  }),
  makeProduct({
    name: 'Freestanding Bathtub Luxe',
    price: 19999,
    category: 'Bathroom & Sanitary Ware',
    description: 'Freestanding tub with smooth silhouette for spa-like comfort.',
    sku: 'BW-BATH-LUXE',
    colors: ['#0f172a', '#334155'],
  }),
  makeProduct({
    name: 'Designer Faucet Set',
    price: 2999,
    category: 'Bathroom & Sanitary Ware',
    description: 'Premium chrome finish faucets for basin and bathtub.',
    sku: 'BW-FAUCET-DS',
    colors: ['#475569', '#cbd5e1'],
  }),
  makeProduct({
    name: 'Rain Shower System',
    price: 7999,
    category: 'Bathroom & Sanitary Ware',
    description: 'Overhead rain shower for a luxurious bathing experience.',
    sku: 'BW-SHOWER-R',
    colors: ['#0b7285', '#22b8cf'],
  }),
  makeProduct({
    name: 'Stainless Towel Rail',
    price: 1299,
    category: 'Accessories',
    description: 'Durable stainless towel rail with modern finish.',
    sku: 'AC-TOWEL-01',
    colors: ['#6c757d', '#adb5bd'],
  }),
  makeProduct({
    name: 'Tile Trim Chrome',
    price: 499,
    category: 'Accessories',
    description: 'Finishing trim for clean tile edges.',
    sku: 'AC-TRIM-CH',
    colors: ['#495057', '#868e96'],
  }),
  makeProduct({
    name: 'Premium Grout 5kg',
    price: 899,
    category: 'Accessories',
    description: 'High-strength grout for durable installations.',
    sku: 'AC-GROUT-5',
    colors: ['#5f3dc4', '#7950f2'],
  }),
  makeProduct({
    name: 'Decorative Corner Accent',
    price: 1599,
    category: 'Accessories',
    description: 'Small decorative elements for finishing touches.',
    sku: 'AC-DEC-01',
    colors: ['#b56576', '#e5989b'],
  }),
  makeProduct({
    name: 'Luxury Edge Banding',
    price: 1099,
    category: 'Accessories',
    description: 'Clean decorative edge banding for polished installations.',
    sku: 'AC-EDGE-02',
    colors: ['#1f2937', '#6b7280'],
  }),
]

demoProducts.push(...productSeeds)

async function run() {
  try {
    if (!MONGODB_URI) {
      await seedViaApi()
      return
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB })
    console.log('Connected')

    const coll = mongoose.connection.collection('products')

    // Remove previous demo docs created by this script
    await coll.deleteMany({ tags: 'omkar-demo' })

    // Add timestamps
    const now = new Date()
    const docs = demoProducts.map((d) => ({ ...d, createdAt: now, updatedAt: now }))

    const res = await coll.insertMany(docs)
    console.log(`Inserted ${res.insertedCount} demo products.`)
    await mongoose.disconnect()
    console.log('Disconnected. Done.')
  } catch (err) {
    console.error('Error seeding demo products:', err)
    process.exit(1)
  }
}

async function seedViaApi() {
  const apiBase = process.env.SEED_API_BASE_URL || 'http://127.0.0.1:3000'
  console.log(`MONGODB_URI not found, falling back to ${apiBase}/api/products`)

  const existing = await fetch(`${apiBase}/api/products?limit=200`)
  if (!existing.ok) {
    throw new Error(`Failed to load existing products from ${apiBase}`)
  }

  const existingData = await existing.json()
  const removable = (existingData.data || []).filter((product) =>
    Array.isArray(product.tags) && product.tags.includes('omkar-demo')
  )

  for (const product of removable) {
    const response = await fetch(`${apiBase}/api/products/${product._id || product.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Failed to delete existing demo product ${product.name}: ${errorBody}`)
    }
  }

  for (const product of demoProducts) {
    const response = await fetch(`${apiBase}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Failed to seed product ${product.name}: ${errorBody}`)
    }
  }

  console.log(`Seeded ${demoProducts.length} demo products via API.`)
}

run()
