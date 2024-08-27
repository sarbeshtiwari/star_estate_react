import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from '../../sidebar';
import { fetchBlogById, addBlog, updateBlog } from '../../../../api/blogs/blogs_api';

export default function AddBlogs() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState('');

    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        blogsName: '',
        blogsBy: '',
        blogsDate: '',
        blogsCategory: '',
        blogsLink: '',
        blogsImage: null,
        imageTitle: '',
        content: ''
    });

    useEffect(() => {
        if (id !== 'add') {
            fetchBlog(id);
        }
    }, [id]);

    const fetchBlog = async (id) => {
        try {
            const blog = await fetchBlogById(id);
            setFormData(blog);
        } catch (err) {
            console.error('Failed to fetch data:', err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        
        if (file) {
            try {
                // Validate the file
                await validateImage(file);
                
                // If valid, update form data
                setFormData(prevState => ({
                    ...prevState,
                    blogsImage: file
                }));
                
                // Clear any previous validation errors
                setValidationErrors(prevErrors => ({ ...prevErrors, blogsImage: '' }));
                setPreviewUrl(URL.createObjectURL(file));
            } catch (error) {
                // Handle validation error
                setValidationErrors(prevErrors => ({ ...prevErrors, blogsImage: error }));
            }
        } else {
            // Handle case when no file is selected
            setValidationErrors(prevErrors => ({ ...prevErrors, blogsImage: 'No file selected.' }));
        }
    };
    

    const validateImage = (file) => {
        const allowedTypes = ["image/png", "image/webp", "image/jpeg"];
        const reader = new FileReader();
    
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const arr = new Uint8Array(reader.result).subarray(0, 4);
                let header = "";
                for (let i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }
    
                let fileType = "";
                switch (header) {
                    case "89504e47":
                        fileType = "image/png";
                        break;
                    case "52494646":
                        fileType = "image/webp";
                        break;
                    case "ffd8ffe0":
                    case "ffd8ffe1":
                    case "ffd8ffe2":
                    case "ffd8ffe3":
                    case "ffd8ffe8":
                        fileType = "image/jpeg";
                        break;
                    default:
                        fileType = "unknown";
                        break;
                }
    
                if (!allowedTypes.includes(fileType)) {
                    reject("Only JPG, JPEG, WEBP, and PNG formats are allowed.");
                } else {
                    resolve(file);
                }
            };
    
            reader.onerror = () => alert("Error reading file.");
            reader.readAsArrayBuffer(file);
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.blogsName) errors.blogsName = 'Blog Name Type is required';
        if (!formData.blogsBy) errors.blogsBy = 'Blog by is required';
        if (!formData.blogsDate) errors.blogsDate = 'Date is required';
        if (!formData.content) errors.content = 'Content is required';
        if (!formData.blogsImage) errors.blogsImage = 'Image is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
               

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        const data = new FormData();
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        }
        setLoading(true);
        try {
            if (id !== 'add') {
                await updateBlog(id, data);
            } else {
                await addBlog(data);
            }
            navigate('/blogs');
        } catch (error) {
            console.error('Error:', error.message);
        }
        setLoading(false);
    };

    const getImagePreviewUrl = () => {
        return formData.blogsImage ? URL.createObjectURL(formData.blogsImage) : '';
    };

    return (
        <div>
            <Sidebar />
            <div>
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>{id === 'add' ? 'Add Blogs' : 'Edit Blog'}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                    <button 
                                    className="btn btn-primary btn-xs float-right"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </button>
                                    </div>
                                    <div className="full price_table padding_infor_info">
                                        <form onSubmit={handleSubmit} id="add_blogs" encType="multipart/form-data">
                                            <div className="form-row">
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Meta Title</label>
                                                    <input
                                                        type="text"
                                                        name="metaTitle"
                                                        value={formData.metaTitle}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Meta Keyword</label>
                                                    <input
                                                        type="text"
                                                        name="metaKeyword"
                                                        value={formData.metaKeyword}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="label_field">Meta Description</label>
                                                    <textarea
                                                        name="metaDescription"
                                                        value={formData.metaDescription}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        rows="5"
                                                    ></textarea>
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="label_field">Blogs Name</label>
                                                    <input
                                                        type="text"
                                                        name="blogsName"
                                                        value={formData.blogsName}
                                                        onChange={handleInputChange}
                                                        className={`form-control ${validationErrors.blogsName ? 'is-invalid' : ''}`}
                                                    />
                                                    {validationErrors.blogsName && (
                                                            <div className="invalid-feedback">{validationErrors.blogsName}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Blogs By</label>
                                                    <input
                                                        type="text"
                                                        name="blogsBy"
                                                        value={formData.blogsBy}
                                                        onChange={handleInputChange}
                                                        className={`form-control ${validationErrors.blogsBy ? 'is-invalid' : ''}`}
                                                    />
                                                    {validationErrors.blogsBy && (
                                                            <div className="invalid-feedback">{validationErrors.blogsBy}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Blogs Date</label>
                                                    <input
                                                        type="date"
                                                        name="blogsDate"
                                                        value={formData.blogsDate}
                                                        onChange={handleInputChange}
                                                        className={`form-control ${validationErrors.blogsDate ? 'is-invalid' : ''}`}
                                                    />
                                                    {validationErrors.blogsDate && (
                                                            <div className="invalid-feedback">{validationErrors.blogsDate}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Blogs Category</label>
                                                    <select
                                                        name="blogsCategory"
                                                        value={formData.blogsCategory}
                                                        onChange={handleInputChange}
                                                        className={`form-control ${validationErrors.blogsCategory ? 'is-invalid' : ''}`}
                                                    >
                                                        <option value="">Select category</option>
                                                        <option value="blog">Blog</option>
                                                        <option value="news">News</option>
                                                        <option value="research">Research</option>
                                                    </select>
                                                    {validationErrors.blogsCategory && (
                                                            <div className="invalid-feedback">{validationErrors.blogsCategory}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Blog Link</label>
                                                    <input
                                                        type="text"
                                                        name="blogsLink"
                                                        value={formData.blogsLink}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Blogs Image</label>
                                                    <input
                                                        type="file"
                                                        name="blogsImage"
                                                        onChange={handleFileChange}
                                                        className={`form-control ${validationErrors.blogsImage ? 'is-invalid' : ''}`}
                                                    />
                                                    {formData.blogsImage && (
                                                        <img
                                                            src={previewUrl}
                                                            alt="Blogs Image"
                                                            className="img-thumbnail mt-2"
                                                            width="120"
                                                            height="70"
                                                        />
                                                    )}
                                                    {validationErrors.blogsImage && (
                                                            <div className="invalid-feedback">{validationErrors.blogsImage}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Image Title</label>
                                                    <input
                                                        type="text"
                                                        name="imageTitle"
                                                        value={formData.imageTitle}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="label_field">Content</label>
                                                    <textarea
                                                        rows={5}
                                                        name="content"
                                                        value={formData.content}
                                                        onChange={handleInputChange}
                                                        className={`form-control ${validationErrors.content ? 'is-invalid' : ''}`}
                                                    ></textarea>
                                                    {validationErrors.content && (
                                                            <div className="invalid-feedback">{validationErrors.content}</div>
                                                        )}
                                                </div>
                                            </div>

                                            <div className="form-group margin_0">
                                                {id === 'add' ? ( 
                                                    <button className="main_bt" type="submit" disabled={loading}>
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        'Submit'
                                                    )}
                                                </button>) : ( <button className="main_bt" type="submit" disabled={loading}>
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        'Update'
                                                    )}
                                                </button>)}
                                               
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
