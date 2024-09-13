import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchDetailById, addProjectSpecifications, updateProjectSpecifications } from '../../../../../../api/dashboard/project_list/view_project/project_specification_api';
import Swal from 'sweetalert2';

const AddProjectSpecification = () => {
    const { ids, id } = useParams();
    const [headings, setHeadings] = useState([{ title: '', value: '', projectname: id }]); // Initialize with one entry
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
  
    const navigate = useNavigate();

    useEffect(() => {
        if (ids !== 'add') {
            fetchDetail(ids);
        }
    }, [ids, id]); // id and ids are dependencies

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchDetail = async (detailId) => {
        try {
            const data = await fetchDetailById(detailId);
            if (data.length === 0) {
                setHeadings([{ title: '', value: '', projectname: id }]);
            } else {
                setHeadings(data);
            }
        } catch (error) {
            console.error('Error fetching detail:', error);
            setHeadings([{ title: '', value: '', projectname: id }]);
        }
    };

    const addMoreFields = () => {
        setHeadings([...headings, { title: '', value: '', projectname: id }]);
    };

    const removeField = (index) => {
        if (headings.length > 1) { // Prevent removing all fields
            const updatedHeadings = [...headings];
            updatedHeadings.splice(index, 1);
            setHeadings(updatedHeadings);
        }
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedHeadings = [...headings];
        updatedHeadings[index] = {
            ...updatedHeadings[index],
            [name]: value
        };
        setHeadings(updatedHeadings);
    };

    const validateForm = () => {
        const errors = {};
        headings.forEach((heading, index) => {
            if (!heading.title.trim()) {
                errors[`title${index}`] = 'Title is required';
            }
            if (!heading.value.trim()) {
                errors[`value${index}`] = 'Value is required';
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
            let response;

            if (ids !== 'add') {
                // Update existing specifications
                response = await updateProjectSpecifications(id, headings);
            } else {
                // Add new specifications
                response = await addProjectSpecifications(headings);
            }

            if (response && response.success) {
                Swal.fire({
                    icon: 'success',
                    title:  'Success!',
                    text:  'Data added successfully.',
                    confirmButtonText: 'OK'
                });
                navigate(-1);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Failed to add/update data. ${response.message}`,
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
                                    <h2>{ids === 'add' ? 'Add Project Specification' : "Edit Project Specification"}</h2>
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
                                        <form onSubmit={handleSubmit} id="specificationForm">
                                            <div className="more_fields_container">
                                                {headings.map((heading, index) => (
                                                    <div className="clone_fields" key={index}>
                                                        
                                                        <div className="form-row">
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Title</label>
                                                                <input
                                                                    type="text"
                                                                    name="title"
                                                                    value={heading.title}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className={`form-control ${validationErrors[`title${index}`] ? 'is-invalid' : ''}`}
                                                                    />
                                                                     {validationErrors[`title${index}`] && (
                                                                        <div className="text-danger">{validationErrors[`title${index}`]}</div>
                                                                    )}
                                                            </div>
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Value</label>
                                                                <input
                                                                    type="text"
                                                                    name="value"
                                                                    value={heading.value}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className={`form-control ${validationErrors[`value${index}`] ? 'is-invalid' : ''}`}
                                                                    />
                                                                     {validationErrors[`value${index}`] && (
                                                                        <div className="text-danger">{validationErrors[`value${index}`]}</div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 form-group remove">
                                                            {headings.length > 1 && (
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
                                            {ids === 'add' ? (<><span onClick={addMoreFields} className="btn btn-primary mb-3 mt-3">Add More</span>
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

export default AddProjectSpecification;
