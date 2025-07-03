import api from '../utils/api';
import type {
    CreateWishlistRequestDto,
    UpdateWishlistRequestDto,
    WishlistResponseDto
} from '../types/wishlist.type';

const WISHLIST_API_BASE = '/wishlists';

export const createWishlist = async (data: CreateWishlistRequestDto): Promise<WishlistResponseDto> => {
    const res = await api.post(WISHLIST_API_BASE, data);
    return res.data.data;
};

export const getAllWishlists = async (filters: Partial<{ public: boolean; place_id: string; user_id: string; wishlist_id: string }> = {}): Promise<WishlistResponseDto[]> => {
    const res = await api.get(WISHLIST_API_BASE, { params: filters });
    return res.data.data;
};

export const updateWishlist = async (id: string, data: UpdateWishlistRequestDto): Promise<WishlistResponseDto> => {
    const res = await api.patch(`${WISHLIST_API_BASE}/${id}`, data);
    return res.data.data;
};

export const deleteWishlist = async (id: string): Promise<void> => {
    await api.delete(`${WISHLIST_API_BASE}/${id}`);
};
