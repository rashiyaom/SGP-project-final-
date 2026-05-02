/*
  Seed gallery items (marketing/demo)
  - Inserts 30 demo gallery items into the `galleryitems` collection
  - Titles start with "Demo - " so they can be cleaned up later
  Run: `node scripts/seed-gallery.js`
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

// Minimal gallery items (30). Use public Unsplash images relevant to the category.
const items = []

function g({ title, category, image, description = '', featured = false, style = '', tileSize = '' }) {
  return { title, category, image, description, featured, style, tileSize }
}

// Add 30 demo gallery items across categories
items.push(g({ title: 'Demo - Terra Matte Tile Display', category: 'Ceramic Tiles', image: 'https://images.unsplash.com/photo-1586201375759-3b4b86d90f33?q=80&w=1200&auto=format&fit=crop', description: 'Terra matte tile display for floors.' }))
items.push(g({ title: 'Demo - White Gloss Wall Tile', category: 'Ceramic Tiles', image: 'https://images.unsplash.com/photo-1560184897-e3b6c6b1eafd?q=80&w=1200&auto=format&fit=crop', description: 'Glossy white tiles for modern walls.' }))
items.push(g({ title: 'Demo - Patterned Feature Tile', category: 'Ceramic Tiles', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop', description: 'Decorative patterned tile.' }))
items.push(g({ title: 'Demo - Wood-Look Porcelain', category: 'Ceramic Tiles', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop', description: 'Wood-look porcelain tile.' }))
items.push(g({ title: 'Demo - Large Format Slate Grey', category: 'Ceramic Tiles', image: 'https://images.unsplash.com/photo-1549187774-b4e9ba4c0e36?q=80&w=1200&auto=format&fit=crop', description: 'Large format slate tile.' }))

items.push(g({ title: 'Demo - Calacatta Marble Wall', category: 'Marble', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop', description: 'Calacatta marble slab.' }))
items.push(g({ title: 'Demo - Carrara Marble Tile', category: 'Marble', image: 'https://images.unsplash.com/photo-1505691723518-34d6b7ef6f6f?q=80&w=1200&auto=format&fit=crop', description: 'Classic Carrara tile.' }))
items.push(g({ title: 'Demo - Marble Mosaic Accent', category: 'Marble', image: 'https://images.unsplash.com/photo-1523906630133-f6934a1abf2d?q=80&w=1200&auto=format&fit=crop', description: 'Mosaic marble accent.' }))
items.push(g({ title: 'Demo - Polished Marble Display', category: 'Marble', image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=1200&auto=format&fit=crop', description: 'Polished marble finishes.' }))
items.push(g({ title: 'Demo - Veined Marble Feature', category: 'Marble', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', description: 'Dramatic veined marble.' }))

items.push(g({ title: 'Demo - Wall-Mounted Basin A', category: 'Bathroom & Sanitary Ware', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop', description: 'Sleek wall-mounted basin.' }))
items.push(g({ title: 'Demo - Comfort Flush Toilet', category: 'Bathroom & Sanitary Ware', image: 'https://images.unsplash.com/photo-1581579186427-0a7f4f3f4f4f?q=80&w=1200&auto=format&fit=crop', description: 'Comfort flush toilet.' }))
items.push(g({ title: 'Demo - Freestanding Bathtub', category: 'Bathroom & Sanitary Ware', image: 'https://images.unsplash.com/photo-1505691723518-34d6b7ef6f6f?q=80&w=1200&auto=format&fit=crop', description: 'Freestanding bathtub.' }))
items.push(g({ title: 'Demo - Designer Faucet Set', category: 'Bathroom & Sanitary Ware', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop', description: 'Designer faucet set.' }))
items.push(g({ title: 'Demo - Rain Shower Panel', category: 'Bathroom & Sanitary Ware', image: 'https://images.unsplash.com/photo-1505691723518-34d6b7ef6f6f?q=80&w=1200&auto=format&fit=crop', description: 'Overhead rain shower panel.' }))

items.push(g({ title: 'Demo - Stainless Towel Rail', category: 'Accessories', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop', description: 'Stainless towel rail.' }))
items.push(g({ title: 'Demo - Tile Trim Chrome', category: 'Accessories', image: 'https://images.unsplash.com/photo-1581579186427-0a7f4f3f4f4f?q=80&w=1200&auto=format&fit=crop', description: 'Tile trim chrome.' }))
items.push(g({ title: 'Demo - Premium Grout 5kg', category: 'Accessories', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop', description: 'Premium grout.' }))
items.push(g({ title: 'Demo - Decorative Corner Accent', category: 'Accessories', image: 'https://images.unsplash.com/photo-1523906630133-f6934a1abf2d?q=80&w=1200&auto=format&fit=crop', description: 'Decorative corner accent.' }))
items.push(g({ title: 'Demo - Accent Lighting Display', category: 'Accessories', image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1200&auto=format&fit=crop', description: 'Accent lighting for displays.' }))

items.push(g({ title: 'Demo - Outdoor Paver Sample', category: 'Outdoor', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop', description: 'Outdoor paver sample.' }))
items.push(g({ title: 'Demo - Mosaic Pattern Panel', category: 'Decor', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop', description: 'Mosaic pattern sample.' }))
items.push(g({ title: 'Demo - Kitchen Backsplash Sample', category: 'Decor', image: 'https://images.unsplash.com/photo-1560184897-e3b6c6b1eafd?q=80&w=1200&auto=format&fit=crop', description: 'Kitchen backsplash ideas.' }))
items.push(g({ title: 'Demo - Feature Wall Panel', category: 'Decor', image: 'https://images.unsplash.com/photo-1523906630133-f6934a1abf2d?q=80&w=1200&auto=format&fit=crop', description: 'Feature wall panels.' }))
items.push(g({ title: 'Demo - Small Format Tile Board', category: 'Samples', image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=1200&auto=format&fit=crop', description: 'Small format tile sample board.' }))

items.push(g({ title: 'Demo - Stone Effect Porcelain', category: 'Ceramic Tiles', image: 'https://images.unsplash.com/photo-1549187774-b4e9ba4c0e36?q=80&w=1200&auto=format&fit=crop', description: 'Stone effect porcelain tile.' }))
items.push(g({ title: 'Demo - Terrazzo Sample Panel', category: 'Decor', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', description: 'Terrazzo sample panel.' }))
items.push(g({ title: 'Demo - Concrete Effect Paver', category: 'Outdoor', image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop', description: 'Concrete effect paver sample.' }))
items.push(g({ title: 'Demo - Glass Mosaic Tile', category: 'Decor', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402f?q=80&w=1200&auto=format&fit=crop', description: 'Glass mosaic tile sample.' }))
items.push(g({ title: 'Demo - Natural Stone Sample', category: 'Samples', image: 'https://images.unsplash.com/photo-1526464001305-5a8f3a5b1f9a?q=80&w=1200&auto=format&fit=crop', description: 'Natural stone sample panel.' }))

async function run() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB })
    console.log('Connected')

    const coll = mongoose.connection.collection('galleryitems')

    // Remove previous demo docs created by this script
    await coll.deleteMany({ title: { $regex: '^Demo - ' } })

    const now = new Date()
    const docs = items.map(d => ({ ...d, createdAt: now, updatedAt: now }))

    const res = await coll.insertMany(docs)
    console.log(`Inserted ${res.insertedCount} gallery items.`)
    await mongoose.disconnect()
    console.log('Disconnected. Done.')
  } catch (err) {
    console.error('Error seeding gallery items:', err)
    process.exit(1)
  }
}

run()
