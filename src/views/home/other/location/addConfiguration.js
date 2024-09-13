import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../sidebar';
import { addConfiguration, fetchProjectConfigurationByID, fetchProjectConfigurationByLocationAndType } from '../../../../api/location/configuration_api';
import Swal from 'sweetalert2';

export default function AddConfiguration() {
    const navigate = useNavigate();
    const { ids, id } = useParams();

    const [formData, setFormData] = useState(() => ({
        location: ids,
        projectType: id === 'add' ? 'common' : id, // Check if id is 'add', otherwise use id
        meta_title: '',
        meta_key: '',
        meta_desc: '',
        projectType:'',
        projectConfiguration: '',
        ctcontent: '',
        schema: '',
    }));
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (id !== 'add') {
            const fetchData = async () => {
                
                try {
                    
                    const response = await fetchProjectConfigurationByID(id);
                    setFormData(response)
                    // const response = await fetchProjectConfigurationByLocationAndType(ids, id);
                    // if (response && response.data && response.data.length > 0) {
                    //     const projectData = response.data[0];
                    //     setFormData({
                    //         location: ids,
                    //         projectType: projectData.projectConfiguration,
                    //         meta_title: projectData.metaTitle || '',
                    //         meta_key: projectData.metaKeyword || '',
                    //         meta_desc: projectData.metaDescription || '',
                    //         projectConfiguration: projectData.projectConfiguration || '',
                    //         ctcontent: projectData.ctcontent || '',
                    //         schema: projectData.schema || '',
                    //     });
                    // }
                    // console.log(formData)
                } catch (error) {
                    console.error('Error fetching project configuration:', error);
                }
            };
            fetchData();
        }
    }, [ids, id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);
    

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    

    const validateForm = () => {
        const errors = {};
        if (!formData.projectConfiguration) errors.projectConfiguration = 'Project Configuration Type is required';
        if (!formData.projectType) errors.projectType = 'Project Type is required';
        return errors;
    };

    

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        const { meta_title, meta_key, meta_desc, projectConfiguration, projectType, ctcontent, schema} = formData;
        
        // const dataArray = [{
        //     // projectConfiguration: formData.projectConfiguration,
        //     projectType: id,
        //     metaTitle: formData.meta_title || ' ',
        //     metaKeyword: formData.meta_key || ' ',
        //     metaDescription: formData.meta_desc || ' ',
        //     ctcontent: formData.ctcontent || ' ',
        //     schema: formData.schema || ' ',
        // }];
        
        // const formDataToSend = new FormData();
        // formDataToSend.append('location', ids);
        // formDataToSend.append('projectConfiguration', formData.projectConfiguration)
        // formDataToSend.append('data', JSON.stringify(dataArray));
        
        // // Debugging: Log formDataToSend to verify content
        // for (let pair of formDataToSend.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }
        
        
      
        

        setLoading(true);
    
        try {
            

            let result;
           
                result = await addConfiguration(formData);
           
    
            if (result.success) {
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
                    text: 'Failed to add/update data.',
                    confirmButtonText: 'OK'
                });
                
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add/update data.',
                confirmButtonText: 'OK'
            });
            console.error('Error submitting form:', error);
        }
        setLoading(false)
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
                                        <h2>{id === 'add' ? 'Add Configuration' : 'Edit Configuration'}</h2>
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
                                                        <input type="text" name="meta_title" id="meta_title" value={formData.meta_title} onChange={handleInputChange} className="form-control" />
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <label className="label_field">Meta Keywords</label>
                                                        <input type="text" name="meta_key" id="meta_key" value={formData.meta_key} onChange={handleInputChange} className="form-control" />
                                                    </div>
                                                    <div className="col-md-12 form-group">
                                                        <label className="label_field">Meta Description</label>
                                                        <textarea name="meta_desc" id="meta_desc" value={formData.meta_desc} onChange={handleInputChange} className="form-control" rows="5"></textarea>
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <label className="label_field">Project Type</label>
                                                        <select 
                                                            name="projectType" 
                                                            id="projectType" 
                                                            value={formData.projectType} 
                                                            onChange={handleInputChange} 
                                                            className={`form-control ${validationErrors.projectType ? 'is-invalid' : ''}`}
                                                        >
                                                            <option value="">Select Project Type</option>
                                                            
                                                            {/* BHK Flats */}
                                                           
                                                                <option value="new-project">New Project</option>
                                                                <option value="residential">Residential</option>
                                                                <option value="commercial">Commercial</option>
                                                                <option value="flats">Flats</option>
                                                                <option value="common">Common</option>
                                                                <option value="apartments">Apartments</option>
                                                            
                                                            
                                                            
                                                        </select>

                                                        {validationErrors.projectType && (
                                                            <div className='invalid-feedback'>{validationErrors.projectType}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-md-6 form-group">
                                                        <label className="label_field">Project Configuration</label>
                                                        <select 
                                                            name="projectConfiguration" 
                                                            id="projectConfiguration" 
                                                            value={formData.projectConfiguration} 
                                                            onChange={handleInputChange} 
                                                            className={`form-control ${validationErrors.projectConfiguration ? 'is-invalid' : ''}`}
                                                        >
                                                            <option value="">Select Configuration</option>
                                                            
                                                            {/* BHK Flats */}
                                                            <optgroup label="BHK Flats">
                                                                <option value="1 BHK Flats">1 BHK Flats</option>
                                                                <option value="2 BHK Flats">2 BHK Flats</option>
                                                                <option value="3 BHK Flats">3 BHK Flats</option>
                                                                <option value="4 BHK Flats">4 BHK Flats</option>
                                                                <option value="5 BHK Flats">5 BHK Flats</option>
                                                            </optgroup>
                                                            
                                                            {/* Apartments */}
                                                            <optgroup label="Apartments">
                                                              
                                                                <option value="1 BHK Apartments">1 BHK Apartments</option>
                                                                <option value="2 BHK Apartments">2 BHK Apartments</option>
                                                                <option value="3 BHK Apartments">3 BHK Apartments</option>
                                                                <option value="4 BHK Apartments">4 BHK Apartments</option>
                                                                <option value="5 BHK Apartments">5 BHK Apartments</option>
                                                            </optgroup>
                                                            
                                                            {/* Properties */}
                                                            <optgroup label="Properties">
                                                                <option value="1 BHK Property">1 BHK Property</option>
                                                                <option value="2 BHK Property">2 BHK Property</option>
                                                                <option value="3 BHK Property">3 BHK Property</option>
                                                                <option value="4 BHK Property">4 BHK Property</option>
                                                                <option value="5 BHK Property">5 BHK Property</option>
                                                            </optgroup>
                                                            
                                                            {/* Projects */}
                                                            <optgroup label="Projects">
                                                                <option value="1 BHK Project">1 BHK Project</option>
                                                                <option value="2 BHK Project">2 BHK Project</option>
                                                                <option value="3 BHK Project">3 BHK Project</option>
                                                                <option value="4 BHK Project">4 BHK Project</option>
                                                                <option value="5 BHK Project">5 BHK Project</option>
                                                            </optgroup>
                                                        </select>

                                                        {validationErrors.projectConfiguration && (
                                                            <div className='invalid-feedback'>{validationErrors.projectConfiguration}</div>
                                                        )}
                                                    </div>
                                                   
                                                    
                                                    
                                                    
                                                    <div className="col-md-12 form-group">
                                                        <label className="label_field">Content</label>
                                                        <textarea name="ctcontent" id="ctcontent" value={formData.ctcontent} onChange={handleInputChange}  className={`form-control ${validationErrors.ctcontent ? 'is-invalid' : ''}`} rows="5"></textarea>
                                                        {validationErrors.ctcontent && (
                                                            <div className="invalid-feedback">{validationErrors.ctcontent}</div>
                                                        )}
                                                    </div>
                                                    <div className="col-md-12 form-group">
                                                        <label className="label_field">Schema</label>
                                                        <textarea name="schema" id="schema" value={formData.schema} onChange={handleInputChange} className="form-control" rows="5"></textarea>
                                                    </div>
                                                    {/* <div className="col-md-12 form-group">
                                                        <label className="label_field">Content Above FAQs</label>
                                                        <textarea name="content_above_faqs" id="content_above_faqs" value={formData.content_above_faqs} onChange={handleInputChange} className="form-control" rows="5"></textarea>
                                                    </div> */}
                                                </div>

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
        </>
    );
}
