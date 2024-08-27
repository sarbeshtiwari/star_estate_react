import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchFAQById, updateFAQ, addFAQs } from '../../../../../../api/dashboard/project_list/view_project/project_faq_api';

const AddProjectFAQ = () => {
    const { ids, id } = useParams();
    const [faqType, setFaqType] = useState(''); 
    const [headings, setHeadings] = useState([{ faqType: '', faqQuestion: '', faqAnswer: '', projectname: id }]); 
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ids !== 'add') {
            fetchFAQ(ids);
        }
    }, [ids, id]);

    const fetchFAQ = async (faqId) => {
        try {
            const data = await fetchFAQById(faqId);
            if (data.length === 0) {
                setHeadings([{ faqType: '', faqQuestion: '', faqAnswer: '', projectname: id }]);
            } else {
                setFaqType(data[0].faqType || '');
                setHeadings(data);
            }
        } catch (error) {
            setHeadings([{ faqType: '', faqQuestion: '', faqAnswer: '', projectname: id }]);
        }
    };

    const addMoreFields = () => {
        setHeadings([...headings, { faqType, faqQuestion: '', faqAnswer: '', projectname: id }]);
    };

    const removeField = (index) => {
        if (headings.length > 1) {
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

    const handleFaqTypeChange = (e) => {
        const { value } = e.target;
        setFaqType(value);
        const updatedHeadings = headings.map(heading => ({
            ...heading,
            faqType: value
        }));
        setHeadings(updatedHeadings);
    };

    const validateForm = () => {
        const errors = {};
        headings.forEach((heading, index) => {
            if (!heading.faqType.trim()) {
                errors[`faqType`] = 'Faq Type is required';
            }
            if (!heading.faqQuestion.trim()) {
                errors[`faqQuestion${index}`] = 'Question is required';
            }
            if (!heading.faqAnswer.trim()) {
                errors[`faqAnswer${index}`] = 'Answer is required';
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
            let result;
    
            if (ids !== 'add') {
                result = await updateFAQ(id, headings);
            } else {
                result = await addFAQs(headings);
            }
    
            if (result.success) {
                alert('Data saved successfully');
                navigate(-1);
            } else {
                alert(`Failed to save data: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while saving data. Please check the console for more details.');
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
                                    <h2>{ids === 'add' ? 'Add FAQs' : 'Edit FAQs'}</h2>
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
                                            <div className="form-row">
                                                <div className="col-md-12 form-group">
                                                    <label className="label_field">FAQs Type</label>
                                                    <select
                                                        name="faqType"
                                                        value={faqType}
                                                        onChange={handleFaqTypeChange}
                                                        className={`form-control ${validationErrors[`faqType`] ? 'is-invalid' : ''}`}
                                                    >
                                                        <option value="">Select Type</option>
                                                        <option value="projects">Projects</option>
                                                        <option value="location">Location</option>
                                                        <option value="developer">Developer</option>
                                                        <option value="sub_city">Sub City</option>
                                                    </select>
                                                    {validationErrors[`faqType`] && (
                                                                    <div className="text-danger">{validationErrors[`faqType`]}</div>
                                                                )}
                                                </div>
                                            </div>
                                            <div className="more_fields_container">
                                                {headings.map((heading, index) => (
                                                    <div className="clone_fields" key={index}>
                                                        
                                                        <div className="form-row">
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Question</label>
                                                                <input
                                                                    type="text"
                                                                    name="faqQuestion"
                                                                    value={heading.faqQuestion}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className={`form-control ${validationErrors[`faqQuestion${index}`] ? 'is-invalid' : ''}`}
                                                                    />
                                                                     {validationErrors[`faqQuestion${index}`] && (
                                                                        <div className="text-danger">{validationErrors[`faqQuestion${index}`]}</div>
                                                                    )}
                                                            </div>
                                                            <div className="col-md-6 form-group">
                                                                <label className="label_field">Answer</label>
                                                                <input
                                                                    type="text"
                                                                    name="faqAnswer"
                                                                    value={heading.faqAnswer}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    className={`form-control ${validationErrors[`faqAnswer${index}`] ? 'is-invalid' : ''}`}
                                                                />
                                                                 {validationErrors[`faqAnswer${index}`] && (
                                                                    <div className="text-danger">{validationErrors[`faqAnswer${index}`]}</div>
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

export default AddProjectFAQ;
