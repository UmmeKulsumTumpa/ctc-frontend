import React, { useEffect, useState } from 'react';
import UserProfile from '../components/dashboard/UserProfile';
import NotificationList from '../components/notification/NotificationList';
import UpdateProfileForm from '../components/dashboard/UpdateProfileForm';
import ChangePasswordForm from '../components/dashboard/ChangePasswordForm';
import BlogList from '../components/blog/BlogList';
import WishlistForm from '../components/wishlist/WishlistForm';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser, changePassword } from '../services/user.service';
import { getBlogsByUser } from '../services/blog/blog.service';
import WishlistCard from '../components/wishlist/WishlistCard';
import { useWishlist } from '../contexts/WishlistContext';
import { POST_VISIBILITY } from '../constants/blog.constants';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types/user.type';
import type { BlogPost } from '../types/blog/blog.type';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [current, setCurrent] = useState('profile');
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postFilters, setPostFilters] = useState<{ visibility?: string }>({});
    const [wishlistFilters, setWishlistFilters] = useState<{ is_public?: boolean }>({});
    const {
        userWishlists,
        loading: wishlistLoading,
        handleEdit: handleWishlistEdit,
        handleDelete: handleWishlistDelete,
        editing,
        showForm,
        handleUpdate,
        handleCreate,
        setShowForm,
        setEditing,
    } = useWishlist();

    // Filter wishlists for dashboard section (private/public)
    const filteredUserWishlists = userWishlists.filter(w => {
        if (wishlistFilters.is_public === undefined) return true;
        return w.is_public === wishlistFilters.is_public;
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.user_id) return;
        setLoading(true);
        getUser(user.user_id)
            .then(setProfile)
            .catch((error) => {
                console.error('Failed to load user profile:', error);
                // If user fetch fails, set a basic profile from auth context
                setProfile(user);
            })
            .finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        if (!user?.user_id) return;
        setPostsLoading(true);
        getBlogsByUser(String(user.user_id))
            .then(posts => {
                if (postFilters.visibility) {
                    setUserPosts(posts.filter(p => p.visibility === postFilters.visibility));
                } else {
                    setUserPosts(posts);
                }
            })
            .finally(() => setPostsLoading(false));
    }, [user, postFilters]);

    const handleProfileUpdate = async (data: any) => {
        if (!user?.user_id) return;
        setUpdateLoading(true);
        setError(null);
        try {
            await updateUser(user.user_id, data);
            const updated = await getUser(user.user_id);
            setProfile(updated);
            setCurrent('profile');
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            setError(error.message || 'Failed to update profile');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleChangePassword = async (data: any) => {
        if (!user?.user_id) return;
        setUpdateLoading(true);
        setError(null);
        try {
            await changePassword(user.user_id, data);
            setCurrent('profile');
        } catch (error: any) {
            console.error('Failed to change password:', error);
            setError(error.message || 'Failed to change password');
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Top Navigation */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-2xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-emerald-900 mb-2">Dashboard</h1>
                            <p className="text-gray-600 text-lg">Manage your travel journey</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'profile', label: 'Profile' },
                                { key: 'blogs', label: 'My Stories' },
                                { key: 'wishlists', label: 'Wishlists' },
                                { key: 'notifications', label: 'Notifications' },
                                { key: 'update', label: 'Edit Profile' },
                                { key: 'password', label: 'Security' }
                            ].map(item => (
                                <button
                                    key={item.key}
                                    onClick={() => setCurrent(item.key)}
                                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                                        current === item.key
                                            ? 'bg-emerald-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <p>{error}</p>
                        <button 
                            onClick={() => setError(null)}
                            className="text-red-500 hover:text-red-700 ml-2 text-sm underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Main Content */}
                <div className="w-full">
                    {loading || !profile ? (
                        <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-16 text-center">
                            <div className="text-emerald-600 text-2xl font-bold animate-pulse">
                                Loading your dashboard...
                            </div>
                        </div>
                    ) : (
                        <>
                            {current === 'notifications' && (
                                <NotificationList />
                            )}

                            {current === 'profile' && (
                                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8">
                                    <UserProfile user={profile} />
                                </div>
                            )}

                            {current === 'blogs' && (
                                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8">
                                    <div className="mb-8">
                                        <h3 className="text-4xl font-bold text-emerald-900 mb-2">Your Travel Stories</h3>
                                        <p className="text-xl text-gray-600">Manage your amazing adventure stories</p>
                                    </div>

                                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8">
                                        <div className="flex flex-wrap gap-4 items-center">
                                            <select
                                                className="border-2 border-emerald-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none bg-white shadow-sm"
                                                value={postFilters.visibility || ''}
                                                onChange={e => setPostFilters(f => ({ ...f, visibility: e.target.value || undefined }))}
                                            >
                                                <option value="">All Stories</option>
                                                {POST_VISIBILITY.map(v => (
                                                    <option key={v} value={v}>{v}</option>
                                                ))}
                                            </select>
                                            <button
                                                className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-bold border-2 border-gray-300 hover:bg-gray-300 transition-all shadow-sm"
                                                onClick={() => setPostFilters({})}
                                            >
                                                Reset Filter
                                            </button>
                                        </div>
                                    </div>

                                    {postsLoading ? (
                                        <div className="text-center text-emerald-600 text-xl font-bold animate-pulse py-8">
                                            Loading your stories...
                                        </div>
                                    ) : (
                                        <BlogList
                                            blogs={userPosts}
                                            userId={user?.user_id ? String(user.user_id) : undefined}
                                            onBlogClick={(blog) => navigate(`/blogs/${blog.post_id}`)}
                                            onEditBlog={(blog) => navigate(`/blogs/${blog.post_id}/edit`)}
                                            onDeleteBlog={() => { /** the delete logic will implement later */ }}
                                        />
                                    )}
                                </div>
                            )}

                            {current === 'wishlists' && (
                                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8">
                                    <div className="mb-8">
                                        <h3 className="text-4xl font-bold text-emerald-900 mb-2">Dream Destinations</h3>
                                        <p className="text-xl text-gray-600">Your bucket list of magical places</p>
                                    </div>

                                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8">
                                        <div className="flex flex-wrap gap-4 items-center mb-4">
                                            <select
                                                className="border-2 border-emerald-300 rounded-xl px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none bg-white shadow-sm"
                                                value={wishlistFilters?.is_public === undefined ? '' : wishlistFilters.is_public ? 'public' : 'private'}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setWishlistFilters(f => ({ ...f, is_public: val === '' ? undefined : val === 'public' }));
                                                }}
                                            >
                                                <option value="">All Dreams</option>
                                                <option value="public">Shared Dreams</option>
                                                <option value="private">Secret Dreams</option>
                                            </select>
                                            <button
                                                className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-bold border-2 border-gray-300 hover:bg-gray-300 transition-all shadow-sm"
                                                onClick={() => setWishlistFilters({})}
                                            >
                                                Reset Filter
                                            </button>
                                        </div>
                                        <button
                                            className="px-8 py-4 rounded-2xl bg-emerald-600 text-white text-lg font-bold border-2 border-emerald-600 shadow-lg hover:bg-emerald-700 hover:border-emerald-700 transition-all duration-300"
                                            onClick={() => { setShowForm(true); setEditing(null); }}
                                        >
                                            Add New Dream
                                        </button>
                                    </div>

                                    {showForm && (
                                        <div className="bg-white border-2 border-emerald-300 rounded-2xl p-6 mb-8">
                                            <WishlistForm
                                                initialValues={editing || {}}
                                                onSubmit={editing ? (v => handleUpdate(v as any)) : (v => handleCreate(v as any))}
                                                submitText={editing ? 'Update Dream' : 'Create Dream'}
                                                onBack={() => { setShowForm(false); setEditing(null); }}
                                            />
                                        </div>
                                    )}

                                    {wishlistLoading ? (
                                        <div className="text-center text-emerald-600 text-xl font-bold animate-pulse py-8">
                                            Loading your dreams list...
                                        </div>
                                    ) : filteredUserWishlists.length === 0 ? (
                                        <div className="text-center text-gray-500 text-lg py-8">
                                            No dreams found yet. Start dreaming!
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-6">
                                            {filteredUserWishlists.map((wishlist: any) => (
                                                <WishlistCard
                                                    key={wishlist.wishlist_id}
                                                    wishlist={wishlist}
                                                    onEdit={handleWishlistEdit}
                                                    onDelete={handleWishlistDelete}
                                                    alwaysShowActions={true}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {current === 'update' && (
                                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8">
                                    <div className="mb-8">
                                        <h3 className="text-4xl font-bold text-emerald-900 mb-2">Edit Your Profile</h3>
                                        <p className="text-xl text-gray-600">Update your traveler information</p>
                                    </div>
                                    <UpdateProfileForm initial={profile} onSubmit={handleProfileUpdate} loading={updateLoading} />
                                </div>
                            )}

                            {current === 'password' && (
                                <div className="bg-white border-2 border-sky-200 shadow-lg rounded-3xl p-8">
                                    <div className="mb-8">
                                        <h3 className="text-4xl font-bold text-sky-900 mb-2">Change Password</h3>
                                        <p className="text-xl text-gray-600">Keep your account secure</p>
                                    </div>
                                    <ChangePasswordForm onSubmit={handleChangePassword} loading={updateLoading} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
