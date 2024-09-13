import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../../sidebar';
import ReactQuill from 'react-quill';
import { fetchContent, saveContentSEO } from '../../../../../../api/dashboard/project_list/view_project/content_seo_api';
import Swal from 'sweetalert2';

export default function AddContentSEO() {
    const { id, ids } = useParams();
    const [formData, setFormData] = useState({
        schema: '',
        projectname: id,
        briefDescription: '',
        description: ''
    });

    const [editorHtml, setEditorHtml] = useState('');
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ids !== 'add') {
            const getContent = async () => {
                try {
                    const data = await fetchContent(id);
                    setFormData({
                        schema: data[0].schema || '',
                        projectname: data[0].projectname || id,
                        briefDescription: data[0].briefDescription || '',
                        description: data[0].description || ''
                    });
                    setEditorHtml(data[0].description || '');
                } catch (error) {
                    console.error('Error fetching details:', error);
                    alert('Failed to fetch content. Please try again later.');
                }
            };

            getContent();
        }
    }, [id, ids]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (value) => {
        setEditorHtml(value);
        setFormData(prevData => ({
            ...prevData,
            description: value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.briefDescription) { errors.briefDescription = 'Brief Description is required';}
        const trimmedEditorHtml = editorHtml.replace(/<(.|\n)*?>/g, '').trim();

        if (!trimmedEditorHtml) {
            errors.description = 'Description is required';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        const { schema, projectname, briefDescription, description } = formData;

        setLoading(true);
        try {
            const response = await saveContentSEO(ids, formData);
            const result = response.data;

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
                    text: `Failed to add/update data. ${result.message}`,
                    confirmButtonText: 'OK'
                });
                
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error Submitting form please try after sometime',
                confirmButtonText: 'OK'
            });
        }
        setLoading(false);
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
                                        <h2>{ids === 'add' ? 'Add' : 'Edit'} Overview</h2>
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
                                                style={{ marginTop: '10px' }}
                                            >
                                                Back
                                            </button>
                                        </div>
                                        <div className="full price_table padding_infor_info">
                                            <form method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                                                <div className="form-row">
                                                <div className="col-md-12 form-group" style={{ marginBottom: '20px' , marginTop: '30px' }}>
                                                        <label className="label_field">Brief Description</label>
                                                        <textarea
                                                            type="text"
                                                            name="briefDescription"
                                                            className={`form-control ${validationErrors.briefDescription ? 'is-invalid' : ''}`}
                                                            value={formData.briefDescription}
                                                            onChange={handleInputChange}
                                                            rows={5}
                                                        />
                                                        {validationErrors.briefDescription && (
                                                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                                                    {validationErrors.briefDescription}
                                                                </div>
                                                            )}
                                                    </div>
                                                    <div className="col-md-12 form-group" style={{ marginBottom: '20px' }}>
                                                        <label className="label_field">Description</label>
                                                        {validationErrors.description && (
                                                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                                                    {validationErrors.description}
                                                                </div>
                                                            )}
                                                            <ReactQuill
                                                                value={editorHtml}
                                                                onChange={handleChange}
                                                                modules={AddContentSEO.modules}
                                                                formats={AddContentSEO.formats}
                                                                style={{ height: '400px' }}
                                                                // className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                                                            />

                                                        
                                                    </div>
                                                    <div className="col-md-12 form-group" style={{ marginBottom: '20px' , marginTop: '30px' }}>
                                                        <label className="label_field">Schema</label>
                                                        <textarea
                                                            type="text"
                                                            name="schema"
                                                            className="form-control"
                                                            value={formData.schema}
                                                            onChange={handleInputChange}
                                                            rows={5}
                                                        />
                                                    </div>
                                                </div>
                                                <button 
                                                    className="main_bt"
                                                    type="submit"
                                                    disabled={loading}
                                                    style={{ marginTop: '10px' }}
                                                >
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        ids === 'add' ? 'Submit' : 'Update'
                                                    )}
                                                </button>
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

AddContentSEO.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }, { 'header': '4' }, { 'header': '5' }, { 'header': '6' }],
        [{ 'font': [] }],
        [{ 'size': ['small', 'medium', 'large', 'huge'] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image', 'video'],
        ['clean'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'direction': 'rtl' }],
    ],
};

AddContentSEO.formats = [
    'header', 'font', 'size',
    'list', 'bullet', 'indent', 'align',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'color', 'background',
    'link', 'image', 'video',
    'clean', 'script', 'direction', 'emoji',
];
