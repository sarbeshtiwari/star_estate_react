import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../../sidebar';
import { addProjectGallery, getProjectGalleryByID, updateProjectGallery } from '../../../../../../api/dashboard/project_list/view_project/project_gallery_api';
import Swal from 'sweetalert2';

const AddProjectGallery = () => {
    const { ids, id } = useParams();
    const [galleryFields, setGalleryFields] = useState([{ desktopImage: '', mobileImage: '', alt: '', projectname: id }]);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (ids !== 'add') {
            fetchData(ids);
        }
        setGalleryFields([{ desktopImage: '', mobileImage: '', alt: formatAltTag(id), projectname: id }]);
    }, [ids, id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const formatAltTag = (projectName) => {
        return projectName
            .split('-') // Split by hyphen
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter and lower the rest
            .join(' '); // Join back into a string
    };

    // const fetchData = async (ids) => {
    //     try {
    //         const data = await getProjectGalleryByID(ids);
    //         setGalleryFields([{ ...data }]);
    //     } catch (error) {
    //         console.log('Error fetching data', error);
    //         setGalleryFields([{ desktopImage: '', mobileImage: '', alt: formatAltTag(id), projectname: id }]);
    //     }
    // };
    const fetchData = async (ids) => {
        try {
            const data = await getProjectGalleryByID(ids);
            setGalleryFields([{ ...data }]);
        } catch (error) {
            console.log('Error fetching data', error);
            setGalleryFields([{ desktopImage: '', mobileImage: '', alt: formatAltTag(id), projectname: id }]);
        }
    };

    const addMoreFields = () => {
        setGalleryFields([...galleryFields, { desktopImage: '', mobileImage: '', alt: formatAltTag(id), projectname: id }]);
    };

    const removeField = (index) => {
        const updatedFields = [...galleryFields];
        updatedFields.splice(index, 1);
        setGalleryFields(updatedFields);
    };

    const handleFieldChange = (index, field, value) => {
        const updatedFields = [...galleryFields];
    
        // If it's a file input and no file is selected, simply return without doing anything.
        if ((field === 'desktopImage' || field === 'mobileImage') && (!value || !value[0])) {
            return;
        }
    
        if (field === 'desktopImage' || field === 'mobileImage') {
            validateImage(value[0], field)
                .then((file) => {
                    updatedFields[index] = { ...updatedFields[index], [field]: file };
                    setGalleryFields(updatedFields);
                    setValidationErrors((prevErrors) => ({ ...prevErrors, [`${field}${index}`]: '' }));
                })
                .catch((error) => {
                    setValidationErrors((prevErrors) => ({ ...prevErrors, [`${field}${index}`]: error }));
                });
        } 
        if (field === 'alt') {
            updatedFields[index] = { ...updatedFields[index], [field]: value };
            setGalleryFields(updatedFields);
        }
        // else {
        //     updatedFields[index] = { ...updatedFields[index], [field]: value };
        //     setGalleryFields(updatedFields);
        // }
    };
    

    const validateImage = (file, field) => {
        const allowedTypes = ["image/png", "image/webp", "image/jpeg"];
        const maxSize = 2 * 1024 * 1024; // 2 MB

        return new Promise((resolve, reject) => {
            if (!allowedTypes.includes(file.type)) {
                reject("Only JPG, JPEG, WEBP, and PNG formats are allowed.");
                return;
            }

            if (file.size > maxSize) {
                reject("Image size must be less than 2 MB.");
                return;
            }

            const img = new Image();
            img.onload = function () {
                let valid = true;
                // if (field === 'desktopImage' && (img.width !== 2225 || img.height !== 1065)) {
                //     valid = false;
                // }
                 if (field === 'mobileImage' && (img.width !== 600 || img.height !== 600)) {
                    valid = false;
                }

                if (!valid) {
                    reject(`Image dimensions are not correct for ${field}.`);
                } else {
                    resolve(file);
                }
            };

            img.onerror = function () {
                reject("Error loading image.");
            };

            img.src = URL.createObjectURL(file);
        });
    };

    // const validateForm = () => {
    //     const errors = {};
    //     galleryFields.forEach((field, index) => {
    //         if (!field.desktopImage) {
    //             errors[`desktopImage${index}`] = 'Desktop image is required';
    //         }
    //         if (!field.mobileImage) {
    //             errors[`mobileImage${index}`] = 'Mobile image is required';
    //         }
    //         if (!field.alt.trim()) {
    //             errors[`alt${index}`] = 'Alt text is required';
    //         }
    //     });
    //     setValidationErrors(errors);
    //     return Object.keys(errors).length === 0;
    // };

    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     if (!validateForm()) {
    //         return; // Stop submission if validation fails
    //     }

    //     setLoading(true);
    //     try {
    //         const formData = new FormData();

    //         formData.append('data', JSON.stringify(galleryFields));

    //         galleryFields.forEach((field, index) => {
    //             if (field.desktopImage) {
    //                 formData.append(`desktopImage`, field.desktopImage);
    //             }
    //             if (field.mobileImage) {
    //                 formData.append(`mobileImage`, field.mobileImage);
    //             }
    //         });

    //         let response;
    //         if (ids !== 'add') {
    //             response = await updateProjectGallery(ids, formData);
    //         } else {
    //             response = await addProjectGallery(formData);
    //         }

    //         if (response && response.success) {
    //             Swal.fire({
    //                 icon: 'success',
    //                 title:  'Success!',
    //                 text:  'Data added successfully.',
    //                 confirmButtonText: 'OK',
    //                 timer: 1000,
    //                 timerProgressBar: true
    //             });
    //             navigate(-1)
    //         } else {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: 'Failed to add/update data.',
    //                 confirmButtonText: 'OK'
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    //     setLoading(false);
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Show loading indicator before starting the upload
        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait while the images are being uploaded.',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
    
        const chunkSubmission = async (fieldData) => {
            const formData = new FormData();
            formData.append('data', JSON.stringify([fieldData]));
    
            if (fieldData.desktopImage) {
                formData.append('desktopImage', fieldData.desktopImage);
            }
            if (fieldData.mobileImage) {
                formData.append('mobileImage', fieldData.mobileImage);
            }
    
            try {
                let response;
                if (ids !== 'add') {
                    response = await updateProjectGallery(ids, formData);
                } else {
                    response = await addProjectGallery(formData);
                }
    
                if (response && response.success) {
                    return true; // Indicate success
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to add/update data.',
                    confirmButtonText: 'OK'
                });
                throw error; // Propagate the error
            }
        };
    
        setLoading(true);
    
        try {
            for (let i = 0; i < galleryFields.length; i++) {
                const field = galleryFields[i];
    
                // Validate each field before submission
                if (!validateField(field, i)) {
                    Swal.close(); // Close the loading indicator
                    setLoading(false);
                    return; // Stop submission if validation fails
                }
    
                await chunkSubmission(field); // Submit each field chunk
            }
    
            // Close the loading indicator after all uploads are complete
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'All data uploaded successfully.',
                confirmButtonText: 'OK',
                timer: 1000,
                timerProgressBar: true
            });
    
        } catch (error) {
            // Error handled in chunkSubmission, just ensuring to stop loading
            setLoading(false);
        } finally {
            setLoading(false);
            navigate(-1); // Navigate back after all submissions
        }
    };
    
    const validateField = (field, index) => {
        const errors = {};
    
        if (!field.desktopImage) {
            errors[`desktopImage${index}`] = 'Desktop image is required';
        }
        if (!field.mobileImage) {
            errors[`mobileImage${index}`] = 'Mobile image is required';
        }
        if (!field.alt.trim()) {
            errors[`alt${index}`] = 'Alt text is required';
        }
    
        setValidationErrors((prevErrors) => ({ ...prevErrors, ...errors }));
        return Object.keys(errors).length === 0;
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
                                    <h2>{ids === 'add' ? 'Add' : 'Edit'} Project Gallery</h2>
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
                                        <span className="status text-danger"></span>
                                        <form onSubmit={handleSubmit} id="gallerImage" encType="multipart/form-data">
                                            <div className="more_fields_container">
                                                {galleryFields.map((field, index) => (
                                                    <div className="clone_fields" key={index}>
                                                        <div className="form-row">
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Desktop Image</label>
                                                                <input
                                                                    type="file"
                                                                    name="desktopImage"
                                                                    onChange={(e) => handleFieldChange(index, 'desktopImage', e.target.files)}
                                                                    className={`form-control ${validationErrors[`desktopImage${index}`] ? 'is-invalid' : ''}`}
                                                                />
                                                                {validationErrors[`desktopImage${index}`] && (
                                                                    <div className="text-danger">{validationErrors[`desktopImage${index}`]}</div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Mobile Image (600 x 600)</label>
                                                                <input
                                                                    type="file"
                                                                    name="mobileImage"
                                                                    onChange={(e) => handleFieldChange(index, 'mobileImage', e.target.files)}
                                                                    className={`form-control ${validationErrors[`mobileImage${index}`] ? 'is-invalid' : ''}`}
                                                                />
                                                                {validationErrors[`mobileImage${index}`] && (
                                                                    <div className="text-danger">{validationErrors[`mobileImage${index}`]}</div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-12 form-group">
                                                                <label className="label_field">Alt Text</label>
                                                                <input
                                                                    type="text"
                                                                    name="alt"
                                                                    value={field.alt}
                                                                    onChange={(e) => handleFieldChange(index, 'alt', e.target.value)}
                                                                    className={`form-control ${validationErrors[`alt${index}`] ? 'is-invalid' : ''}`}
                                                                />
                                                                {validationErrors[`alt${index}`] && (
                                                                    <div className="text-danger">{validationErrors[`alt${index}`]}</div>
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
                                            {ids === 'add' ? <span onClick={addMoreFields} className="btn btn-primary mb-3 mt-3">Add More</span> : ''}
                                            <div className="form-group margin_0">
                                                <button className="main_bt" type="submit" disabled={loading}>
                                                {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        ids === 'add' ? 'Submit' : 'Update'
                                                    )}
                                                </button>
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

export default AddProjectGallery;
