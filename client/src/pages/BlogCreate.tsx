
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog, deleteBlog } from "../services/blog.service";
import BlogForm from "../components/blog/BlogForm";
import type { BlogCreate } from "../types/blog.type";
import type { BlogPostServiceCreate } from "../types/blog.postservice.type";
import type { BlogImageCreate } from "../types/blog.image.type";
import { addPostService } from "../services/blogPostService.service";
import { addPostImage } from "../services/blogImage.service";
import BlogServiceForm from "../components/blog/BlogServiceForm";
import BlogImageForm from "../components/blog/BlogImageForm";

const BlogCreate: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [detailedError, setDetailedError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const [serviceForms, setServiceForms] = useState<Partial<BlogPostServiceCreate>[]>([]);
    const [imageForms, setImageForms] = useState<Partial<BlogImageCreate>[]>([]);
    const [formErrors, setFormErrors] = useState<{ services: boolean[], images: boolean[] }>({ services: [], images: [] });



    const validateService = (svc: Partial<BlogPostServiceCreate>) => !!svc.service_id;
    const validateImage = (img: Partial<BlogImageCreate>) => !!img.url;

    const handleSubmit = async (data: BlogCreate) => {
        setLoading(true);
        setError(null);
        setDetailedError(null);

        const validServices = serviceForms.map(validateService);
        const validImages = imageForms.map(validateImage);
        setFormErrors({ services: validServices.map(v => !v), images: validImages.map(v => !v) });

        const servicesToAdd = serviceForms.filter(validateService) as BlogPostServiceCreate[];
        const imagesToAdd = imageForms.filter(validateImage) as BlogImageCreate[];

        if (serviceForms.length > 0 && servicesToAdd.length === 0 && imageForms.length > 0 && imagesToAdd.length === 0) {
            setError("No valid services or images to add. Please fill required fields or remove empty forms.");
            setLoading(false);
            return;
        }

        let created: any = null;
        try {
            created = await createBlog(data);
            const post_id = created.post_id;
            for (let i = 0; i < servicesToAdd.length; i++) {
                try {
                    await addPostService({ ...servicesToAdd[i], post_id });
                } catch (svcErr: any) {
                    setDetailedError(`Failed to add service #${i + 1}: ${svcErr?.response?.data?.message || svcErr.message}`);
                    await deleteBlog(post_id);
                    setError("Post creation failed: could not add all services. The post was removed.");
                    setLoading(false);
                    return;
                }
            }
            for (let i = 0; i < imagesToAdd.length; i++) {
                try {
                    await addPostImage({ ...imagesToAdd[i], post_id });
                } catch (imgErr: any) {
                    setDetailedError(`Failed to add image #${i + 1}: ${imgErr?.response?.data?.message || imgErr.message}`);
                    await deleteBlog(post_id);
                    setError("Post creation failed: could not add all images. The post was removed.");
                    setLoading(false);
                    return;
                }
            }
            navigate(`/blogs/${post_id}`);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create blog.");
        } finally {
            setLoading(false);
        }
    };


    const handleAddServiceForm = () => setServiceForms([...serviceForms, {}]);
    const handleAddImageForm = () => setImageForms([...imageForms, {}]);
    const handleServiceFormChange = (idx: number, data: Partial<BlogPostServiceCreate>) => {
        const updated = [...serviceForms];
        updated[idx] = data;
        setServiceForms(updated);
    };
    const handleImageFormChange = (idx: number, data: Partial<BlogImageCreate>) => {
        const updated = [...imageForms];
        updated[idx] = data;
        setImageForms(updated);
    };
    const handleRemoveServiceForm = (idx: number) => setServiceForms(serviceForms.filter((_, i) => i !== idx));
    const handleRemoveImageForm = (idx: number) => setImageForms(imageForms.filter((_, i) => i !== idx));


    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 font-serif tracking-tight drop-shadow-lg">Create New Blog</h2>

            {error && <div className="text-red-500 mb-3 text-center text-lg font-semibold">{error}</div>}
            {detailedError && <div className="text-red-400 mb-3 text-center text-xs">{detailedError}</div>}

            <BlogForm onSubmit={handleSubmit} submitLabel={loading ? "Creating..." : "Create"} />

            <div className="mt-10">

                <h3 className="text-xl font-bold mb-3 text-blue-800">Services 
                    <span className="text-xs text-blue-400">(optional)</span>
                </h3>

                <button type="button" onClick={handleAddServiceForm} className="mb-3 px-4 py-2 bg-blue-50 text-blue-900 border border-blue-700 rounded-lg font-bold shadow hover:bg-blue-300 transition">Add Service</button>

                <ul className="space-y-4 mt-2">
                    {serviceForms.map((svc, idx) => (
                        <li key={idx} className="flex flex-col gap-2 border-b border-blue-100 pb-3">
                            <BlogServiceForm
                                postId=""
                                onSubmit={data => handleServiceFormChange(idx, data)}
                                initialData={svc}
                            />
                            {formErrors.services[idx] && <span className="text-xs text-red-500">Required fields missing</span>}
                            <button type="button" onClick={() => handleRemoveServiceForm(idx)} className="self-end px-3 py-1 text-xs bg-red-400 text-white rounded-lg shadow hover:bg-red-500 transition">Remove</button>
                        </li>
                    ))}
                </ul>

                <h3 className="text-xl font-bold mb-3 mt-10 text-blue-800">Images 
                    <span className="text-xs text-blue-400">(optional)</span>
                </h3>

                <button type="button" onClick={handleAddImageForm} className="mb-3 px-4 py-2 bg-blue-50 border border-blue-700 text-blue-900 rounded-lg font-bold shadow hover:bg-blue-300 transition">Add Image</button>

                <div className="flex flex-wrap gap-6 mt-2">
                    {imageForms.map((img, idx) => (
                        <div key={idx} className="relative flex flex-col items-center">
                            <BlogImageForm
                                postId=""
                                onSubmit={data => handleImageFormChange(idx, data)}
                                initialData={img}
                            />
                            {formErrors.images[idx] && <span className="text-xs text-red-500">Required fields missing</span>}
                            <button type="button" onClick={() => handleRemoveImageForm(idx)} className="absolute top-1 right-1 px-3 py-1 text-xs bg-red-400 text-white rounded-lg shadow hover:bg-red-500 transition">Remove</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogCreate;
