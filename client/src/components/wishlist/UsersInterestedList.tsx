import React from 'react'
import type { WishlistResponseDto } from '../../types/wishlist.type'
import { WishlistIcons } from '../icons/commonIcons'

interface UsersInterestedListProps {
    wishlists: WishlistResponseDto[]
    currentUserId?: string | number
}

const UsersInterestedList: React.FC<UsersInterestedListProps> = ({ wishlists, currentUserId }) => {
    const filtered = wishlists.filter(w => String(w.user_id) !== String(currentUserId))
    
    if (filtered.length === 0) {
        return (
            <div className="text-center py-8">
                <WishlistIcons.Users size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No other users interested in this place yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {filtered.map(w => (
                <div key={w.user_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <WishlistIcons.Users size={18} className="text-emerald-600" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">User {w.user_id}</div>
                            {w.theme && <div className="text-sm text-gray-500">{w.theme}</div>}
                            {w.region && <div className="text-sm text-gray-500">Region: {w.region}</div>}
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${w.is_public 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                        {w.is_public ? 'Public' : 'Private'}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default UsersInterestedList
