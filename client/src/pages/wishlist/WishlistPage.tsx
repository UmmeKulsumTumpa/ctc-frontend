import React from 'react';
import WishlistCard from '../../components/wishlist/WishlistCard';
import WishlistForm from '../../components/wishlist/WishlistForm';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';

const WishlistPage: React.FC = () => {

    const {
        allPublicWishlists,
        loading,
        error,
        editing,
        showForm,
        handleCreate,
        handleEdit,
        handleUpdate,
        handleDelete,
        setShowForm,
        setEditing,
    } = useWishlist();
    const { user } = useAuth();

    if (showForm) {
        return (
            <div className="max-w-3xl mx-auto py-8 px-4">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 font-serif tracking-tight drop-shadow-lg">
                    {editing ? 'Edit Wishlist' : 'Create Wishlist'}
                </h2>
                <WishlistForm
                    initialValues={editing || {}}
                    onSubmit={editing ? (v => handleUpdate(v as any)) : (v => handleCreate(v as any))}
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
                ) : allPublicWishlists.length === 0 ? (
                    <div>No wishlists found.</div>
                ) : (
                    allPublicWishlists.map((wishlist) => {
                        const isOwner = user && String(user.user_id) === String(wishlist.user_id);
                        return (
                            <WishlistCard
                                key={wishlist.wishlist_id}
                                wishlist={wishlist}
                                onEdit={isOwner ? handleEdit : undefined}
                                onDelete={isOwner ? handleDelete : undefined}
                                alwaysShowActions={false}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
