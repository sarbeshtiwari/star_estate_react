import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { imageURL } from '../../../../imageURL';
import { addAdvertisement, fetchAdvertisementById, updateAdvertisement } from '../../../../api/advertisement/advertisement_api';
import Swal from 'sweetalert2';

export default function AddAdvertisements() {
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);
    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        advertisementType: '',
        advertisementDate: '',
        advertisementTitle: '',
        videoURL: '',
        advertisementImage: null
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
                    advertisementImage: file
                }));
                
                // Clear any previous validation errors
                setValidationErrors(prevErrors => ({ ...prevErrors, advertisementImage: '' }));
                setPreviewUrl(URL.createObjectURL(file));
            } catch (error) {
                // Handle validation error
                setValidationErrors(prevErrors => ({ ...prevErrors, advertisementImage: error }));
            }
        } else {
            // Handle case when no file is selected
            setValidationErrors(prevErrors => ({ ...prevErrors, advertisementImage: 'No file selected.' }));
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
        if (!formData.metaTitle) errors.metaTitle = 'Meta Title is required';
        if (!formData.metaKeyword) errors.metaKeyword = 'Meta Keyword is required';
        if (!formData.metaDescription) errors.metaDescription = 'Meta Description is required';
        if (!formData.advertisementType) errors.advertisementType = 'Advertisement Type is required';
        if (!formData.advertisementDate) errors.advertisementDate = 'Date is required';
        if (!formData.advertisementTitle) errors.advertisementTitle = 'Location is required';

        if (formData.advertisementType !== 'radio' && !formData.advertisementImage) {
            errors.advertisementImage = 'Image is required';
        }

        if (formData.advertisementType === 'radio' && !formData.videoURL) {
            errors.videoURL = 'Video URL is required';
        }

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
            response = await addAdvertisement(data);
            Swal.fire({
                icon: 'success',
                title:  'Success!',
                text:  'Data added successfully.',
                confirmButtonText: 'OK',
                timer: 1000,
                    timerProgressBar: true,
            });
            navigate(-1);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add/update data.',
                confirmButtonText: 'OK'
            });
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
                                    <h2>Add Advertisements</h2>
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
                                        <form onSubmit={handleSubmit} id="add_advertisementsform" encType="multipart/form-data">
                                            <div className="form-row">
                                            <div className="col-md-6 form-group">
                                                    <label className="label_field">Meta Title</label>
                                                    <input
                                                        type="text"
                                                        name="metaTitle"
                                                        value={formData.metaTitle}
                                                        onChange={handleInputChange}
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
                                                        onChange={handleInputChange}
                                                        className={`form-control ${validationErrors.metaKeyword ? 'is-invalid' : ''}`}
                                                        />
                                                        {validationErrors.metaKeyword && (
                                                                        <div className="invalid-feedback">{validationErrors.metaKeyword}</div>
                                                                    )}
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="label_field">Meta Description</label>
                                                    <textarea
                                                        rows={'5'}
                                                        name="metaDescription"
                                                        value={formData.metaDescription}
                                                        onChange={handleInputChange}
                                                        className={`form-control ${validationErrors.metaDescription ? 'is-invalid' : ''}`}
                                                        />
                                                        {validationErrors.metaDescription && (
                                                                        <div className="invalid-feedback">{validationErrors.metaDescription}</div>
                                                                    )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Advertisement Type</label>
                                                    <select
                                                        name="advertisementType"
                                                        className={`form-control ${validationErrors.advertisementType ? 'is-invalid' : ''}`}
                                                        value={formData.advertisementType}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="">Select category</option>
                                                        <option value="print">Print</option>
                                                        <option value="outdoor">Outdoor</option>
                                                        <option value="radio">Radio</option>
                                                    </select>
                                                    {validationErrors.advertisementType && (
                                                        <div className="invalid-feedback">{validationErrors.advertisementType}</div>
                                                    )}
                                                </div>

                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Advertisement Date</label>
                                                    <input
                                                        type="date"
                                                        name="advertisementDate"
                                                        id="advertisementDate"
                                                        className={`form-control ${validationErrors.advertisementDate ? 'is-invalid' : ''}`}
                                                        value={formData.advertisementDate}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.advertisementDate && (
                                                        <div className="invalid-feedback">{validationErrors.advertisementDate}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Advertisement Title</label>
                                                    <input
                                                        type="text"
                                                        name="advertisementTitle"
                                                        id="advertisementTitle"
                                                        className={`form-control ${validationErrors.advertisementTitle ? 'is-invalid' : ''}`}
                                                        value={formData.advertisementTitle}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.advertisementTitle && (
                                                        <div className="invalid-feedback">{validationErrors.advertisementTitle}</div>
                                                    )}
                                                </div>

                                                {/* Conditionally render Video URL or Image Upload */}
                                                {formData.advertisementType === 'radio' ? (
                                                    <>
                                                    <div className="col-md-6 form-group">
                                                        <label className="label_field">Video URL</label>
                                                        <input
                                                            type="text"
                                                            name="videoURL"
                                                            id="videoURL"
                                                            className={`form-control ${validationErrors.videoURL ? 'is-invalid' : ''}`}
                                                            value={formData.videoURL}
                                                            onChange={handleInputChange}
                                                        />
                                                        {validationErrors.videoURL && (
                                                            <div className="invalid-feedback">{validationErrors.videoURL}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                    <label className="label_field">Advertisement Image</label>
                                                    <input
                                                        type="file"
                                                        name="advertisementImage"
                                                        id="advertisementImage"
                                                        className={`form-control ${validationErrors.advertisementImage ? 'is-invalid' : ''}`}
                                                        onChange={handleFileChange}
                                                    />
                                                    {validationErrors.advertisementImage && (
                                                        <div className="invalid-feedback">{validationErrors.advertisementImage}</div>
                                                    )}
                                                </div>
                                                </>
                                                ) : (
                                                    <div className="col-md-6 form-group">
                                                        <label className="label_field">Advertisement Image</label>
                                                        <input
                                                            type="file"
                                                            name="advertisementImage"
                                                            id="advertisementImage"
                                                            className={`form-control ${validationErrors.advertisementImage ? 'is-invalid' : ''}`}
                                                            onChange={handleFileChange}
                                                        />
                                                        {validationErrors.advertisementImage && (
                                                            <div className="invalid-feedback">{validationErrors.advertisementImage}</div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Image Preview */}
                                                {previewUrl && (
                                                    <div className="col-md-6 form-group">
                                                        <img src={previewUrl} alt="Advertisement Preview" style={{ maxHeight: '200px' }} />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                className="main_bt"
                                                disabled={loading}
                                            >
                                                {loading ? 'Loading...' : 'Submit'}
                                            </button>
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
