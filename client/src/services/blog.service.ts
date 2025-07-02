import axios from '../utils/api';
import type { BlogPost } from '../types/blog.type';
import type { BlogService } from '../types/blog.service.type';
import type { BlogImage } from '../types/blog.image.type';
import { BLOG_API_BASE } from '../constants/blog.constants';

export const getAllBlogs = async (): Promise<BlogPost[]> => {
    const res = await axios.get(BLOG_API_BASE);
    return res.data.data;
};

export const getBlogById = async (id: string): Promise<BlogPost> => {
    const res = await axios.get(`${BLOG_API_BASE}/${id}`);
    return res.data.data;
};

export const getBlogServices = async (postId: string): Promise<BlogService[]> => {
    const res = await axios.get(`${BLOG_API_BASE}/${postId}/services`);
    return res.data.data;
};

export const getBlogImages = async (postId: string): Promise<BlogImage[]> => {
    const res = await axios.get(`${BLOG_API_BASE}/${postId}/images`);
    return res.data.data;
};
