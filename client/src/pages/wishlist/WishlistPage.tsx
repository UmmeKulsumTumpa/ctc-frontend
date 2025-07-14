import React from 'react';
import WishlistCard from '../../components/wishlist/WishlistCard';
import { WishlistIcons } from '../../components/icons/commonIcons';
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

    const [regionFilter, setRegionFilter] = React.useState('');
    const [themeFilter, setThemeFilter] = React.useState('');

    const regions = Array.from(new Set(allPublicWishlists.map(w => w.region).filter(Boolean)));
    const themes = Array.from(new Set(allPublicWishlists.map(w => w.theme).filter(Boolean)));

    const filteredWishlists = allPublicWishlists.filter(w => {
        return (
            (!regionFilter || w.region === regionFilter) &&
            (!themeFilter || w.theme === themeFilter)
        );
    });

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

    const fetchWishlists = () => {
        if (typeof (window as any).fetchWishlists === 'function') {
            (window as any).fetchWishlists();
        } else {
            window.location.reload();
        }
    };
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-5xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                                    Wishlists Collections
                                </h2>
                                <p className="text-xl text-gray-600">Inspiring wishlists from fellow dreamers worldwide</p>
                            </div>
                        </div>
                        <button
                            className="px-8 py-4 rounded-2xl bg-sky-600 text-white text-lg font-bold border-4 border-sky-700 shadow-lg hover:bg-sky-700 hover:border-sky-800 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            onClick={() => { setShowForm(true); setEditing(null); }}
                        >
                            <WishlistIcons.Add size={28} className="mr-1" />
                            Create
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-6 mb-10 flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-emerald-900 font-bold mb-2 flex items-center gap-2">
                            <WishlistIcons.Location size={18} className="text-emerald-500" />
                            Region
                        </label>
                        <select
                            className="w-full border-2 border-emerald-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none bg-emerald-50 text-emerald-900"
                            value={regionFilter}
                            onChange={e => setRegionFilter(e.target.value)}
                        >
                            <option value="">All Regions</option>
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-emerald-900 font-bold mb-2 flex items-center gap-2">
                            <WishlistIcons.Star size={18} className="text-yellow-400" />
                            Theme
                        </label>
                        <select
                            className="w-full border-2 border-emerald-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none bg-emerald-50 text-emerald-900"
                            value={themeFilter}
                            onChange={e => setThemeFilter(e.target.value)}
                        >
                            <option value="">All Themes</option>
                            {themes.map(theme => (
                                <option key={theme} value={theme}>{theme}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            className="px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold border-2 border-emerald-700 shadow-lg hover:bg-emerald-700 hover:border-emerald-800 transition-all flex items-center gap-2"
                            onClick={() => { setRegionFilter(''); setThemeFilter(''); }}
                        >
                            <WishlistIcons.Reset size={18} />
                        </button>
                    </div>
                </div>

                <div className="w-full">
                    {loading ? (
                        <div className="text-center text-emerald-600 text-xl font-semibold py-8 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                            Loading wishlits collections...
                        </div>
                    ) : filteredWishlists.length === 0 ? (
                        <div className="text-center text-emerald-700 text-lg py-8 bg-emerald-50 border-2 border-emerald-200 rounded-lg font-bold">
                            No dreams shared yet. Be the first to inspire others!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredWishlists.map((wishlist) => {
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

                {error && (
                    <div className="px-6 py-4 mb-8">
                        <div className="text-center text-red-500 text-lg font-semibold mb-8">
                            {error}
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={fetchWishlists}
                                className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-all"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default WishlistPage;
