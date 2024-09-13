import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from '../../sidebar';
import { fetchDeveloperById, addDeveloper, updateDeveloper } from '../../../../api/developer/developer_api';
import { imageURL } from '../../../../imageURL';
import Swal from 'sweetalert2';

export default function AddDeveloper() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        developerName: '',
        // no_of_projects: '',
        // establishYear: '',
        // ongoingProjects: '',
        // experience: '',
        developerPriority: '',
        description: '',
        // developerLogo: null
    });
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (id !== 'add') {
            const loadDeveloper = async () => {
                try {
                    const data = await fetchDeveloperById(id);
                    
                    
                    setFormData({
                        ...data,
                        // developerLogo: data.developerLogo ? data.developerLogo : null
                    });
                    if (data.developerLogo) {
                        setPreviewUrl(`${imageURL}/${data.developerLogo}`);
                    }
                } catch (error) {
                    console.error('Error fetching developer:', error.message);
                } finally {
                    setLoading(false);
                }
            };
            loadDeveloper();
        } else {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

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
                    developerLogo: file
                }));
                
                // Clear any previous validation errors
                setValidationErrors(prevErrors => ({ ...prevErrors, developerLogo: '' }));
                setPreviewUrl(URL.createObjectURL(file));
            } catch (error) {
                // Handle validation error
                setValidationErrors(prevErrors => ({ ...prevErrors, developerLogo: error }));
            }
        } else {
            // Handle case when no file is selected
            setValidationErrors(prevErrors => ({ ...prevErrors, developerLogo: 'No file selected.' }));
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


    const validateForm = () => {
        const errors = {};
        if (!formData.metaTitle) errors.metaTitle = 'Meta Title is required';
        if (!formData.metaKeyword) errors.metaKeyword = 'Meta Keyword is required';
        if (!formData.metaDescription) errors.metaDescription = 'Meta Description is required';
        if (!formData.developerName) errors.developerName = 'Developer Name is required';
        if (!formData.description) errors.description = 'Description is required';
        // if (!formData.developerLogo) errors.developerLogo = 'Image is required';
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
                response = await updateDeveloper(id, formData);
                Swal.fire({
                    icon: 'success',
                    title:  'Success!',
                    text:  'Data updated successfully.',
                    confirmButtonText: 'OK'
                });;
            } else {
                response = await addDeveloper(formData);
                Swal.fire({
                    icon: 'success',
                    title:  'Success!',
                    text:  'Data added successfully.',
                    confirmButtonText: 'OK'
                });
            }
            navigate(-1); // Navigate back to the developer list
        } catch (error) {
            console.error('Error:', error.message);
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

    // Helper function to create a URL for the image preview
    // const getLogoPreviewUrl = () => {
    //     return formData.developerLogo ? URL.createObjectURL(formData.developerLogo) : '';
    // };


    return (
        <div >
            <Sidebar />
            <div>
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>{id !== 'add' ? 'Edit Developer' : 'Add Developer'}</h2>
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
                                        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                                                    <label className="label_field">Developer Name</label>
                                                    <input
                                                        type="text"
                                                        name="developerName"
                                                        value={formData.developerName}
                                                        onChange={handleInputChange}
                                                        className={`form-control ${validationErrors.developerName ? 'is-invalid' : ''}`}
                                                      
                                                        
                                                    />
                                                    {validationErrors.developerName && (
                                                            <div className="invalid-feedback">{validationErrors.developerName}</div>
                                                        )}
                                                </div>
                                                {/* <div className="col-md-4 form-group">
                                                    <label className="label_field">No. Of Projects</label>
                                                    <input
                                                        type="number"
                                                        name="no_of_projects"
                                                        value={formData.no_of_projects}
                                                        onChange={handleInputChange}
                                                        className='form-control'
                                                        
                                                        
                                                    />
                                                   
                                                </div> */}
                                                {/* <div className="col-md-4 form-group">
                                                    <label className="label_field">Establish Year</label>
                                                    <input
                                                        type="number"
                                                        name="establishYear"
                                                        value={formData.establishYear}
                                                        onChange={handleInputChange}
                                                       className='form-control'
                                                        
                                                        
                                                    />
                                                   
                                                </div> */}
                                                {/* <div className="col-md-4 form-group">
                                                    <label className="label_field">Ongoing Projects</label>
                                                    <input
                                                        type="number"
                                                        name="ongoingProjects"
                                                        value={formData.ongoingProjects}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        
                                                    />
                                                </div> */}
                                                {/* <div className="col-md-4 form-group">
                                                    <label className="label_field">Experience</label>
                                                    <input
                                                        type="number"
                                                        name="experience"
                                                        value={formData.experience}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                       
                                                    />
                                                </div> */}
                                                <div className="col-md-4 form-group">
                                                    <label className="label_field">Developer Priority</label>
                                                    <input
                                                        type="number"
                                                        name="developerPriority"
                                                        value={formData.developerPriority}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        
                                                        
                                                    />
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="label_field">Description</label>
                                                    <textarea
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                                                        rows="7"
                                                       
                                                    ></textarea>
                                                    {validationErrors.description && (
                                                            <div className="invalid-feedback">{validationErrors.description}</div>
                                                        )}
                                                </div>
                                                {/* <div className="col-md-12 form-group">
                                                    <label className="label_field">Developer Logo</label>
                                                    <input
                                                        type="file"
                                                        name="developerLogo"
                                                        onChange={handleFileChange}
                                                        className={`form-control ${validationErrors.developerLogo ? 'is-invalid' : ''}`}
                                                    />
                                                    {validationErrors.developerLogo && (
                                                            <div className="invalid-feedback">{validationErrors.developerLogo}</div>
                                                        )}
                                                    {previewUrl && (
                                                        <img
                                                            src={previewUrl}
                                                            alt="Developer Image Preview"
                                                            className="img-thumbnail"
                                                            width="120"
                                                            height="70"
                                                        />
                                                    )}
                                                </div> */}
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
