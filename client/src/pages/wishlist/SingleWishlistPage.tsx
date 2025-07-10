import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAllWishlists } from '../../services/wishlist.service'
import WishlistDetailCard from '../../components/wishlist/WishlistDetailCard'
import type { WishlistResponseDto } from '../../types/wishlist.type'

const SingleWishlistPage = () => {
    const { id } = useParams<{ id: string }>()
    const [wishlist, setWishlist] = useState<WishlistResponseDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return
        setLoading(true)
        getAllWishlists({ wishlist_id: id })
            .then(res => {
                setWishlist(res[0] || null)
                setError(res.length === 0 ? 'Wishlist not found' : '')
            })
            .catch(() => setError('Failed to load wishlist'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-emerald-600 text-xl font-semibold">Loading wishlist...</div>
        </div>
    )
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-red-600 text-lg font-semibold">{error}</div>
        </div>
    )
    if (!wishlist) return null
    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <WishlistDetailCard wishlist={wishlist} />
            </div>
        </div>
    )
}

export default SingleWishlistPage
