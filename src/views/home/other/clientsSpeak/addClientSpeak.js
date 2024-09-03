import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { addClientWords, fetchClientWordsById, updateClientWords } from '../../../../api/clientSpeak/clientSpeak_api';

export default function AddClientSpeak() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        clientName: '',
        clientSubHeading: '',
        clientWords: '',
    });
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (id !== 'add') {
            fetchEvent(id);
        }
    }, [id]);

    const fetchEvent = async (id) => {
        try {
            const response = await fetchClientWordsById(id);
            setFormData(response.data);
            
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.clientName) errors.clientName = 'Event Name is required';
        if (!formData.clientSubHeading) errors.clientSubHeading = 'Date is required';
        if (!formData.clientWords) errors.clientWords = 'Location is requierd';
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
        console.log(formData)
        try {
            let response;
            if (id !== 'add') {
                response = await updateClientWords(id, formData);
            } else {
                response = await addClientWords(formData);
            }
            console.log('Success:', response.data);
            navigate(-1);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            alert('An error occurred. Please try again.');
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
                                    <h2>Add Client Words</h2>
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
                                        <form onSubmit={handleSubmit} id="add_eventsform" encType="multipart/form-data">
                                            <div className="form-row">
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Meta Title</label>
                                                    <input
                                                        type="text"
                                                        name="metaTitle"
                                                        id="metaTitle"
                                                        className="form-control"
                                                        value={formData.metaTitle}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Meta Keyword</label>
                                                    <input
                                                        type="text"
                                                        name="metaKeyword"
                                                        id="metaKeyword"
                                                        className="form-control"
                                                        value={formData.metaKeyword}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="label_field">Meta Description</label>
                                                    <textarea
                                                        name="metaDescription"
                                                        id="metaDescription"
                                                        className="form-control"
                                                        rows="5"
                                                        value={formData.metaDescription}
                                                        onChange={handleInputChange}
                                                    ></textarea>
                                                </div>
                                               
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Client Name</label>
                                                    <input
                                                        type="text"
                                                        name="clientName"
                                                        id="clientName"
                                                        className={`form-control ${validationErrors.clientName ? 'is-invalid' : ''}`}
                                                        value={formData.clientName}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.clientName && (
                                                        <div className="invalid-feedback">{validationErrors.clientName}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="label_field">Sub Heading</label>
                                                    <input
                                                        type="text"
                                                        name="clientSubHeading"
                                                        id="clientSubHeading"
                                                        className={`form-control ${validationErrors.clientSubHeading ? 'is-invalid' : ''}`}
                                                        value={formData.clientSubHeading}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.clientSubHeading && (
                                                        <div className="invalid-feedback">{validationErrors.clientSubHeading}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-12 form-group">
                                                    <label className="label_field">Client Words</label>
                                                    <textarea
                                                        type="text"
                                                        rows={5}
                                                        name="clientWords"
                                                        id="clientWords"
                                                        className={`form-control ${validationErrors.clientWords ? 'is-invalid' : ''}`}
                                                        value={formData.clientWords}
                                                        onChange={handleInputChange}
                                                    />
                                                    {validationErrors.clientWords && (
                                                        <div className="invalid-feedback">{validationErrors.clientWords}</div>
                                                    )}
                                                </div>
                                                
                                            </div>
                                            <div className="form-group margin_0">
                                                <button className="main_bt" type="submit" disabled={loading}>
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        id === 'add' ? 
                                                        'Submit' 
                                                        : 'Update'
                                                    )}
                                                </button>
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
