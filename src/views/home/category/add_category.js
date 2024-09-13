import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Sidebar from '../sidebar';
import { addCategories, getCategoryById, updateCategories } from '../../../api/category/category_api';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddCategory = () => {
    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        category: '',
        content: ''
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (id !== 'add') {
            // Fetch category details based on id
            fetchCategoryDetails(id);
        }
    }, [id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, [id]);

    const fetchCategoryDetails = async (id) => {
        setLoading(true);
        try {
            const categoryData = await getCategoryById(id);
            setFormData({
                metaTitle: categoryData.metaTitle || '',
                metaKeyword: categoryData.metaKeyword || '',
                metaDescription: categoryData.metaDescription || '',
                category: categoryData.category || '',
                content: categoryData.content || ''
            });
        } catch (error) {
            setStatusMessage('Error fetching category details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.metaTitle) errors.metaTitle = 'Meta Title is required';
        if (!formData.metaKeyword) errors.metaKeyword = 'Meta Keyword is required';
        if (!formData.metaDescription) errors.metaDescription = 'Meta Description is required';
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.content) errors.content = 'Content is required';
        return errors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const { metaTitle, metaKeyword, metaDescription, category, content } = formData;

        const dataToSubmit = {
            metaTitle: metaTitle || ' ',
            metaKeyword: metaKeyword || ' ',
            metaDescription: metaDescription || ' ',
            category,
            content: content || ' '
        };

        setLoading(true);
        try {
            let response;

            if (id !== 'add') {
                response = await updateCategories(id, dataToSubmit);
                // axios.put(`https://star-estate-api.onrender.com/categories/updateCategory/${id}`, dataToSubmit);
            } else {
                response = await addCategories(dataToSubmit);
                // axios.post(`https://star-estate-api.onrender.com/categories/addCategory`, dataToSubmit);
            }

            // if (response.status !== 200) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }

            
           

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title:  'Success!',
                    text:  'Data added successfully.',
                    confirmButtonText: 'OK',
                    timer: 1000,
                    timerProgressBar: true,
                });
                navigate(-1);
            } else {
                setStatusMessage(`Failed to save category: ${response.message}`);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add/update data.',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
            <div>
                <Sidebar/>
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>{id === 'add' ? 'Add Category' : 'Edit Category'}</h2>
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
                                        <span className="status text-danger">{statusMessage}</span>
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-row">
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Meta Title</label>
                                                    <input
                                                        type="text"
                                                        name="metaTitle"                                                        
                                                        value={formData.metaTitle}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                        className={`form-control ${validationErrors.metaTitle ? 'is-invalid' : ''}`}
                                            />
                                            {validationErrors.metaTitle && (
                                                            <div className="invalid-feedback">{validationErrors.metaTitle}</div>
                                                        )}                                                 
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Meta Keyword</label>
                                                    <input
                                                        type="text"
                                                        name="metaKeyword"
                                                        value={formData.metaKeyword}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                        className={`form-control ${validationErrors.metaKeyword ? 'is-invalid' : ''}`}
                                                        />
                                                        {validationErrors.metaKeyword && (
                                                                        <div className="invalid-feedback">{validationErrors.metaKeyword}</div>
                                                                    )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Meta Description</label>
                                                    <input
                                                        type="text"
                                                        name="metaDescription"
                                                        
                                                        value={formData.metaDescription}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                        className={`form-control ${validationErrors.metaDescription ? 'is-invalid' : ''}`}
                                                        />
                                                        {validationErrors.metaDescription && (
                                                                        <div className="invalid-feedback">{validationErrors.metaDescription}</div>
                                                                    )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Category</label>
                                                    <input
                                                        type="text"
                                                        name="category"
                                                        className={`form-control ${validationErrors.category ? 'is-invalid' : ''}`}
                                                        value={formData.category}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                    />
                                                    {validationErrors.category && (
                                                            <div className="invalid-feedback">{validationErrors.category}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="label_field">Content</label>
                                                    <textarea
                                                    rows={5}
                                                        name="content"
                                                        
                                                        value={formData.content}
                                                        onChange={handleChange}
                                                        disabled={loading}
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
        
    );
};

export default AddCategory;
