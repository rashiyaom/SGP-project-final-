import ExcelJS from 'exceljs'
import { Product } from '@/contexts/admin-context'

// Color palette for professional look
const colors = {
  header: 'FFE8DCC4', // Warm beige
  subheader: 'FFF5F0E6', // Light beige
  accent: 'FF8B7355', // Warm brown
  text: 'FF2A2A2A', // Dark text
  border: 'FFCCBBAA', // Subtle brown border
  positive: 'FF4CAF50', // Green for in stock
  negative: 'FFF44336', // Red for out of stock
}

interface ExportOptions {
  products: Product[]
  categoryName?: string
  fileName?: string
}

export async function exportProductsToExcel({
  products,
  categoryName = 'All Categories',
  fileName = `products-${categoryName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.xlsx`,
}: ExportOptions) {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Products')

  // Define columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 12 },
    { header: 'Product Name', key: 'name', width: 28 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Pricing Type', key: 'pricingType', width: 14 },
    { header: 'Price (₹)', key: 'price', width: 12 },
    { header: 'Original Price (₹)', key: 'originalPrice', width: 16 },
    { header: 'Discount %', key: 'discount', width: 12 },
    { header: 'Stock Status', key: 'inStock', width: 14 },
    { header: 'Rating', key: 'rating', width: 10 },
    { header: 'SKU', key: 'sku', width: 14 },
    { header: 'Images Count', key: 'imageCount', width: 14 },
    { header: 'Tags', key: 'tags', width: 20 },
    { header: 'Description', key: 'description', width: 35 },
  ]

  // Style header row
  const headerRow = worksheet.getRow(1)
  headerRow.fill = {
    type: 'solid',
    fgColor: { argb: colors.header },
  }
  headerRow.font = {
    bold: true,
    size: 11,
    color: { argb: colors.text },
    name: 'Calibri',
  }
  headerRow.alignment = {
    horizontal: 'center',
    vertical: 'middle',
    wrapText: true,
  }
  headerRow.height = 24

  // Add borders to header
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'medium', color: { argb: colors.accent } },
      left: { style: 'thin', color: { argb: colors.border } },
      bottom: { style: 'medium', color: { argb: colors.accent } },
      right: { style: 'thin', color: { argb: colors.border } },
    }
  })

  // Add data rows
  products.forEach((product) => {
    const discount = product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

    const row = worksheet.addRow({
      id: product.id,
      name: product.name,
      category: product.category,
      pricingType: product.pricingType || 'fixed',
      price: product.pricingType === 'inquire' ? 'Inquire at Store' : product.price || '-',
      originalPrice: product.originalPrice || '-',
      discount: discount > 0 ? `${discount}%` : '-',
      inStock: product.inStock ? 'In Stock' : 'Out of Stock',
      rating: `${product.rating.toFixed(1)} ⭐`,
      sku: product.sku || '-',
      imageCount: (product.images && product.images.length) || 1,
      tags: (product.tags && product.tags.join(', ')) || '-',
      description: product.description || '-',
    })

    // Style data rows
    row.fill = {
      type: 'solid',
      fgColor: { argb: colors.subheader },
    }
    row.font = {
      size: 10,
      color: { argb: colors.text },
      name: 'Calibri',
    }
    row.alignment = {
      horizontal: 'left',
      vertical: 'middle',
      wrapText: true,
    }
    row.height = 20

    // Add borders to all cells
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin', color: { argb: colors.border } },
        left: { style: 'thin', color: { argb: colors.border } },
        bottom: { style: 'thin', color: { argb: colors.border } },
        right: { style: 'thin', color: { argb: colors.border } },
      }

      // Alternate row colors for better readability
      const rowIndex = worksheet.lastRow?.number || 0
      if (rowIndex % 2 === 0) {
        cell.fill = {
          type: 'solid',
          fgColor: { argb: 'FFF9F6F0' }, // Slightly lighter alternate row
        }
      }

      // Color code stock status
      if (colNumber === 8) { // inStock column
        if (product.inStock) {
          cell.font = { ...cell.font, color: { argb: colors.positive }, bold: true }
        } else {
          cell.font = { ...cell.font, color: { argb: colors.negative }, bold: true }
        }
      }

      // Color code pricing type
      if (colNumber === 4) { // pricingType column
        if (product.pricingType === 'inquire') {
          cell.font = { ...cell.font, color: { argb: colors.accent }, italic: true }
        }
      }
    })
  })

  // Freeze the header row
  worksheet.views = [
    { state: 'frozen', ySplit: 1, activeCell: 'A2' }
  ]

  // Add a summary sheet
  const summarySheet = workbook.addWorksheet('Summary')

  // Title
  summarySheet.mergeCells('A1:D1')
  const titleCell = summarySheet.getCell('A1')
  titleCell.value = `${categoryName} - Product Summary Report`
  titleCell.font = {
    bold: true,
    size: 16,
    color: { argb: colors.text },
    name: 'Calibri',
  }
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
  titleCell.fill = {
    type: 'solid',
    fgColor: { argb: colors.header },
  }
  summarySheet.getRow(1).height = 28

  // Date
  summarySheet.mergeCells('A2:D2')
  const dateCell = summarySheet.getCell('A2')
  dateCell.value = `Report Generated: ${new Date().toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`
  dateCell.font = { size: 10, color: { argb: colors.text }, italic: true }
  dateCell.alignment = { horizontal: 'center' }

  summarySheet.addRow([])

  // Summary stats
  const inStockCount = products.filter(p => p.inStock).length
  const outOfStockCount = products.filter(p => !p.inStock).length
  const inquireCount = products.filter(p => p.pricingType === 'inquire').length
  const fixedPriceCount = products.filter(p => p.pricingType !== 'inquire').length
  const avgRating = products.length > 0
    ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(2)
    : '0'
  const totalValue = products.reduce((sum, p) => {
    if (p.pricingType === 'inquire') return sum
    return sum + (p.price || 0)
  }, 0)

  const stats = [
    { label: 'Total Products', value: products.length },
    { label: 'In Stock', value: inStockCount },
    { label: 'Out of Stock', value: outOfStockCount },
    { label: 'Fixed Price Items', value: fixedPriceCount },
    { label: 'Inquire at Store Items', value: inquireCount },
    { label: 'Average Rating', value: `${avgRating} ⭐` },
    { label: 'Total Product Value', value: `₹${totalValue.toLocaleString('en-IN')}` },
  ]

  stats.forEach((stat, index) => {
    const row = summarySheet.addRow([stat.label, '', '', stat.value])
    row.getCell(1).font = { bold: true, size: 11, color: { argb: colors.accent } }
    row.getCell(1).fill = { type: 'solid', fgColor: { argb: colors.subheader } }
    row.getCell(4).font = { bold: true, size: 11, color: { argb: colors.text } }
    row.getCell(4).fill = { type: 'solid', fgColor: { argb: 'FFECCCC1' } }
    row.height = 20
  })

  summarySheet.columns = [
    { width: 20 },
    { width: 15 },
    { width: 15 },
    { width: 20 },
  ]

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  // Download
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
