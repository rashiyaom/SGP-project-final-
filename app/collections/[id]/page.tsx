'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CollectionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to products page with collection filter
    router.push(`/products?collection=${params.id}`)
  }, [params.id, router])

  return null
}
