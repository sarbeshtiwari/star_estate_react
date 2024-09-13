import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../../sidebar';
import { addFloorPlan, getFloorPlanByID, updateFloorPlan } from '../../../../../../api/dashboard/project_list/view_project/floor_plan_api';
import Swal from 'sweetalert2';

const AddApprovedBanks = () => {
    const { ids, id } = useParams();
    const [headings, setHeadings] = useState([{ image: '', title: '', areaRangeSqft: '', areaRangeSqm: '', projectname: id }]);
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ids !== 'add') {
            fetchData(ids);
        }
    }, [ids, id]);
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchData = async (ids) => {
        try {
            const data = await getFloorPlanByID(ids);
            setHeadings([{ ...data }]);
        } catch (error) {
            console.log('Error fetching data', error);
            setHeadings([{ image: '', title: '', areaRangeSqft: '', areaRangeSqm: '', projectname: id }]);
        }
    };

    // Function to handle adding more fields
    const addMoreFields = () => {
        setHeadings([...headings, { image: '', title: '', areaRangeSqft: '', areaRangeSqm: '', projectname: id }]);
    };

    // Function to handle removing a field
    const removeField = (index) => {
        const updatedHeadings = [...headings];
        updatedHeadings.splice(index, 1);
        setHeadings(updatedHeadings);
    };

    // Function to handle input change for headings
    // const handleHeadingChange = (index, field, value) => {
    //     const updatedHeadings = [...headings];
    //     if (field === 'image') {
    //         validateImage(value[0])
    //             .then((file) => {
    //                 updatedHeadings[index] = { ...updatedHeadings[index], [field]: file };
    //                 setHeadings(updatedHeadings);
    //                 setValidationErrors((prevErrors) => ({ ...prevErrors, [`image${index}`]: '' }));
    //             })
    //             .catch((error) => {
    //                 setValidationErrors((prevErrors) => ({ ...prevErrors, [`image${index}`]: error }));
    //             });
    //     } else if (field === 'areaRangeSqft' || field === 'areaRangeSqm') {
    //         const [min, max] = value.split('-').map(val => val.trim());
    //         if (field === 'areaRangeSqft') {
    //             const minSqm = (parseFloat(min) * 0.092903).toFixed(2);
    //             const maxSqm = (parseFloat(max) * 0.092903).toFixed(2);
    //             updatedHeadings[index] = { ...updatedHeadings[index], areaRangeSqft: value, areaRangeSqm: `${minSqm} - ${maxSqm}` };
    //         } else if (field === 'areaRangeSqm') {
    //             const minSqft = (parseFloat(min) / 0.092903).toFixed(2);
    //             const maxSqft = (parseFloat(max) / 0.092903).toFixed(2);
    //             updatedHeadings[index] = { ...updatedHeadings[index], areaRangeSqm: value, areaRangeSqft: `${minSqft} - ${maxSqft}` };
    //         }
    //         setHeadings(updatedHeadings);
    //     } else {
    //         updatedHeadings[index] = { ...updatedHeadings[index], [field]: value };
    //         setHeadings(updatedHeadings);
    //     }
    // };
    const handleHeadingChange = (index, field, value) => {
        const updatedHeadings = [...headings];
        if (field === 'image') {
            const file = value[0];
    
            // Check if a file is selected; if not, return early
            if (!file) {
                return;
            }
    
            validateImage(file)
                .then((file) => {
                    updatedHeadings[index] = { ...updatedHeadings[index], [field]: file };
                    setHeadings(updatedHeadings);
                    setValidationErrors((prevErrors) => ({ ...prevErrors, [`image${index}`]: '' }));
                })
                .catch((error) => {
                    setValidationErrors((prevErrors) => ({ ...prevErrors, [`image${index}`]: error }));
                });
        } else if (field === 'areaRangeSqft' || field === 'areaRangeSqm') {
            const [min, max] = value.split('-').map(val => val.trim());
    
            const minValue = min || ''; // Use the first value as min if it's present, or an empty string
            const maxValue = max || '0'; // If no second value is provided, treat max as min
            
            if (field === 'areaRangeSqft') {
                const minSqm = isNaN(parseFloat(minValue)) ? '' : (parseFloat(minValue) * 0.092903).toFixed(2);
                const maxSqm = isNaN(parseFloat(maxValue)) ? '' : (parseFloat(maxValue) * 0.092903).toFixed(2);
                updatedHeadings[index] = { 
                    ...updatedHeadings[index], 
                    areaRangeSqft: value, 
                    areaRangeSqm: minSqm && maxSqm ? `${minSqm} - ${maxSqm}` : '' 
                };
            } else if (field === 'areaRangeSqm') {
                const minSqft = isNaN(parseFloat(minValue)) ? '' : (parseFloat(minValue) / 0.092903).toFixed(2);
                const maxSqft = isNaN(parseFloat(maxValue)) ? '' : (parseFloat(maxValue) / 0.092903).toFixed(2);
                updatedHeadings[index] = { 
                    ...updatedHeadings[index], 
                    areaRangeSqm: value, 
                    areaRangeSqft: minSqft && maxSqft ? `${minSqft} - ${maxSqft}` : '' 
                };
            }
            setHeadings(updatedHeadings);
        } else {
            updatedHeadings[index] = { ...updatedHeadings[index], [field]: value };
            setHeadings(updatedHeadings);
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
        headings.forEach((heading, index) => {
            if (!heading.title.trim()) {
                errors[`title${index}`] = 'Title is required';
            }
            if (!heading.areaRangeSqft.trim() || !heading.areaRangeSqm.trim()) {
                errors[`area${index}`] = 'Both area (range in sqft & sqm) are required';
            }
        });
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Function to handle form submission
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
            if (ids !== 'add') {
                response = await updateFloorPlan(ids, formData);
            } else {
                response = await addFloorPlan(formData);
            }

            if (response && response.success) {
                Swal.fire({
                    icon: 'success',
                    title:  'Success!',
                    text:  'Data added successfully.',
                    confirmButtonText: 'OK',
                    timer: 1000,
                    timerProgressBar: true
                });
                navigate(-1)
            } else {
                Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add/update data.',
            confirmButtonText: 'OK'
        });
                console.error('Error:', response.message);
            }
        } catch (error) {
            console.error('Error:', error);
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
                                    <h2>{ids === 'add' ? 'Add' : 'Edit'} Floor Plan</h2>
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
                                            <div className="more_fields_container">
                                                {headings.map((heading, index) => (
                                                    <div className="clone_fields" key={index}>
                                                        <div className="form-row">
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Configuration</label>
                                                                <input
                                                                    type="text"
                                                                    name="title"
                                                                    value={heading.title}
                                                                    onChange={(e) => handleHeadingChange(index, 'title', e.target.value)}
                                                                    className={`form-control ${validationErrors[`title${index}`] ? 'is-invalid' : ''}`}
                                                                />
                                                                {validationErrors[`title${index}`] && (
                                                                    <div className="text-danger">{validationErrors[`title${index}`]}</div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Area Range (Sqft)</label>
                                                                <input
                                                                    type="text"
                                                                    name="areaRangeSqft"
                                                                    value={heading.areaRangeSqft}
                                                                    onChange={(e) => handleHeadingChange(index, 'areaRangeSqft', e.target.value)}
                                                                    className={`form-control ${validationErrors[`area${index}`] ? 'is-invalid' : ''}`}
                                                                />
                                                            </div>
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Area Range (Sqm)</label>
                                                                <input
                                                                    type="text"
                                                                    name="areaRangeSqm"
                                                                    value={heading.areaRangeSqm}
                                                                    onChange={(e) => handleHeadingChange(index, 'areaRangeSqm', e.target.value)}
                                                                    className={`form-control ${validationErrors[`area${index}`] ? 'is-invalid' : ''}`}
                                                                />
                                                            </div>
                                                            <div className="col-md-12 form-group">
                                                                <label className="label_field">Image</label>
                                                                <input
                                                                    type="file"
                                                                    name="image"
                                                                    onChange={(e) => handleHeadingChange(index, 'image', e.target.files)}
                                                                    className={`form-control ${validationErrors[`image${index}`] ? 'is-invalid' : ''}`}
                                                                />
                                                                {validationErrors[`image${index}`] && (
                                                                    <div className="text-danger">{validationErrors[`image${index}`]}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {index > 0 && (
                                                            <div className="col-md-6 form-group remove">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    onClick={() => removeField(index)}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {ids === 'add' ? (
                                                <>
                                                    <button onClick={addMoreFields} className="btn btn-primary mb-3 mt-3">Add More</button>
                                                    <div className="form-group margin_0">
                                                        <button className="main_bt" type="submit" disabled={loading}>
                                                            {loading ? (
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            ) : (
                                                                'Submit'
                                                            )}
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="form-group margin_0">
                                                    <button className="main_bt" type="submit" disabled={loading}>
                                                        {loading ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : (
                                                            'Update'
                                                        )}
                                                    </button>
                                                </div>
                                            )}
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

export default AddApprovedBanks;
