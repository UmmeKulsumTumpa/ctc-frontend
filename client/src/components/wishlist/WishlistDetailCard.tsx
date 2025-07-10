import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { WishlistResponseDto } from '../../types/wishlist.type'
import type { PlaceDto } from '../../types/place.type'
import WishlistCard from './WishlistCard'
import PlaceCard from '../place/PlaceCard'
import UsersInterestedList from './UsersInterestedList'
import { getPlaceById } from '../../services/place.service'
import { getAllWishlists } from '../../services/wishlist.service'
import { useAuth } from '../../contexts/AuthContext'

interface WishlistDetailCardProps {
    wishlist: WishlistResponseDto
}


const WishlistDetailCard: React.FC<WishlistDetailCardProps> = ({ wishlist }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [place, setPlace] = useState<PlaceDto | null>(null);
    const [placeLoading, setPlaceLoading] = useState(true);
    const [interested, setInterested] = useState<WishlistResponseDto[]>([]);
    const [interestedLoading, setInterestedLoading] = useState(true);

    useEffect(() => {
        setPlaceLoading(true);
        getPlaceById(wishlist.place_id)
            .then(setPlace)
            .catch(() => setPlace(null))
            .finally(() => setPlaceLoading(false));
    }, [wishlist.place_id]);

    useEffect(() => {
        setInterestedLoading(true);
        getAllWishlists({ place_id: wishlist.place_id, public: true })
            .then(setInterested)
            .catch(() => setInterested([]))
            .finally(() => setInterestedLoading(false));
    }, [wishlist.place_id]);

    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <button
                    className="mb-6 px-6 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-all"
                    onClick={() => navigate('/wishlists')}
                >
                    &larr; Back to Wishlists
                </button>
                <div className="w-full h-40 md:h-56 rounded-t-3xl bg-emerald-700 flex items-center justify-center mb-8">
                    <span className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg">
                        {wishlist.name}
                    </span>
                </div>


                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-8">
                    <h2 className="text-3xl font-bold text-emerald-900 mb-4 text-center">Place Details</h2>
                    {placeLoading ? (
                        <div className="text-emerald-400 text-center">Loading place details...</div>
                    ) : place ? (
                        <PlaceCard place={place} />
                    ) : (
                        <div className="text-red-400 text-center">Place not found.</div>
                    )}
                </div>

                
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-8">
                    <WishlistCard wishlist={wishlist} alwaysShowActions={false} showUsersInterested={false} />
                </div>

                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8">
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-blue-800 mb-4">Users Share the same Dream!</h2>
                        {interestedLoading ? (
                            <div className="text-blue-400">Loading users...</div>
                        ) : (
                            <UsersInterestedList wishlists={interested} currentUserId={user?.user_id} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WishlistDetailCard
