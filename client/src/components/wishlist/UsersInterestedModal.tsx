import React from 'react'
import type { WishlistResponseDto } from '../../types/wishlist.type'
import { useAuth } from '../../contexts/AuthContext'

interface UsersInterestedModalProps {
    wishlists: WishlistResponseDto[]
    onClose: () => void
}

const UsersInterestedModal: React.FC<UsersInterestedModalProps> = ({ wishlists, onClose }) => {
    const { user } = useAuth()
    const filtered = wishlists.filter(w => !user || String(w.user_id) !== String(user.user_id))
    return (
        <div className="fixed left-0 top-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative mx-auto pointer-events-auto mt-24">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">×</button>

                <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                    Users Interested
                </h2>
                
                {filtered.length === 0 ? (
                    <div className="text-gray-600 text-center">No other users interested in this place yet.</div>
                ) : (
                    <ul className="space-y-3">
                        {filtered.map(w => (
                            <li key={w.user_id} className="flex items-center gap-3 border-b pb-2">
                                <span className="font-semibold text-emerald-700">User ID:</span>
                                <span className="text-gray-800">{w.user_id}</span>
                                <span className="ml-auto text-gray-500 text-xs">{w.theme || ''}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default UsersInterestedModal
