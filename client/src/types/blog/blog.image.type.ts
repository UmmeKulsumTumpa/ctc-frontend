export interface BlogImage {
	image_id?: string;
	post_id: string;
	url: string;
	caption?: string;
	created_at?: string;
}

export interface BlogImageCreate {
	post_id: string;
	url: string;
	caption?: string;
}
