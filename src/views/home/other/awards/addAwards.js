import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { imageURL } from '../../../../imageURL';
import { addAward, fetchAwardById, updateAward } from '../../../../api/awards/awards_api';
import Swal from 'sweetalert2';

export default function AddAwards() {
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
        awardName: '',
        awardDate: '',
        
        awardImage: null
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // useEffect(() => {
    //     if (id !== 'add') {
    //         fetchEvent(id);
    //     }
    // }, [id]);

    // const fetchEvent = async (id) => {
    //     try {
    //         const response = await fetchAwardById(id);
    //         setFormData(response.data);
    //         if (response.data.awardImage) {
    //             setPreviewUrl(`${imageURL}/${response.data.awardImage}`);
    //         }
    //     } catch (err) {
    //         console.error('Failed to fetch data:', err);
    //     }
    // };

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
                    awardImage: file
                }));
                
                // Clear any previous validation errors
                setValidationErrors(prevErrors => ({ ...prevErrors, awardImage: '' }));
                setPreviewUrl(URL.createObjectURL(file));
            } 
                
            catch (error) {
                // Handle validation error
                setValidationErrors(prevErrors => ({ ...prevErrors, awardImage: error }));
            }
        } else {
            // Handle case when no file is selected
            setValidationErrors(prevErrors => ({ ...prevErrors, awardImage: 'No file selected.' }));
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
        if (!formData.awardName) errors.awardName = 'Event Name is required';
        if (!formData.awardDate) errors.awardDate = 'Date is required';
        if (!formData.awardImage) errors.awardImage = 'Image is required';
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
            // if (id !== 'add') {
            //     response = await updateAward(id, data);
            // } else {
                response = await addAward(data);
            // }
            Swal.fire({
                icon: 'success',
                title:  'Success!',
                text:  'Data added successfully.',
                confirmButtonText: 'OK',
                timer: 1000
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
                                    <h2>Add Awards</h2>
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
                                        <form onSubmit={handleSubmit} id="add_eventsform" encType="multipart/form-data">
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
                                                    <label className="label_field">Award Name</label>
                                                    <input
                                                        type="text"
                                                        name="awardName"
                                                        id="awardName"
                                                        className={`form-control ${validationErrors.awardName ? 'is-invalid' : ''}`}
                                                        value={formData.awardName}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.awardName && (
                                                        <div className="invalid-feedback">{validationErrors.awardName}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Award Date</label>
                                                    <input
                                                        type="date"
                                                        name="awardDate"
                                                        id="awardDate"
                                                        className={`form-control ${validationErrors.awardDate ? 'is-invalid' : ''}`}
                                                        value={formData.awardDate}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.awardDate && (
                                                        <div className="invalid-feedback">{validationErrors.awardDate}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Award Image</label>
                                                    <input
                                                        type="file"
                                                        name="awardImage"
                                                        id="awardImage"
                                                        className={`form-control ${validationErrors.awardImage ? 'is-invalid' : ''}`}
                                                        onChange={handleFileChange}
                                                    />
                                                    {previewUrl && (
                                                        <img
                                                            src={previewUrl}
                                                            alt="Event Image Preview"
                                                            className="img-thumbnail"
                                                            width="120"
                                                            height="70"
                                                        />
                                                    )}
                                                    {validationErrors.awardImage && (
                                                        <div className="invalid-feedback">{validationErrors.awardImage}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group margin_0">
                                                <button className="main_bt" type="submit" disabled={loading}>
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        // id === 'add' ? 
                                                        'Submit' 
                                                        // : 'Update'
                                                    )}
                                                </button>
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
