/*
  Seed demo products for marketing-ready site
  - Reads MONGODB_URI from .env.local (or env) and uses mongoose to insert demo products
  - Tags inserted docs with "omkar-demo" so they can be cleaned up later
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

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment or .env.local')
  process.exit(1)
}

const demoProducts = []

// Helper to create product
function p({ name, price = 1200, category, images = [], description = '', sku = '' , rating = 4.5}){
  return {
    name,
    price,
    pricingType: 'fixed',
    originalPrice: price + Math.floor(price * 0.15),
    category,
    rating,
    inStock: true,
    images,
    image: images && images.length ? images[0] : '',
    description,
    sku,
    tags: ['demo','omkar-demo']
  }
}

// Ceramic Tiles
demoProducts.push(p({
  name: 'Terra Matte 600x600 Ceramic Tile',
  price: 1299,
  category: 'Ceramic Tiles',
  images: [
    'https://images.unsplash.com/photo-1586201375759-3b4b86d90f33?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a8c1f2e0b0f6b7f3a3a5a8c2c7b6e3b',
  ],
  description: 'Durable floor tile with a natural matte finish. Ideal for living rooms and high-traffic areas.',
  sku: 'CT-TERRA-600'
}))

demoProducts.push(p({
  name: 'White Gloss Wall Tile 300x600',
  price: 899,
  category: 'Ceramic Tiles',
  images: ['https://images.unsplash.com/photo-1560184897-e3b6c6b1eafd?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7d6f6c8e4f4b2b2e3a1f6a7b2d3c4e5f'],
  description: 'Bright white glossy wall tile for kitchens and bathrooms. Easy to clean and maintain.',
  sku: 'CT-WG-300'
}))

demoProducts.push(p({
  name: 'Vintage Pattern Tile 200x200',
  price: 1499,
  category: 'Ceramic Tiles',
  images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2a1c2b3e4d5f6a7b8c9d0e1f2a3b4c5d'],
  description: 'Decorative patterned tile for feature walls and backsplashes.',
  sku: 'CT-VINT-200'
}))

demoProducts.push(p({
  name: 'Wood-Look Porcelain Tile 150x900',
  price: 1699,
  category: 'Ceramic Tiles',
  images: ['https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=edc4a5b6c7d8e9f0a1b2c3d4e5f6a7b8'],
  description: 'Natural wood appearance with the durability of porcelain — perfect for modern interiors.',
  sku: 'CT-WOOD-150'
}))

demoProducts.push(p({
  name: 'Large Format Slate Grey 1200x600',
  price: 2499,
  category: 'Ceramic Tiles',
  images: ['https://images.unsplash.com/photo-1549187774-b4e9ba4c0e36?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d'],
  description: 'Sleek large-format tile for a premium seamless floor finish.',
  sku: 'CT-LF-1200'
}))

// Marble
demoProducts.push(p({
  name: 'Calacatta Marble Slab 2400x1200',
  price: 12999,
  category: 'Marble',
  images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9f8e7d6c5b4a39281716151413121110'],
  description: 'Premium Calacatta marble slab with dramatic veining — statement surfaces for kitchens and counters.',
  sku: 'MB-CLCT-2400'
}))

demoProducts.push(p({
  name: 'Carrara Marble Tile 600x600',
  price: 7999,
  category: 'Marble',
  images: ['https://images.unsplash.com/photo-1505691723518-34d6b7ef6f6f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef1234567890abcdef1234567890'],
  description: 'Classic Carrara with soft grey veining — timeless and elegant.',
  sku: 'MB-CARR-600'
}))

demoProducts.push(p({
  name: 'Mosaic Marble Accent',
  price: 4999,
  category: 'Marble',
  images: ['https://images.unsplash.com/photo-1523906630133-f6934a1abf2d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=123456abcdef7890abcdef1234567890'],
  description: 'Artistic marble mosaic for accents and feature areas.',
  sku: 'MB-MOSAIC-1'
}))

demoProducts.push(p({
  name: 'Polished Marble Tile 800x800',
  price: 8999,
  category: 'Marble',
  images: ['https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d'],
  description: 'High-gloss polished marble for luxurious interiors.',
  sku: 'MB-POL-800'
}))

demoProducts.push(p({
  name: 'Veined Marble Slab 3000x1500',
  price: 15999,
  category: 'Marble',
  images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=feedfacecafebeefdeadbeef12345678'],
  description: 'Large veined slabs for dramatic surfaces and feature walls.',
  sku: 'MB-VEIN-3000'
}))

// Bathroom & Sanitary Ware
demoProducts.push(p({
  name: 'Wall-Mounted Basin Model A',
  price: 3999,
  category: 'Bathroom & Sanitary Ware',
  images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d'],
  description: 'Sleek ceramic basin with minimalist profile.',
  sku: 'BW-BASIN-A'
}))

demoProducts.push(p({
  name: 'Comfort Flush Toilet',
  price: 5499,
  category: 'Bathroom & Sanitary Ware',
  images: ['https://images.unsplash.com/photo-1581579186427-0a7f4f3f4f4f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9876543210abcdef9876543210abcdef'],
  description: 'Water-efficient toilet with soft-close seat.',
  sku: 'BW-TOILET-C'
}))

demoProducts.push(p({
  name: 'Freestanding Bathtub Luxe',
  price: 19999,
  category: 'Bathroom & Sanitary Ware',
  images: ['https://images.unsplash.com/photo-1505691723518-34d6b7ef6f6f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=ffeeaabbccddeeff0011223344556677'],
  description: 'Freestanding tub with smooth silhouette for spa-like comfort.',
  sku: 'BW-BATH-LUXE'
}))

demoProducts.push(p({
  name: 'Designer Faucet Set',
  price: 2999,
  category: 'Bathroom & Sanitary Ware',
  images: ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc123abc123abc123abc123abc123ab'],
  description: 'Premium chrome finish faucets for basin and bathtub.',
  sku: 'BW-FAUCET-DS'
}))

demoProducts.push(p({
  name: 'Rain Shower System',
  price: 7999,
  category: 'Bathroom & Sanitary Ware',
  images: ['https://images.unsplash.com/photo-1505691723518-34d6b7ef6f6f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=11223344556677889900aabbccddeeff'],
  description: 'Overhead rain shower for a luxurious bathing experience.',
  sku: 'BW-SHOWER-R'
}))

// Accessories
demoProducts.push(p({
  name: 'Stainless Towel Rail',
  price: 1299,
  category: 'Accessories',
  images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=aa11bb22cc33dd44ee55ff6677889900'],
  description: 'Durable stainless towel rail with modern finish.',
  sku: 'AC-TOWEL-01'
}))

demoProducts.push(p({
  name: 'Tile Trim Chrome',
  price: 499,
  category: 'Accessories',
  images: ['https://images.unsplash.com/photo-1581579186427-0a7f4f3f4f4f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2244668800aabbccddeeff0011223344'],
  description: 'Finishing trim for clean tile edges.',
  sku: 'AC-TRIM-CH'
}))

demoProducts.push(p({
  name: 'Premium Grout 5kg',
  price: 899,
  category: 'Accessories',
  images: ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=33445566778899aabbccddeeff001122'],
  description: 'High-strength grout for durable installations.',
  sku: 'AC-GROUT-5'
}))

demoProducts.push(p({
  name: 'Decorative Corner Accent',
  price: 1599,
  category: 'Accessories',
  images: ['https://images.unsplash.com/photo-1523906630133-f6934a1abf2d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5566778899aabbccddeeff0011223344'],
  description: 'Small decorative elements for finishing touches.',
  sku: 'AC-DEC-01'
}))

async function run() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB })
    console.log('Connected')

    const coll = mongoose.connection.collection('products')

    // Remove previous demo docs created by this script
    await coll.deleteMany({ tags: 'omkar-demo' })

    // Add timestamps
    const now = new Date()
    const docs = demoProducts.map(d => ({ ...d, createdAt: now, updatedAt: now }))

    const res = await coll.insertMany(docs)
    console.log(`Inserted ${res.insertedCount} demo products.`)
    await mongoose.disconnect()
    console.log('Disconnected. Done.')
  } catch (err) {
    console.error('Error seeding demo products:', err)
    process.exit(1)
  }
}

run()
