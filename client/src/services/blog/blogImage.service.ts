import axios from '../../utils/api';
import type { BlogImage, BlogImageCreate } from '../../types/blog/blog.image.type';
import { BLOG_API_BASE } from '../../constants/blog.constants';

export const getPostImages = async (postId: string): Promise<BlogImage[]> => {
    const res = await axios.get(`${BLOG_API_BASE}/${postId}/images`);
    return res.data.data;
};

export const addPostImage = async (data: BlogImageCreate): Promise<BlogImage> => {
    const res = await axios.post(`${BLOG_API_BASE}/${data.post_id}/images`, data);
    return res.data.data;
};

export const deletePostImage = async (postId: string, imageId: string): Promise<void> => {
    await axios.delete(`${BLOG_API_BASE}/${postId}/images/${imageId}`);
};
