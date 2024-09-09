import React, { useState, useEffect } from 'react';
import Sidebar from '../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {fetchCityDetails, addSubCity, updateSubCity } from '../../../../../api/location/sub_city/sub_city_api';
import { fetchCities } from '../../../../../api/location/location_api';

export default function AddSubCity() {
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        content_type: '',
        city: '',
        sub_city: '',
        priority: '',
        ctcontent: '',
        schema: '',
    });

    const [image, setImage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const navigate = useNavigate();
    const { id, ids } = useParams();

    useEffect(() => {
        const loadData = async () => {
            try {
             
                const data = await fetchCities();
                setCities(data);
                if (ids !== 'add') {
                    const [cityData] = await fetchCityDetails(id, ids);
                    if (cityData) {
                        const specificDataItem = cityData.data.find(item => item.content_type === ids);
                        if (specificDataItem) {
                            setFormData({
                                metaTitle: specificDataItem.metaTitle || '',
                                metaKeyword: specificDataItem.metaKeyword || '',
                                metaDescription: specificDataItem.metaDescription || '',
                                content_type: specificDataItem.content_type || '',
                                city: cityData.city,
                                sub_city: cityData.sub_city,
                                priority: cityData.priority || '',
                                ctcontent: specificDataItem.ctcontent || '',
                                schema: specificDataItem.schema || '',
                            });
                        }
                        setImage({
                            image: specificDataItem.image ? specificDataItem.image : null
                        })
                        if (specificDataItem.image) {
                            setPreviewUrl(`${specificDataItem.image}`);
                            
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        loadData();
    }, [id, ids]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
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
        if (!formData.content_type) errors.content_type = 'Location Type is required';
        if (!formData.city) errors.city = 'Location is required';
        if (!formData.sub_city) errors.sub_city = 'Sub City is required';
        // if (!formData.ctcontent) errors.ctcontent = 'Content is required';
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
        const { city, sub_city, metaTitle, metaKeyword, metaDescription,  priority, ctcontent, schema, content_type} = formData;
        const dataArray = [{
            metaTitle: metaTitle || ' ',
            metaKeyword: metaKeyword || ' ',
            metaDescription: metaDescription || ' ',
            ctcontent: ctcontent || ' ',
            schema: schema || ' ',
            content_type: content_type || ' '
        }];

        const formDataToSend = new FormData();
        formDataToSend.append('city', city);
        formDataToSend.append('sub_city', sub_city);
        formDataToSend.append('priority', priority || ' ');
        formDataToSend.append('data', JSON.stringify(dataArray));
        if (image) {
            formDataToSend.append('image', image);
        }

        // const dataToSubmit = {
        //     city,
        //     sub_city,
        //     priority: priority || '',
        //     data: [rest]
        // };
        setLoading(true);
        try {
            const result = ids === 'add'
                ? await addSubCity(formDataToSend)
                : await updateSubCity(id, ids, formDataToSend);

            if (result.success) {
                alert('City saved successfully');
                navigate(-1);
            } else {
                alert(`Failed to save City: ${result.message}`);
            }
        } catch (error) {
            alert(`Failed to save City`);
            console.error('Error submitting form:', error);
        }
        setLoading(false);
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
                                        <h2>{ids === 'add' ? 'Add Sub Cities' : 'Edit Sub Cities'}</h2>
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
                                                    <div className="col-md-4 form-group">
                                                        <label className="label_field">Content Type</label>
                                                        <select name="content_type" id="content_type" value={formData.content_type} onChange={handleInputChange} className={`form-control ${validationErrors.content_type ? 'is-invalid' : ''}`}>
                                                            <option value=""></option>
                                                            <option value="common">Common</option>
                                                            <option value="apartments">Apartment</option>
                                                            <option value="new-projects">New Projects</option>
                                                            <option value="flats">Flat</option>
                                                            <option value="residential">Residential</option>
                                                            <option value="commercial">Commercial</option>
                                                            <option value="studio">Studio</option>
                                                        </select>
                                                        {validationErrors.content_type && (
                                                            <div className='invalid-feedback'>{validationErrors.content_type}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-md-4 form-group">
                                                        <label className="label_field">City</label>
                                                        <select name="city" id="city" value={formData.city} onChange={handleInputChange} className={`form-control ${validationErrors.city ? 'is-invalid' : ''}`}>
                                                            <option value="">Select city</option>
                                                            {cities.map(city => (
                                                                <option key={city._id} value={city.slugURL}>{city.location}</option>
                                                            ))}
                                                        </select>
                                                        {validationErrors.city && (
                                                            <div className='invalid-feedback'>{validationErrors.city}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-md-4 form-group">
                                                        <label className="label_field">Sub City</label>
                                                        <input type="text" name="sub_city" id="sub_city" value={formData.sub_city} onChange={handleInputChange} className={`form-control ${validationErrors.sub_city ? 'is-invalid' : ''}`} />
                                                    </div>
                                                    {validationErrors.sub_city && (
                                                            <div className='invalid-feedback'>{validationErrors.sub_city}</div>
                                                        )}
                                                    <div className="col-md-6 form-group">
                                                        <label className="label_field">Priority</label>
                                                        <input type="text" name="priority" id="priority" value={formData.priority} onChange={handleInputChange} className="form-control" />
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <label className="label_field">City Image</label>
                                                        <input type="file" name="image" id="image" className={`form-control ${validationErrors.image ? 'is-invalid' : ''}`} onChange={handleFileChange}/>
                                                        {validationErrors.image && (
                                                            <div className='invalid-feedback'>{validationErrors.image}</div>
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
                                                        <textarea name="ctcontent" id="ctcontent" value={formData.ctcontent} onChange={handleInputChange} className={`form-control ${validationErrors.ctcontent ? 'is-invalid' : ''}`} rows="5"></textarea>
                                                        {validationErrors.ctcontent && (
                                                            <div className='invalid-feedback'>{validationErrors.ctcontent}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-md-12 form-group">
                                                        <label className="label_field">Schema Data</label>
                                                        <textarea name="schema" id="schema" value={formData.schema} onChange={handleInputChange} className="form-control" rows="5"></textarea>
                                                    </div>
                                                </div>
                                                <div className="form-group margin_0">
                                                {ids === 'add' ? ( 
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
