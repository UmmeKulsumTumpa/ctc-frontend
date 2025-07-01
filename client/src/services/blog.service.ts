import type { BlogPost } from "../types/blog.type";
import type { ApiResponse } from "../types/api.response.type";

export async function fetchPublicBlog(): Promise<BlogPost[]> {
    const url = 'http://localhost:8080/api/v1/posts';
    const res = await fetch(url);

    if(!res.ok) throw new Error('Failer to fetch blogs');

    const body: ApiResponse<BlogPost[]> = await res.json();

    if(!body.success) throw new Error(body.message || 'Unknown error')

    return body.data;
}
