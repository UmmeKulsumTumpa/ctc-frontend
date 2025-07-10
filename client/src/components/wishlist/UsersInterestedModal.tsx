import React from 'react'
import type { WishlistResponseDto } from '../../types/wishlist.type'
import { useAuth } from '../../contexts/AuthContext'
import { ActionIcons } from '../icons/actionIcons'
import { WishlistIcons } from '../icons/wishlistIcons'

interface UsersInterestedModalProps {
    wishlists: WishlistResponseDto[]
    onClose: () => void
}

const UsersInterestedModal: React.FC<UsersInterestedModalProps> = ({ wishlists, onClose }) => {
    const { user } = useAuth()
    const filtered = wishlists.filter(w => !user || String(w.user_id) !== String(user.user_id))
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none backdrop-blur-xs">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-96 flex flex-col pointer-events-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <WishlistIcons.Users size={20} className="text-emerald-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Interested Users</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <ActionIcons.Cancel size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="text-center py-8">
                            <WishlistIcons.Users size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No other users interested in this place yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map(w => (
                                <div key={w.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <WishlistIcons.Users size={16} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">User {w.user_id}</div>
                                            {w.theme && <div className="text-sm text-gray-500">{w.theme}</div>}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${w.is_public 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'bg-gray-100 text-gray-600'}`}>
                                        {w.is_public ? 'Public' : 'Private'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UsersInterestedModal
