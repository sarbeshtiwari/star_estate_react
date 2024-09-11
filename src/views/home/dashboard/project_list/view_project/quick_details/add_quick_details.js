import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDetail, addQuickDetails, updateQuickDetails } from '../../../../../../api/dashboard/project_list/view_project/quick_details_api';

const AddQuickDetails = () => {
    const { ids, id } = useParams();
    const [headings, setHeadings] = useState([
        { heading: 'Unit Type', data: '', projectname: id },
        { heading: 'Project Type', data: ' ', projectname: id },
        { heading: 'Payment Plan', data: ' ', projectname: id },
    ]);
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const projectTypeOptions = ['New Launch', 'Luxury', 'Featured', 'Recent'];

    useEffect(() => {
        if (ids !== 'add') {
            fetchDetailHandler(ids);
        }
    }, [ids, id]);

    const fetchDetailHandler = async (detailId) => {
        try {
            const data = await fetchDetail(detailId);
            if (data.length === 0) {
                setHeadings([
                    { heading: 'Unit Type', data: '', projectname: id },
                    { heading: 'Project Type', data: '', projectname: id },
                    { heading: 'Payment Plan', data: '', projectname: id },
                ]);
            } else {
                setHeadings(data);
            }
        } catch (error) {
            console.error('Error fetching detail:', error);
            setHeadings([
                { heading: 'Unit Type', data: '', projectname: id },
                { heading: 'Project Type', data: '', projectname: id },
                { heading: 'Payment Plan', data: '', projectname: id },
            ]);
        }
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Automatically add colon for Payment Plan field
        if (name === 'data' && headings[index].heading === 'Payment Plan') {
            formattedValue = formatPaymentPlan(value);
        }

        const updatedHeadings = [...headings];
        updatedHeadings[index] = { ...updatedHeadings[index], [name]: formattedValue };
        setHeadings(updatedHeadings);
    };

    // Function to format payment plan input
    const formatPaymentPlan = (input) => {
        // Remove non-numeric characters and colons
        input = input.replace(/[^0-9]/g, '');

        // Split into chunks of two digits
        const chunks = input.match(/.{1,2}/g);

        // Join chunks with colon and return
        return chunks ? chunks.join(':') : '';
    };

    // Updated payment plan validation logic
    const validatePaymentPlan = (data) => {
        const parts = data.split(':').map(Number);
        // Check if there are 2 to 4 numbers and their sum is 100
        if (parts.length < 2 || parts.length > 4) return false;

        const sum = parts.reduce((acc, part) => acc + part, 0);
        return sum === 100;
    };

    const validateForm = () => {
        const errors = {};
        headings.forEach((heading, index) => {
            if (heading.heading === 'Unit Type' && !heading.data.trim()) {
                errors[`data${index}`] = 'Unit Type is required';
            } else if (heading.heading === 'Payment Plan' && heading.data.trim() && !validatePaymentPlan(heading.data)) {
                errors[`data${index}`] = 'Please enter 2-4 numbers separated by ":" and ensure their sum equals 100';
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

        setLoading(true);

        try {
            let response;
            if (ids !== 'add') {
                response = await updateQuickDetails(id, headings);
            } else {
                response = await addQuickDetails(headings);
            }
            if (response && response.success) {
                alert('Data saved successfully');
                navigate(-1);
            } else {
                alert(`Failed to save data: ${response.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving data. Please try after some time');
        }

        setLoading(false);
    };

    return (
        <div>
            <Sidebar />
            <div className="container-fluid">
                <div className="row column_title">
                    <div className="col-md-12">
                        <div className="page_title">
                            <h2>{ids === 'add' ? 'Add Quick Detail' : 'Edit Quick Detail'}</h2>
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
                                    <div className="row mb-3">
                                        {headings.map((heading, index) => (
                                            <div className="col-md-3" key={index}>
                                                <div className="form-group">
                                                    <label className="label_field">{heading.heading}</label>
                                                    {heading.heading === 'Project Type' ? (
                                                        <select
                                                            name="data"
                                                            value={heading.data}
                                                            onChange={(e) => handleInputChange(e, index)}
                                                            className={`form-control ${validationErrors[`data${index}`] ? 'is-invalid' : ''}`}
                                                        >
                                                            <option value="">Select Project Type</option>
                                                            {projectTypeOptions.map((option, i) => (
                                                                <option key={i} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : heading.heading === 'Payment Plan' ? (
                                                        <input
                                                            type="text"
                                                            name="data"
                                                            value={heading.data}
                                                            onChange={(e) => handleInputChange(e, index)}
                                                            placeholder="e.g., 50:50 or 25:25:50"
                                                            className={`form-control ${validationErrors[`data${index}`] ? 'is-invalid' : ''}`}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="data"
                                                            value={heading.data}
                                                            onChange={(e) => handleInputChange(e, index)}
                                                            className={`form-control ${validationErrors[`data${index}`] ? 'is-invalid' : ''}`}
                                                        />
                                                    )}
                                                    {validationErrors[`data${index}`] && (
                                                        <div className="text-danger mt-1">{validationErrors[`data${index}`]}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-group">
                                        <button className="main_bt" type="submit" disabled={loading}>
                                            {loading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                'Submit'
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
    );
};

export default AddQuickDetails;
