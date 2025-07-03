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
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 hover:shadow-lg transition">
            <div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">{wishlist.name}</h3>
                <div className="text-gray-700 text-sm mb-1">
                    <b>Region:</b> 
                    {wishlist.region || '-'}
                </div>

                <div className="text-gray-700 text-sm mb-1">
                    <b>Theme:</b> 
                    {wishlist.theme || '-'}
                </div>

                <div className="text-gray-700 text-sm mb-1">
                    <b>Public:</b> 
                    {wishlist.is_public ? 'Yes' : 'No'}
                </div>

                <div className="text-gray-500 text-xs">
                    <b>Created:</b> 
                    {new Date(wishlist.created_at).toLocaleString()}
                </div>
            </div>

            {(alwaysShowActions || isOwner) && (onEdit || onDelete) && (
                <div className="flex gap-2 mt-4 md:mt-0">
                    {onEdit && <button onClick={() => onEdit(wishlist)} className="px-4 py-1 rounded bg-yellow-100 text-yellow-900 font-semibold hover:bg-yellow-200 transition">Edit</button>}
                    
                    {onDelete && <button onClick={() => onDelete(wishlist.wishlist_id)} className="px-4 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition">Delete</button>}
                </div>
            )}
        </div>
    );
};

export default WishlistCard;
