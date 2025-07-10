
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog, deleteBlog } from "../../services/blog/blog.service";
import BlogForm from "../../components/blog/BlogForm";
import type { BlogCreate } from "../../types/blog/blog.type";
import type { BlogPostServiceCreate } from "../../types/blog/blog.postservice.type";
import type { BlogImageCreate } from "../../types/blog/blog.image.type";
import { addPostService } from "../../services/blog/blogPostService.service";
import { addPostImage } from "../../services/blog/blogImage.service";
import BlogServiceForm from "../../components/blog/BlogServiceForm";
import BlogImageForm from "../../components/blog/BlogImageForm";

const BlogCreatePage: React.FC = () => {
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
        <div className="min-h-[85vh] bg-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold text-emerald-900 mb-2">Share Your Adventure</h2>
                        <p className="text-xl text-gray-600">Tell the world about your amazing travel experience</p>
                    </div>
                </div>

                {/* Error Messages */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-6 py-4 mb-8 text-lg font-medium">
                        ❌ {error}
                    </div>
                )}
                {detailedError && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl px-6 py-3 mb-8 text-sm">
                        {detailedError}
                    </div>
                )}

                {/* Main Form Container */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8 mb-10">
                    <BlogForm onSubmit={handleSubmit} submitLabel={loading ? "Publishing Story..." : "Publish Story"} />
                </div>

                {/* Services Section */}
                <div className="bg-white border-2 border-emerald-200 shadow-lg rounded-3xl p-8 mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-emerald-900">Add Travel Services</h3>
                            <p className="text-gray-600">Hotels, restaurants, or activities you recommend (optional)</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={handleAddServiceForm} 
                            className="px-6 py-3 bg-emerald-600 text-white border-2 border-emerald-700 rounded-xl font-bold shadow hover:bg-emerald-700 transition"
                        >
                            Add Service
                        </button>
                    </div>

                    <div className="space-y-6">
                        {serviceForms.map((svc, idx) => (
                            <div key={idx} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                                <BlogServiceForm
                                    postId=""
                                    onSubmit={data => handleServiceFormChange(idx, data)}
                                    initialData={svc}
                                />
                                {formErrors.services[idx] && <span className="text-sm text-red-500 mt-2 block">Please fill in required fields</span>}
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveServiceForm(idx)} 
                                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 border-2 border-red-200 rounded-xl font-bold hover:bg-red-200 transition"
                                >
                                    Remove Service
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images Section */}
                <div className="bg-white border-2 border-blue-200 shadow-lg rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-blue-900">Add Travel Photos</h3>
                            <p className="text-gray-600">Share beautiful moments from your journey (optional)</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={handleAddImageForm} 
                            className="px-6 py-3 bg-blue-600 text-white border-2 border-blue-700 rounded-xl font-bold shadow hover:bg-blue-700 transition"
                        >
                            Add Photo
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {imageForms.map((_, idx) => (
                            <div key={idx} className="relative bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                                <BlogImageForm
                                    postId=""
                                    onSubmit={data => handleImageFormChange(idx, data)}
                                />
                                {formErrors.images[idx] && <span className="text-sm text-red-500 mt-2 block">Please add image URL</span>}
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveImageForm(idx)} 
                                    className="absolute top-2 right-2 px-3 py-1 bg-red-100 text-red-700 border-2 border-red-200 rounded-xl text-sm font-bold hover:bg-red-200 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCreatePage;
