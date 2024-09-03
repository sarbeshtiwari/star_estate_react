import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { imageURL } from '../../../../imageURL';
import { addAdvertisement, fetchAdvertisementById, updateAdvertisement } from '../../../../api/advertisement/advertisement_api';

export default function AddAdvertisements() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        advertisementType: '',
        advertisementDate: '',
        advertisementLocation: '',
        advertisementImage: null
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
    //         const response = await fetchAdvertisementById(id);
    //         setFormData(response.data);
    //         if (response.data.advertisementImage) {
    //             setPreviewUrl(`${imageURL}/${response.data.advertisementImage}`);
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
                    advertisementImage: file
                }));
                
                // Clear any previous validation errors
                setValidationErrors(prevErrors => ({ ...prevErrors, advertisementImage: '' }));
                setPreviewUrl(URL.createObjectURL(file));
            } 
                
            catch (error) {
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
        if (!formData.advertisementType) errors.advertisementType = 'Event Name is required';
        if (!formData.advertisementDate) errors.advertisementDate = 'Date is required';
        if (!formData.advertisementLocation) errors.advertisementLocation = 'Location is requierd';
        if (!formData.advertisementImage) errors.advertisementImage = 'Image is required';
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
            //     response = await updateAdvertisement(id, data);
            // } else {
                response = await addAdvertisement(data);
            // }
            console.log('Success:', response.data);
            navigate(-1);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            alert('An error occurred. Please try again.');
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
                                        <form onSubmit={handleSubmit} id="add_eventsform" encType="multipart/form-data">
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
                                                        name="metaDescription"
                                                        id="metaDescription"
                                                        className="form-control"
                                                        rows="5"
                                                        value={formData.metaDescription}
                                                        onChange={handleInputChange}
                                                    ></textarea>
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Advertitement Type</label>
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
                                                {/* <div className="col-md-6 form-group">
                                                    <label className="label_field">Event Name</label>
                                                    <input
                                                        type="text"
                                                        name="advertisementType"
                                                        id="advertisementType"
                                                        className={`form-control ${validationErrors.advertisementType ? 'is-invalid' : ''}`}
                                                        value={formData.advertisementType}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.advertisementType && (
                                                        <div className="invalid-feedback">{validationErrors.advertisementType}</div>
                                                    )}
                                                </div> */}
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
                                                    <label className="label_field">Advertisement Location</label>
                                                    <input
                                                        type="text"
                                                        name="advertisementLocation"
                                                        id="advertisementLocation"
                                                        className={`form-control ${validationErrors.advertisementLocation ? 'is-invalid' : ''}`}
                                                        value={formData.advertisementLocation}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.advertisementLocation && (
                                                        <div className="invalid-feedback">{validationErrors.advertisementLocation}</div>
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
                                                    {previewUrl && (
                                                        <img
                                                            src={previewUrl}
                                                            alt="Event Image Preview"
                                                            className="img-thumbnail"
                                                            width="120"
                                                            height="70"
                                                        />
                                                    )}
                                                    {validationErrors.advertisementImage && (
                                                        <div className="invalid-feedback">{validationErrors.advertisementImage}</div>
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
