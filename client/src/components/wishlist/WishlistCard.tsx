import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WishlistResponseDto } from '../../types/wishlist.type';
import type { PlaceDto } from '../../types/place.type';
import { useAuth } from '../../contexts/AuthContext';
import { getAllWishlists } from '../../services/wishlist.service';
import { getPlaceById } from '../../services/place.service';
import { PATHS } from '../../constants/path.constants';
import ConfirmAddToWishlistModal from './ConfirmAddToWishlistModal';
import UsersInterestedModal from './UsersInterestedModal';
import ShareWishlistModal from './ShareWishlistModal';
import PlaceDisplayModal from '../common/modals/PlaceDisplayModal';
import { WishlistIcons } from '../icons/wishlistIcons';
import { ActionIcons } from '../icons/actionIcons';

interface WishlistCardProps {
    wishlist: WishlistResponseDto;
    onEdit?: (wishlist: WishlistResponseDto) => void;
    onDelete?: (id: string) => void;
    alwaysShowActions?: boolean;
    showUsersInterested?: boolean;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
    wishlist,
    onEdit,
    onDelete,
    alwaysShowActions,
    showUsersInterested = true,
}) => {
    const { user } = useAuth();
    const isOwner = user && String(user.user_id) === String(wishlist.user_id);
    const navigate = useNavigate();

    const [interestedList, setInterestedList] = useState<WishlistResponseDto[]>([]);
    const [showInterested, setShowInterested] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [place, setPlace] = useState<PlaceDto | null>(null);
    const [loadingMap, setLoadingMap] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        wishlist.place_id &&
            getPlaceById(wishlist.place_id)
                .then(setPlace)
                .catch(console.error);
    }, [wishlist.place_id]);

    const loadInterested = async () => {
        const res = await getAllWishlists({
            place_id: wishlist.place_id,
            public: true,
        });
        setInterestedList(res);
        setShowInterested(true);
    };

    const openMap = async () => {
        if (!place && wishlist.place_id) {
            setLoadingMap(true);
            try {
                const p = await getPlaceById(wishlist.place_id);
                setPlace(p);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingMap(false);
            }
        }
        setShowMap(true);
    };

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}${PATHS.WISHLIST_SHARE.replace(':id', wishlist.wishlist_id)}`
        : '';

    return (
        <div className="relative bg-white rounded-2xl border-2 border-emerald-500 shadow-md hover:shadow-lg transition p-5 space-y-4">
            {/* Title & Ownership Actions */}
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2 min-w-0">
                    {/* Map/Location Icon on the left */}
                    <button
                        onClick={openMap}
                        disabled={loadingMap}
                        aria-label="View on map"
                        title="View on Map"
                        className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow transition focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60 mr-2"
                    >
                        <ActionIcons.Map size={18} />
                    </button>
                    <h3 className="text-xl font-bold text-navy-900 truncate">
                        {wishlist.name}
                    </h3>
                </div>
                {(alwaysShowActions || isOwner) && (
                    <div className="flex space-x-2 items-center">
                        {onEdit && (
                            <ActionIcons.Edit
                                onClick={() => onEdit(wishlist)}
                                className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
                                title="Edit Wishlist"
                                size={24}
                            />
                        )}
                        {onDelete && (
                            <ActionIcons.Delete
                                onClick={() => onDelete(wishlist.wishlist_id)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                title="Delete Wishlist"
                                size={24}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Visibility Badge */}
            <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${wishlist.is_public
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-navy-100 text-navy-700'
                    }`}
            >
                {wishlist.is_public ? 'Public' : 'Private'}
            </span>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 border rounded-md bg-sky-50">
                    <div className="text-xs uppercase font-semibold text-sky-600">
                        Region
                    </div>
                    <div className="mt-1 text-sm text-sky-900">
                        {wishlist.region || 'Anywhere'}
                    </div>
                </div>
                <div className="p-3 border rounded-md bg-emerald-50">
                    <div className="text-xs uppercase font-semibold text-emerald-600">
                        Theme
                    </div>
                    <div className="mt-1 text-sm text-emerald-900">
                        {wishlist.theme || 'Open'}
                    </div>
                </div>
                <div className="sm:col-span-2 p-3 border rounded-md bg-navy-50">
                    <div className="text-xs uppercase font-semibold text-navy-600">
                        Created
                    </div>
                    <div className="mt-1 text-sm text-navy-900">
                        {new Date(wishlist.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                    {showUsersInterested && (
                        <WishlistIcons.Users
                            onClick={loadInterested}
                            className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
                            size={24}
                        />
                    )}
                    {user && (
                        <WishlistIcons.TravelPlan
                            onClick={() => {
                                const participants = interestedList
                                    .filter(w => String(w.user_id) !== String(user.user_id))
                                    .map(w => ({
                                        user_id: String(w.user_id),
                                        role: 'Editor',
                                    }));
                                navigate(PATHS.TRAVEL_PLAN_CREATE, {
                                    state: { place_id: wishlist.place_id, participants },
                                });
                            }}
                            className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
                            size={24}
                        />
                    )}
                </div>
                <WishlistIcons.Share
                    onClick={() => setShowShare(true)}
                    className="text-sky-600 hover:text-sky-800 cursor-pointer"
                    size={24}
                />
            </div>

            {/* Modals */}
            {showInterested && (
                <UsersInterestedModal
                    wishlists={interestedList}
                    onClose={() => setShowInterested(false)}
                />
            )}
            <ConfirmAddToWishlistModal
                open={showConfirm}
                onConfirm={() => setShowConfirm(false)}
                onCancel={() => setShowConfirm(false)}
                wishlistName={wishlist.name}
            />
            {showShare && (
                <ShareWishlistModal link={shareUrl} onClose={() => setShowShare(false)} />
            )}
            {showMap && place && (
                <PlaceDisplayModal
                    isOpen={showMap}
                    onClose={() => setShowMap(false)}
                    latitude={Number(place.latitude)}
                    longitude={Number(place.longitude)}
                    placeName={place.name}
                    address={place.address}
                    title={`${wishlist.name} – Location`}
                />
            )}
        </div>
    );
};

export default WishlistCard;
