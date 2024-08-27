import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchNewsById, addNews, updateNews } from '../../../../api/news/news_api'; // Adjust the path as needed

export default function AddNewsPaper() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState('');

    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDesc: '',
        heading: '',
        paperName: '',
        newsDate: '',
        newsState: '',
        imageTitle: '',
        newsThumb: null,
        newsImage: null
    });

    useEffect(() => {
        if (id !== 'add') {
            fetchNews(id);
        }
    }, [id]);

    const fetchNews = async (id) => {
        try {
            setLoading(true)
            const response = await fetchNewsById(id);
            setFormData(response.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
        setLoading(false)
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const { name } = e.target;
    
        if (file) {
            try {
                // Validate the image
                await validateImage(file);
    
                // If valid, update form data
                setFormData(prevState => ({
                    ...prevState,
                    [name]: file
                }));
    
                // Clear any previous validation errors for this file
                setValidationErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
                setPreviewUrl(URL.createObjectURL(file));
            } catch (error) {
                // Handle validation error
                setValidationErrors(prevErrors => ({ ...prevErrors, [name]: error }));
            }
        } else {
            // Handle case when no file is selected
            setValidationErrors(prevErrors => ({ ...prevErrors, [name]: 'No file selected.' }));
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
    
            reader.onerror = () => reject("Error reading file.");
            reader.readAsArrayBuffer(file);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.heading) errors.heading = 'Title is required';
        if (!formData.paperName) errors.paperName = 'Paper Name is required';
        if (!formData.newsDate) errors.newsDate = 'News Date is required';
        if (!formData.newsState) errors.newsState = 'News State is required';
        if (!formData.imageTitle) errors.imageTitle = 'Image Title is required';
        if (!formData.newsThumb) errors.newsThumb = 'Image is required';
        if (!formData.newsImage) errors.newsImage = 'Image is required';
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
            let response;
            if (id !== 'add') {
                // Update existing news
                response = await updateNews(id, data);
            } else {
                // Add new news
                response = await addNews(data);
            }
            console.log('Success:', response.data);
            navigate(-1); // Navigate back to the previous page
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
        setLoading(false);
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
                                    <h2>{id !== 'add' ? 'Edit News Paper' : 'Add News Paper'}</h2>
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
                                        <form onSubmit={handleSubmit} id="add_news" encType="multipart/form-data">
                                            <div className="form-row">
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Meta Title</label>
                                                    <input
                                                        type="text"
                                                        name="metaTitle"
                                                        id="metaTitle"
                                                        className="form-control"
                                                        value={formData.metaTitle}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Meta Keyword</label>
                                                    <input
                                                        type="text"
                                                        name="metaKeyword"
                                                        id="metaKeyword"
                                                        className="form-control"
                                                        value={formData.metaKeyword}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="label_field">Meta Description</label>
                                                    <textarea
                                                        name="metaDesc"
                                                        id="metaDesc"
                                                        className="form-control"
                                                        rows="5"
                                                        value={formData.metaDesc}
                                                        onChange={handleInputChange}
                                                    ></textarea>
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Heading</label>
                                                    <input
                                                        type="text"
                                                        name="heading"
                                                        id="heading"
                                                        className={`form-control ${validationErrors.heading ? 'is-invalid' : ''}`}
                                                        value={formData.heading}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.heading && (
                                                            <div className="invalid-feedback">{validationErrors.heading}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">News Paper Name</label>
                                                    <input
                                                        type="text"
                                                        name="paperName"
                                                        id="paperName"
                                                        className={`form-control ${validationErrors.paperName ? 'is-invalid' : ''}`}
                                                        value={formData.paperName}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.paperName && (
                                                            <div className="invalid-feedback">{validationErrors.paperName}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">News Date</label>
                                                    <input
                                                        type="date"
                                                        name="newsDate"
                                                        id="newsDate"
                                                        className={`form-control ${validationErrors.newsDate ? 'is-invalid' : ''}`}
                                                        value={formData.newsDate}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.newsDate && (
                                                            <div className="invalid-feedback">{validationErrors.newsDate}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">News State</label>
                                                    <input
                                                        type="text"
                                                        name="newsState"
                                                        id="newsState"
                                                        className={`form-control ${validationErrors.newsState ? 'is-invalid' : ''}`}
                                                        value={formData.newsState}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.newsState && (
                                                            <div className="invalid-feedback">{validationErrors.newsState}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Image Title</label>
                                                    <input
                                                        type="text"
                                                        name="imageTitle"
                                                        id="imageTitle"
                                                        className={`form-control ${validationErrors.imageTitle ? 'is-invalid' : ''}`}
                                                        value={formData.imageTitle}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.imageTitle && (
                                                            <div className="invalid-feedback">{validationErrors.imageTitle}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">News Thumb</label>
                                                    <input
                                                        type="file"
                                                        name="newsThumb"
                                                        id="newsThumb"
                                                        className={`form-control ${validationErrors.newsThumb ? 'is-invalid' : ''}`}
                                                        onChange={handleFileChange}
                                                    />
                                                    {formData.newsThumb && (
                                                        <img
                                                            src={previewUrl}
                                                            alt="Thumbnail Preview"
                                                            className="img-thumbnail mt-2"
                                                            width="120"
                                                            height="70"
                                                        />
                                                    )}
                                                    {validationErrors.newsThumb && (
                                                            <div className="invalid-feedback">{validationErrors.newsThumb}</div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">News Image</label>
                                                    <input
                                                        type="file"
                                                        name="newsImage"
                                                        id="newsImage"
                                                        className={`form-control ${validationErrors.newsImage ? 'is-invalid' : ''}`}
                                                        onChange={handleFileChange}
                                                    />
                                                    {formData.newsImage && (
                                                        <img
                                                            src={previewUrl}
                                                            alt="Image Preview"
                                                            className="img-thumbnail mt-2"
                                                            width="120"
                                                            height="70"
                                                        />
                                                    )}
                                                    {validationErrors.newsImage && (
                                                            <div className="invalid-feedback">{validationErrors.newsImage}</div>
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
