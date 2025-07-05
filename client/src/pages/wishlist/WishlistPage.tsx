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
            <div className="min-h-screen bg-white">
                <div className="max-w-4xl mx-auto px-6 py-16">
                    <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-5xl font-bold text-emerald-900 mb-2">
                                {editing ? 'Update Your Wishlist' : 'Create New Wishlist'}
                            </h2>
                            <p className="text-xl text-gray-600">Shape your travel aspirations into reality</p>
                        </div>
                        <WishlistForm
                            initialValues={editing || {}}
                            onSubmit={editing ? (v => handleUpdate(v as any)) : (v => handleCreate(v as any))}
                            submitText={editing ? 'Update Wishlist' : 'Create Wishlist'}
                            onBack={() => { setShowForm(false); setEditing(null); }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-5xl font-bold text-emerald-900 mb-2">Wishlists Collections</h2>
                            <p className="text-xl text-gray-600">Inspiring wishlists from fellow dreamers worldwide</p>
                        </div>
                        <button
                            className="px-8 py-4 rounded-2xl bg-sky-600 text-white text-lg font-bold border-4 border-sky-700 shadow-lg hover:bg-sky-700 hover:border-sky-800 transform hover:scale-105 transition-all duration-300"
                            onClick={() => { setShowForm(true); setEditing(null); }}
                        >
                            Create New
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-lg px-6 py-4 mb-8 font-semibold">
                        {error}
                    </div>
                )}

                <div className="w-full">
                    {loading ? (
                        <div className="text-center text-emerald-600 text-xl font-semibold py-8 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                            Loading wishlits collections...
                        </div>
                    ) : allPublicWishlists.length === 0 ? (
                        <div className="text-center text-emerald-700 text-lg py-8 bg-emerald-50 border-2 border-emerald-200 rounded-lg font-bold">
                            No dreams shared yet. Be the first to inspire others!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {allPublicWishlists.map((wishlist) => {
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
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
