import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../sidebar';
import { fetchCityDetails, addCity, updateCity } from '../../../../api/location/location_api';

export default function AddLocation() {
    const navigate = useNavigate();
    const { ids, id } = useParams();

    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        location_type: '',
        location: '',
        state: '',
        priority: '',
        ctcontent: '',
        schema: '',
        content_above_faqs: ''
    });

    const [image, setImage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');


    useEffect(() => {
        if (id !== 'add') {
            fetchCityDetails(ids, id)
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        const city = data[0];
                        const specificDataItem = city.data.find(item => item.location_type === id);
                        if (specificDataItem) {
                            setFormData({
                                metaTitle: specificDataItem.metaTitle || '',
                                metaKeyword: specificDataItem.metaKeyword || '',
                                metaDescription: specificDataItem.metaDescription || '',
                                location_type: specificDataItem.location_type || '',
                                location: city.location || '',
                                state: city.state || '',
                                priority: city.priority || '',
                                ctcontent: specificDataItem.ctcontent || '',
                                schema: specificDataItem.schema || '',
                                content_above_faqs: specificDataItem.content_above_faqs || ''
                                
                            });
                            
                            setImage({
                                image: specificDataItem.image ? specificDataItem.image : null
                            })
                            if (specificDataItem.image) {
                                setPreviewUrl(`${specificDataItem.image}`);
                                
                            }
                            
                        } else {
                            console.error('Specific data item not found');
                        }
                    } else {
                        console.error('City array is empty or not an array');
                    }
                })
                .catch(error => console.error(error));
        }
    }, [ids, id]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Validate the file
                await validateImage(file);
                
                // If valid, update the image state
                setImage(file);
                
                // Clear any previous validation errors
                setValidationErrors(prevErrors => ({ ...prevErrors, image: '' }));
                setPreviewUrl(URL.createObjectURL(file));
            } catch (error) {
                // Handle validation error
                setValidationErrors(prevErrors => ({ ...prevErrors, image: error }));
            }
        } else {
            // Handle case when no file is selected
            setValidationErrors(prevErrors => ({ ...prevErrors, image: 'No file selected.' }));
        }
    };
    


    // const handleFileChange = (e) => {
    //     const valid = validateImage(e.target.files[0]);
    //     if (valid) {
    //         try{
    //         setImage(e.target.files[0]);
    //         setValidationErrors(prevErrors => ({ ...prevErrors, image: '' }));
    //     }  catch (error) {
    //         setValidationErrors(prevErrors => ({ ...prevErrors, image: error }));
    //     }}

    // };

    const validateImage = (file) => {
    const allowedTypes = ["image/png", "image/webp", "image/jpeg"];
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            const arr = new Uint8Array(reader.result).subarray(0, 4);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16).padStart(2, '0'); // Ensure each byte is 2 hex digits
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


    

    const validateForm = () => {
        const errors = {};
        if (!formData.metaTitle) errors.metaTitle = 'Meta Title is required';
        if (!formData.metaKeyword) errors.metaKeyword = 'Meta Keyword is required';
        if (!formData.metaDescription) errors.metaDescription = 'Meta Description is required';
        if (!formData.location_type) errors.location_type = 'Location Type is required';
        if (!formData.location) errors.location = 'Location is required';
        if (!formData.state) errors.state = 'State is required';
        if (!image) errors.image = 'Image is required';
        return errors;
    };

    

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        const { metaTitle, metaKeyword, metaDescription, location_type, location, state, priority, ctcontent, schema, content_above_faqs } = formData;
    
        // Prepare form data
        const dataArray = [{
            location_type: location_type,
            metaTitle: metaTitle || ' ',
            metaKeyword: metaKeyword || ' ',
            metaDescription: metaDescription || ' ',
            ctcontent: ctcontent || ' ',
            schema: schema || ' ',
            content_above_faqs: content_above_faqs || ' ',
            image: image ? image.name : ''  // Add image name or path if needed
        }];
    
        const formDataToSend = new FormData();
        formDataToSend.append('location', location);
        formDataToSend.append('state', state);
        formDataToSend.append('priority', priority || ' ');
        formDataToSend.append('data', JSON.stringify(dataArray));
        if (image) {
            formDataToSend.append('image', image);
        }

        setLoading(true);
    
        try {
            let result;
            if (id === 'add') {
                result = await addCity(formDataToSend);
            } else {
                result = await updateCity(ids, id, formDataToSend);
            }
    
            if (result.success) {
                alert('City saved successfully');
                navigate('/location');
            } else {
                alert(`Failed to save City: ${result.message}`);
            }
        } catch (error) {
            alert('Faild to add Data at the moment, Please try after some time.')
            console.error('Error submitting form:', error);
        }
        setLoading(false)
    };
    

    return (
        <>
            <div>
                <Sidebar />
                <div>
                    <div className="midde_cont">
                        <div className="container-fluid">
                            <div className="row column_title">
                                <div className="col-md-12">
                                    <div className="page_title">
                                        <h2>{id === 'add' ? 'Add Location' : 'Edit Location'}</h2>
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
                                            <form onSubmit={handleFormSubmit} id="citiesform" encType="multipart/form-data">
                                                <span className="status text-danger mb-0"></span>
                                                <div className="form-row mb-3">
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
                                                        <label className="label_field">Location Type</label>
                                                        <select name="location_type" id="location_type" value={formData.location_type} onChange={handleInputChange} className={`form-control ${validationErrors.location_type ? 'is-invalid' : ''}`}>
                                                            <option value=""></option>
                                                            <option value="Common">Common</option>
                                                            <option value="Apartment">Apartment</option>
                                                            <option value="New Projects">New Projects</option>
                                                            <option value="Flat">Flat</option>
                                                            <option value="Commercial">Commercial</option>
                                                            <option value="studio">Studio</option>
                                                        </select>
                                                        {validationErrors.location_type && (
                                                            <div className='invalid-feedback'>{validationErrors.location_type}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <label className="label_field">Location</label>
                                                        <input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className={`form-control ${validationErrors.location ? 'is-invalid' : ''}`} />
                                                        {validationErrors.location && (
                                                            <div className="invalid-feedback">{validationErrors.location}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                            <label className="label_field">State</label>
                                                            <select 
                                                                name="state" 
                                                                id="state" 
                                                                value={formData.state} 
                                                                onChange={handleInputChange} 
                                                                className={`form-control ${validationErrors.state ? 'is-invalid' : ''}`}
                                                            >
                                                                <option value="">Select a State</option>
                                                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                                                <option value="Assam">Assam</option>
                                                                <option value="Bihar">Bihar</option>
                                                                <option value="Chhattisgarh">Chhattisgarh</option>
                                                                <option value="Goa">Goa</option>
                                                                <option value="Gujarat">Gujarat</option>
                                                                <option value="Haryana">Haryana</option>
                                                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                                                <option value="Jharkhand">Jharkhand</option>
                                                                <option value="Karnataka">Karnataka</option>
                                                                <option value="Kerala">Kerala</option>
                                                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                                                <option value="Maharashtra">Maharashtra</option>
                                                                <option value="Manipur">Manipur</option>
                                                                <option value="Meghalaya">Meghalaya</option>
                                                                <option value="Mizoram">Mizoram</option>
                                                                <option value="Nagaland">Nagaland</option>
                                                                <option value="Odisha">Odisha</option>
                                                                <option value="Punjab">Punjab</option>
                                                                <option value="Rajasthan">Rajasthan</option>
                                                                <option value="Sikkim">Sikkim</option>
                                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                                                <option value="Telangana">Telangana</option>
                                                                <option value="Tripura">Tripura</option>
                                                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                                <option value="Uttarakhand">Uttarakhand</option>
                                                                <option value="West Bengal">West Bengal</option>
                                                                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                                                <option value="Chandigarh">Chandigarh</option>
                                                                <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                                                                <option value="Lakshadweep">Lakshadweep</option>
                                                                <option value="Delhi">Delhi</option>
                                                                <option value="Puducherry">Puducherry</option>
                                                            </select>
                                                            {validationErrors.state && (
                                                                <div className="invalid-feedback">{validationErrors.state}</div>
                                                            )}
                                                        </div>

                                                    <div className="col-md-6 form-group">
                                                        <label className="label_field">Priority</label>
                                                        <input type="text" name="priority" id="priority" value={formData.priority} onChange={handleInputChange} className="form-control" />
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <label className="label_field">City Image</label>
                                                        <input type="file" name="image" id="image" onChange={handleFileChange}  className={`form-control ${validationErrors.image ? 'is-invalid' : ''}`} />
                                                        {validationErrors.image && (
                                                            <div className="invalid-feedback">{validationErrors.image}</div>
                                                        )}
                                                        {previewUrl && (
                                                        <img
                                                            src={previewUrl}
                                                            alt="City Image Preview"
                                                            className="img-thumbnail"
                                                            width="120"
                                                            height="70"
                                                        />
                                                    )}
                                                    </div>
                                                    <div className="col-md-12 form-group">
                                                        <label className="label_field">Content</label>
                                                        <textarea name="ctcontent" id="ctcontent" value={formData.ctcontent} onChange={handleInputChange}  className='form-control' rows="5"></textarea>
                                                        
                                                    </div>
                                                    <div className="col-md-12 form-group">
                                                        <label className="label_field">Schema</label>
                                                        <textarea name="schema" id="schema" value={formData.schema} onChange={handleInputChange} className="form-control" rows="5"></textarea>
                                                    </div>
                                                    <div className="col-md-12 form-group">
                                                        <label className="label_field">Content Above FAQs</label>
                                                        <textarea name="content_above_faqs" id="content_above_faqs" value={formData.content_above_faqs} onChange={handleInputChange} className="form-control" rows="5"></textarea>
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
                                                <span id="result" className="text-danger mt-4 d-block"></span>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
