import { NextRequest, NextResponse } from 'next/server'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import dbConnect from '@/lib/db/connect'
import Product from '@/lib/models/Product'

const LOCAL_PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.seed.json')

async function readLocalProducts() {
  try {
    const raw = await readFile(LOCAL_PRODUCTS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeLocalProducts(products: any[]) {
  await mkdir(path.dirname(LOCAL_PRODUCTS_FILE), { recursive: true })
  await writeFile(LOCAL_PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8')
}

function normalizeLocalProduct(product: any) {
  const id = product._id?.toString?.() || product.id || product.sku || product.name
  return {
    ...product,
    id,
    _id: id,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const skip = parseInt(searchParams.get('skip') || '0')
    const limit = parseInt(searchParams.get('limit') || '20')

    try {
      await dbConnect()

      let query: any = {}
      if (category) {
        query.category = category
      }

      const products = await Product.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })

      const total = await Product.countDocuments(query)

      return NextResponse.json({
        success: true,
        data: products,
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
      })
    } catch {
      const localProducts = await readLocalProducts()
      const filtered = category
        ? localProducts.filter((product) => product.category === category)
        : localProducts
      const sorted = [...filtered].sort((a, b) => {
        const aDate = new Date(a.createdAt || 0).getTime()
        const bDate = new Date(b.createdAt || 0).getTime()
        return bDate - aDate
      })
      const total = sorted.length
      const data = sorted.slice(skip, skip + limit).map(normalizeLocalProduct)

      return NextResponse.json({
        success: true,
        data,
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      )
    }

    try {
      await dbConnect()
      const product = await Product.create(body)

      return NextResponse.json(
        { success: true, data: product },
        { status: 201 }
      )
    } catch {
      const products = await readLocalProducts()
      const id = body._id?.toString?.() || body.id || body.sku || `${Date.now()}-${products.length + 1}`
      const now = new Date().toISOString()
      const product = normalizeLocalProduct({
        ...body,
        id,
        _id: id,
        createdAt: now,
        updatedAt: now,
      })
      const nextProducts = [product, ...products]
      await writeLocalProducts(nextProducts)

      return NextResponse.json(
        { success: true, data: product },
        { status: 201 }
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
