import React, { useEffect, useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import UserProfile from '../components/dashboard/UserProfile';
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
        await updateUser(user.user_id, data);
        const updated = await getUser(user.user_id);
        setProfile(updated);
        setUpdateLoading(false);
        setCurrent('profile');
    };

    const handleChangePassword = async (data: any) => {
        if (!user?.user_id) return;
        setUpdateLoading(true);
        await changePassword(user.user_id, data);
        setUpdateLoading(false);
        setCurrent('profile');
    };

    return (
        <div className="flex min-h-[80vh]">
            <Sidebar current={current} onSelect={setCurrent} />
            <main className="flex-1 p-6">
                {loading || !profile ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        {current === 'profile' && (
                            <UserProfile user={profile} />
                        )}
                        {current === 'posts' && (
                            <div className="mt-2">
                                <h3 className="text-xl font-bold text-blue-800 mb-4">Your Posts</h3>
                                <div className="flex flex-wrap gap-4 mb-6 items-center">
                                    <select
                                        className="border rounded px-3 py-2"
                                        value={postFilters.visibility || ''}
                                        onChange={e => setPostFilters(f => ({ ...f, visibility: e.target.value || undefined }))}
                                    >
                                        <option value="">All Visibility</option>
                                        {POST_VISIBILITY.map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                    <button
                                        className="px-4 py-2 rounded bg-gray-200 text-blue-900 font-semibold"
                                        onClick={() => setPostFilters({})}
                                    >
                                        Clear
                                    </button>
                                </div>
                                {postsLoading ? (
                                    <div>Loading your posts...</div>
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
                            <div className="mt-2">
                                <h3 className="text-xl font-bold text-blue-800 mb-4">Your Wishlists</h3>
                                <div className="flex flex-wrap gap-4 mb-6 items-center">
                                    <select
                                        className="border rounded px-3 py-2"
                                        value={wishlistFilters?.is_public === undefined ? '' : wishlistFilters.is_public ? 'public' : 'private'}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setWishlistFilters(f => ({ ...f, is_public: val === '' ? undefined : val === 'public' }));
                                        }}
                                    >
                                        <option value="">All Visibility</option>
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                    <button
                                        className="px-4 py-2 rounded bg-gray-200 text-blue-900 font-semibold"
                                        onClick={() => setWishlistFilters({})}
                                    >
                                        Clear
                                    </button>
                                </div>
                                <button
                                    className="px-5 py-2 rounded-lg bg-blue-700 text-white font-bold shadow hover:bg-blue-900 transition mb-6"
                                    onClick={() => { setShowForm(true); setEditing(null); }}
                                >
                                    + Add Wishlist
                                </button>
                                {showForm && (
                                    <WishlistForm
                                        initialValues={editing || {}}
                                        onSubmit={editing ? (v => handleUpdate(v as any)) : (v => handleCreate(v as any))}
                                        submitText={editing ? 'Update' : 'Create'}
                                        onBack={() => { setShowForm(false); setEditing(null); }}
                                    />
                                )}
                                {wishlistLoading ? (
                                    <div>Loading your wishlists...</div>
                                ) : filteredUserWishlists.length === 0 ? (
                                    <div>No wishlists found.</div>
                                ) : (
                                    <div className="flex flex-col gap-4">
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
                            <UpdateProfileForm initial={profile} onSubmit={handleProfileUpdate} loading={updateLoading} />
                        )}
                        {current === 'password' && (
                            <ChangePasswordForm onSubmit={handleChangePassword} loading={updateLoading} />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
