import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../sidebar';
import { addStarRera, getStarReraByID, updateStarRera } from '../../../../api/starRera/starRera_api';


const AddStarRERA = () => {
    const { id} = useParams();
    const [headings, setHeadings] = useState([{ image: '', title: '',  reraNO: '', reraWebsite: ''}]);
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
  
    const navigate = useNavigate();

    useEffect(() => {
        if(id !== 'add'){
            fetchData(id);
        }
    },[id])

    const fetchData = async (id) => {
        try{
            const data = await getStarReraByID(id);
            setHeadings([{ ...data}]);
        }catch(error){
            console.log('Error fetching data', error);
            setHeadings([{image: '', title: '', reraNO: '', reraWebsite: ''}]);
        }
    }

    // Function to handle adding more fields
    const addMoreFields = () => {
        setHeadings([...headings, { image: '', title: '',  reraNO: '', reraWebsite: ''}]);
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
        validateImage(value[0])
            .then((file) => {
                updatedHeadings[index] = { ...updatedHeadings[index], [field]: file };
                setHeadings(updatedHeadings);
                setValidationErrors((prevErrors) => ({ ...prevErrors, [`image${index}`]: '' }));
            })
            .catch((error) => {
                setValidationErrors((prevErrors) => ({ ...prevErrors, [`image${index}`]: error }));
            });
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
        if (!heading.reraNO.trim()) {
            errors[`reraNO${index}`] = 'Rera Heading is required';
        }
        if (!heading.reraWebsite.trim()) {
            errors[`reraWebsite${index}`] = 'Rera Website is required';
        }
        if (!heading.image) {
            errors[`image${index}`] = 'Image is required';
        }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
};


const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
        return; // Stop submission if validation fails
    }

    setLoading(true)

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
                response = await updateStarRera(formData);
            } else {
                response = await addStarRera(formData);
            }
    
            if (response && response.success) {
                setTimeout(() => navigate(-1), 500);
            } else {
                
            }
        } catch (error) {
            console.error('Error:', error);
         
            
        }
        setLoading(false);
    };

    return (
        <div>
            <Sidebar />
            <div >
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>{id === 'add'? 'Add' : 'Edit'} Rera Details</h2>
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
                                                {headings.map((heading, index) => (
                                                    <div className="clone_fields" key={index}>
                                                        
                                                        <div className="form-row">
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">RERA No</label>
                                                                <input
                                                                    type="text"
                                                                    name="reraNO"
                                                                    
                                                                    value={heading.reraNO}
                                                                    onChange={(e) => handleHeadingChange(index, 'reraNO', e.target.value)}
                                                                    className={`form-control ${validationErrors[`reraNO${index}`] ? 'is-invalid' : ''}`}
                                                                    />
                                                                     {validationErrors[`reraNO${index}`] && (
                                                                        <div className="text-danger">{validationErrors[`reraNO${index}`]}</div>
                                                                    )}
                                                            </div>
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">RERA Website</label>
                                                                <input
                                                                    type="text"
                                                                    name="reraWebsite"
                                                                   
                                                                    value={heading.reraWebsite}
                                                                    onChange={(e) => handleHeadingChange(index, 'reraWebsite', e.target.value)}
                                                                    className={`form-control ${validationErrors[`reraWebsite${index}`] ? 'is-invalid' : ''}`}
                                                                    />
                                                                     {validationErrors[`reraWebsite${index}`] && (
                                                                        <div className="text-danger">{validationErrors[`reraWebsite${index}`]}</div>
                                                                    )}
                                                            </div>
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Title</label>
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
                                            {id === 'add' ? (<><span onClick={addMoreFields} className="btn btn-primary mb-3 mt-3">Add More</span>
                                            <div className="form-group margin_0">
                                           
                                                    <button className="main_bt" type="submit" disabled={loading}>
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        'Submit'
                                                    )}
                                                </button>
                                              
                                            </div></>): (<>
                                            <div className="form-group margin_0">
                                            <button className="main_bt" type="submit" disabled={loading}>
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        'Update'
                                                    )}
                                                </button>
                                            </div></>)}
                                            
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

export default AddStarRERA;
