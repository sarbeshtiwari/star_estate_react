// src/components/AddAmenities/AddAmenities.js

import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { addSubAmenities, getSubAmenitiyByID, updateSubAmenity } from '../../../../api/amenities/amenities_api';
import { imageURL } from '../../../../imageURL';
import Swal from 'sweetalert2';

const AddAmenities = () => {
    const { ids, id } = useParams(); // Assuming ids is the category
    const [headings, setHeadings] = useState([{ image: '', title: '', alt_tag: '', category: ids }]); // State to store dynamic inputs

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchloading, setfetchLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState([]);

    useEffect(() => {
        if (id !== 'add') {
            // Fetch existing data if needed
            fetchData(id);
        }
    }, [ids, id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchData = async (id) => {
        setfetchLoading(true)
        try {
            const data = await getSubAmenitiyByID(id);
            // Ensure data is an array
        // if (Array.isArray(data)) {
        
            setHeadings([{ ...data, category: ids }]);
            if (data.image) {
                setPreviewUrl([`${imageURL}/${data.image}`]);
            }
        // } else {
        //     console.error('Data fetched is not an array:', data);
        //     setHeadings(data);
        // }
        }catch (error){
            console.log('Error fetching data', error);
            setHeadings([{image: '', title: '', alt_tag: '', category: ids}]);
        }
        setfetchLoading(false)
    }

    // Function to handle adding more fields
    const addMoreFields = () => {
        setHeadings([...headings, { image: '', title: '', alt_tag: '', category: ids }]);
    };

    // Function to handle removing a field
    const removeField = (index) => {
        const updatedHeadings = [...headings];
        updatedHeadings.splice(index, 1);
        setHeadings(updatedHeadings);
    };

    // Function to handle input change for headings
    const handleHeadingChange = (index, field, value) => {
        const updatedHeadings = [...headings];
        if (field === 'image') {
            const file = value[0]; // Access the selected file
        
            // Check if a file is selected; if not, return early
            if (!file) {
                return; // Exit if no file is selected (e.g., user clicked "Cancel")
            }
        
            validateImage(file)
                .then((file) => {
                    // Update the headings with the validated file
                    updatedHeadings[index] = { ...updatedHeadings[index], [field]: file };
                    setHeadings(updatedHeadings);
                    setValidationErrors((prevErrors) => ({ ...prevErrors, [`image${index}`]: '' }));
        
                    // Generate and set the preview URL for the newly selected image
                    const newPreviewUrl = [...previewUrl];
                    newPreviewUrl[index] = URL.createObjectURL(file);
                    setPreviewUrl(newPreviewUrl);
                })
                .catch((error) => {
                    // Handle validation error
                    setValidationErrors((prevErrors) => ({ ...prevErrors, [`image${index}`]: error }));
                });
        }
         else {
            updatedHeadings[index] = { ...updatedHeadings[index], [field]: value };
            setHeadings(updatedHeadings);
        }
    };

    const validateImage = (file) => {
        const allowedTypes = ["image/png", "image/webp", "image/jpeg", "image/svg+xml"];
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
                    case "3c3f786d": 
                        fileType = "image/svg+xml";
                        break;
                    default:
                        fileType = "unknown";
                        break;
                }
    
                if (!allowedTypes.includes(fileType)) {
                    reject("Only JPG, JPEG, WEBP, PNG, and SVG formats are allowed.");
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
        headings.forEach((heading, index) => {
            if (!heading.title.trim()) {
                errors[`title${index}`] = 'Title is required';
            }
            if (!heading.alt_tag.trim()) {
                errors[`alt_tag${index}`] = 'Alt Tag is required';
            }
            if (!heading.image) {
                errors[`image${index}`] = 'Image is required';
            }
        });
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Function to handle form submission
   // React component
   const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
        return; // Stop submission if validation fails
    }
    setLoading(true);
    try {
        const formData = new FormData();

        // Append JSON data
        formData.append('data', JSON.stringify(headings));

        // Append image files
        headings.forEach((heading, index) => {
            if (heading.image) {
                formData.append(`image`, heading.image); // Append images with unique keys
            }
        });

        let response;
        if (id !== 'add') {
            response = await updateSubAmenity(id, formData);
        } else {
            response = await addSubAmenities(formData);
        }

        if (response && response.success) {
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add/update data.',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error:', error);
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
        <div >
            <Sidebar />
            <div >
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>{id === 'add' ? 'Add' : 'Update'} Amenities</h2>
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
                                        <form onSubmit={handleSubmit} id="gallerImage" encType="multipart/form-data">
                                            <div className="more_fields_container">
                                                {headings.map((heading, index) => (
                                                    <div className="clone_fields" key={index}>
                                                        
                                                        <div className="form-row">
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Title</label>
                                                                <input
                                                                    type="text"
                                                                    name="title"
                                                                    className={`form-control ${validationErrors[`title${index}`] ? 'is-invalid' : ''}`}
                                                                    value={heading.title}
                                                                    onChange={(e) => handleHeadingChange(index, 'title', e.target.value)}
                                                                    disabled={fetchloading}
                                                                />
                                                                {validationErrors[`title${index}`] && (
                                                                        <div className="text-danger">{validationErrors[`title${index}`]}</div>
                                                                    )}
                                                            </div>
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Alt</label>
                                                                <input
                                                                    type="text"
                                                                    name="alt_tag"
                                                                    className={`form-control ${validationErrors[`alt_tag${index}`] ? 'is-invalid' : ''}`}
                                                                    value={heading.alt_tag}
                                                                    onChange={(e) => handleHeadingChange(index, 'alt_tag', e.target.value)}
                                                                    disabled={fetchloading}
                                                                />
                                                                {validationErrors[`alt_tag${index}`] && (
                                                                        <div className="text-danger">{validationErrors[`alt_tag${index}`]}</div>
                                                                    )}
                                                            </div>
                                                            <div className="col-md-12 form-group">
                                                                <label className="label_field">Image</label>
                                                                <input
                                                                    type="file"
                                                                    name="image"
                                                                    className={`form-control ${validationErrors[`image${index}`] ? 'is-invalid' : ''}`}
                                                                    onChange={(e) => handleHeadingChange(index, 'image', e.target.files)}
                                                                />
                                                                 {validationErrors[`image${index}`] && (
                                                                        <div className="text-danger">{validationErrors[`image${index}`]}</div>
                                                                    )}
                                                               {previewUrl && (
                                                        <img
                                                        src={previewUrl[index]}
                                                            alt="Amenity Image Preview"
                                                            className="img-thumbnail"
                                                            width="120"
                                                            height="70"
                                                        />
                                                    )}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 form-group remove">
                                                            {index > 0 && (
                                                                <span onClick={() => removeField(index)}>
                                                                     <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    onClick={() => removeField(index)}
                                                                >
                                                                    Remove
                                                                </button>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {id === 'add' ? (<span onClick={addMoreFields} className="btn btn-primary mb-3 mt-3">Add More</span>) : ('') }
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
    );
};

export default AddAmenities;
