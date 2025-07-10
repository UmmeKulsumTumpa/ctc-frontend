import React from 'react'
import type { WishlistResponseDto } from '../../types/wishlist.type'

interface UsersInterestedListProps {
    wishlists: WishlistResponseDto[]
    currentUserId?: string | number
}

const UsersInterestedList: React.FC<UsersInterestedListProps> = ({ wishlists, currentUserId }) => {
    const filtered = wishlists.filter(w => String(w.user_id) !== String(currentUserId))
    if (filtered.length === 0) return null
    return (
        <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
                Other Users Interested
            </h3>

            <ul className="space-y-3">
                {filtered.map(w => (
                    <li key={w.user_id} className="flex items-center gap-3 border-b pb-2">
                        <span className="font-semibold text-emerald-700">User: </span>
                        <span className="text-gray-800">{w.user_id}</span>
                        <span className="ml-auto text-gray-500 text-xs">{w.theme || ''}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UsersInterestedList
