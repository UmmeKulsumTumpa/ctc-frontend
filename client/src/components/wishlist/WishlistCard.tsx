import React from 'react';
import type { WishlistResponseDto } from '../../types/wishlist.type';

import { useAuth } from '../../contexts/AuthContext';

interface WishlistCardProps {
    wishlist: WishlistResponseDto;
    onEdit?: (wishlist: WishlistResponseDto) => void;
    onDelete?: (id: string) => void;
    alwaysShowActions?: boolean;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ wishlist, onEdit, onDelete, alwaysShowActions }) => {
    const { user } = useAuth();
    const isOwner = user && String(user.user_id) === String(wishlist.user_id);
    return (
        <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-emerald-900 mb-3 group-hover:text-emerald-700 transition-colors">
                        {wishlist.name}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
                            <div className="text-sky-600 text-sm font-medium mb-1">Region</div>
                            <div className="text-sky-900 font-bold">{wishlist.region || 'Anywhere'}</div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                            <div className="text-emerald-600 text-sm font-medium mb-1">Theme</div>
                            <div className="text-emerald-900 font-bold">{wishlist.theme || 'Open to anything'}</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                            wishlist.is_public 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                            {wishlist.is_public ? 'Public Dream' : 'Private Dream'}
                        </span>
                    </div>

                    <div className="text-gray-500 text-sm">
                        <span className="font-semibold">Created:</span> {new Date(wishlist.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                {(alwaysShowActions || isOwner) && (onEdit || onDelete) && (
                    <div className="flex gap-3 mt-4 md:mt-0 md:flex-col">
                        {onEdit && (
                            <button 
                                onClick={() => onEdit(wishlist)} 
                                className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold shadow-lg hover:bg-sky-700 transition-colors"
                            >
                                Edit
                            </button>
                        )}
                        
                        {onDelete && (
                            <button 
                                onClick={() => onDelete(wishlist.wishlist_id)} 
                                className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold shadow-lg hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistCard;
