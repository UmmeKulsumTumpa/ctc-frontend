import axios from '../utils/api';
import type { BlogPost } from '../types/blog.type';
import type { BlogService } from '../types/blog.service.type';
import type { BlogImage } from '../types/blog.image.type';
import type { BlogCreate, BlogUpdate } from '../types/blog.type';
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

export const createBlog = async (data: BlogCreate): Promise<BlogPost> => {
    const res = await axios.post(BLOG_API_BASE, data);
    return res.data.data;
};

export const updateBlog = async (id: string, data: BlogUpdate): Promise<BlogPost> => {
    const res = await axios.patch(`${BLOG_API_BASE}/${id}`, data);
    return res.data.data;
};

export const deleteBlog = async (id: string): Promise<void> => {
    await axios.delete(`${BLOG_API_BASE}/${id}`);
};
