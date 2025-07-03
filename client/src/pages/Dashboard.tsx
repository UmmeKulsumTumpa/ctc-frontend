import React, { useEffect, useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import UserProfile from '../components/dashboard/UserProfile';
import UpdateProfileForm from '../components/dashboard/UpdateProfileForm';
import ChangePasswordForm from '../components/dashboard/ChangePasswordForm';
import BlogList from '../components/blog/BlogList';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser, changePassword } from '../services/user.service';
import { getBlogsByUser } from '../services/blog/blog.service';
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

    const handleUpdate = async (data: any) => {
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
                                    {/* <button
                                        className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
                                        onClick={() => setPostFilters(f => ({ ...f }))}
                                    >
                                        Apply
                                    </button> */}
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
                        {current === 'update' && (
                            <UpdateProfileForm initial={profile} onSubmit={handleUpdate} loading={updateLoading} />
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
