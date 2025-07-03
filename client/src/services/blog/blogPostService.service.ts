import axios from '../../utils/api';
import type { BlogPostService, BlogPostServiceCreate } from '../../types/blog/blog.postservice.type';
import { BLOG_API_BASE } from '../../constants/blog.constants';

export const getPostServices = async (postId: string): Promise<BlogPostService[]> => {
    const res = await axios.get(`${BLOG_API_BASE}/${postId}/services`);
    return res.data.data;
};

export const addPostService = async (data: BlogPostServiceCreate): Promise<BlogPostService> => {
    const res = await axios.post(`${BLOG_API_BASE}/${data.post_id}/services`, data);
    return res.data.data;
};

export const deletePostService = async (postId: string, postServiceId: string): Promise<void> => {
    await axios.delete(`${BLOG_API_BASE}/${postId}/services/${postServiceId}`);
};
