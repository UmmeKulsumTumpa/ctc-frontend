import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getAllWishlists, createWishlist, updateWishlist, deleteWishlist } from '../services/wishlist.service';
import { useAuth } from './AuthContext';
import type { WishlistResponseDto, CreateWishlistRequestDto, UpdateWishlistRequestDto } from '../types/wishlist.type';

interface WishlistContextType {
    allPublicWishlists: WishlistResponseDto[];
    userWishlists: WishlistResponseDto[];
    loading: boolean;
    error: string | null;
    editing: WishlistResponseDto | null;
    showForm: boolean;
    fetchWishlists: () => void;
    handleCreate: (values: CreateWishlistRequestDto) => void;
    handleEdit: (wishlist: WishlistResponseDto) => void;
    handleUpdate: (values: UpdateWishlistRequestDto) => void;
    handleDelete: (id: string) => void;
    setShowForm: (show: boolean) => void;
    setEditing: (wishlist: WishlistResponseDto | null) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [allPublicWishlists, setAllPublicWishlists] = useState<WishlistResponseDto[]>([]);
    const [userWishlists, setUserWishlists] = useState<WishlistResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<WishlistResponseDto | null>(null);
    const [showForm, setShowForm] = useState(false);

    const fetchWishlists = async () => {
        setLoading(true);
        setError(null);
        try {
            const [publicData, userData] = await Promise.all([
                getAllWishlists({ public: true }),
                user?.user_id ? getAllWishlists({ user_id: String(user.user_id) }) : Promise.resolve([]),
            ]);
            setAllPublicWishlists(publicData);
            setUserWishlists(userData);
        } catch (err) {
            setError('Failed to load wishlists');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlists();
    }, [user?.user_id]);

    const handleCreate = (values: CreateWishlistRequestDto) => {
        createWishlist(values)
            .then(() => {
                setShowForm(false);
                fetchWishlists();
            })
            .catch(() => setError('Failed to create wishlist'));
    };

    const handleEdit = (wishlist: WishlistResponseDto) => {
        setEditing(wishlist);
        setShowForm(true);
    };

    const handleUpdate = (values: UpdateWishlistRequestDto) => {
        if (!editing) return;
        updateWishlist(editing.wishlist_id, values)
            .then(() => {
                setEditing(null);
                setShowForm(false);
                fetchWishlists();
            })
            .catch(() => setError('Failed to update wishlist'));
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this wishlist?')) return;
        try {
            await deleteWishlist(id);
            fetchWishlists();
        } catch {
            setError('Failed to delete wishlist');
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                allPublicWishlists,
                userWishlists,
                loading,
                error,
                editing,
                showForm,
                fetchWishlists,
                handleCreate,
                handleEdit,
                handleUpdate,
                handleDelete,
                setShowForm,
                setEditing,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
