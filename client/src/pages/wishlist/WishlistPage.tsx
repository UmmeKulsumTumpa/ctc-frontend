import React, { useEffect, useState } from 'react';
import { getAllWishlists, createWishlist, updateWishlist, deleteWishlist } from '../../services/wishlist.service';
import type { WishlistResponseDto, CreateWishlistRequestDto, UpdateWishlistRequestDto } from '../../types/wishlist.type';
import WishlistCard from '../../components/wishlist/WishlistCard';
import WishlistForm from '../../components/wishlist/WishlistForm';

const WishlistPage: React.FC = () => {
    const [wishlists, setWishlists] = useState<WishlistResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<WishlistResponseDto | null>(null);
    const [showForm, setShowForm] = useState(false);

    const fetchWishlists = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllWishlists();
            setWishlists(data);
        } catch (err) {
            setError('Failed to load wishlists');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlists();
    }, []);


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

    if (showForm) {
        return (
            <div className="max-w-3xl mx-auto py-8 px-4">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 font-serif tracking-tight drop-shadow-lg">
                    {editing ? 'Edit Wishlist' : 'Create Wishlist'}
                </h2>
                <WishlistForm
                    initialValues={editing || {}}
                    onSubmit={editing ? handleUpdate : handleCreate}
                    submitText={editing ? 'Update' : 'Create'}
                    onBack={() => { setShowForm(false); setEditing(null); }}
                />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 font-serif tracking-tight drop-shadow-lg">Wishlists
            </h2>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            <button
                className="px-5 py-2 rounded-lg bg-blue-700 text-white font-bold shadow hover:bg-blue-900 transition mb-6"
                onClick={() => { setShowForm(true); setEditing(null); }}
            >
                + Add Wishlist
            </button>
            
            <div className="mt-6 flex flex-col gap-4">
                {loading ? (
                    <div>Loading...</div>
                ) : wishlists.length === 0 ? (
                    <div>No wishlists found.</div>
                ) : (
                    wishlists.map((wishlist) => (
                        <WishlistCard
                            key={wishlist.wishlist_id}
                            wishlist={wishlist}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            alwaysShowActions={false}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
