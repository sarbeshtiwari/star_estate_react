import { useState, useEffect } from 'react';
import { fetchJobDetails, addJob, updateJob } from '../../../api/job/job_api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const useJobForm = (id) => {
    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        position: '',
        nos: '',
        location: '',
        qualification: '',
        min_exp: '',
        description: ''
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [editorHtml, setEditorHtml] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchloading, setfetchLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== 'add') {
            loadJobDetails(id);
        }
    }, [id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const loadJobDetails = async (id) => {
        setfetchLoading(true);
        try {
            const jobData = await fetchJobDetails(id);
            setFormData({
                metaTitle: jobData.metaTitle || '',
                metaKeyword: jobData.metaKeyword || '',
                metaDescription: jobData.metaDescription || '',
                position: jobData.position,
                nos: jobData.nos,
                location: jobData.location,
                qualification: jobData.qualification,
                min_exp: jobData.min_exp,
                description: jobData.description,
            });
            setEditorHtml(jobData.description || '');
        } catch (error) {
            setStatusMessage('Error fetching job details');
            console.error(error);
        } finally {
            setfetchLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditorChange = (value) => {
        setEditorHtml(value);
        setFormData(prevData => ({
            ...prevData,
            description: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.metaTitle) errors.metaTitle = 'Meta Title is required';
        if (!formData.metaKeyword) errors.metaKeyword = 'Meta Keyword is required';
        if (!formData.metaDescription) errors.metaDescription = 'Meta Description is required';
        if (!formData.position) errors.position = 'Position is required';
        if (!formData.nos) errors.nos = 'Number of Seats is required';
        if (!formData.location) errors.location = 'Location is required';
        if (!formData.qualification) errors.qualification = 'Qualification is required';
        if (!formData.min_exp) errors.min_exp = 'Minimum Experience is required';
        if (!editorHtml) errors.description = 'Description is required';

       
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const { position, nos, location, qualification, min_exp, description } = formData;

        if (!position || !nos || !location || !qualification || !min_exp || !description) {
            setStatusMessage("Enter required data");
            return;
        }

        setLoading(true);
        try {
            let result;
            if (id === 'add') {
                result = await addJob(formData);
            } else {
                result = await updateJob(id, formData);
            }

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title:  'Success!',
                    text:  'Data added successfully.',
                    confirmButtonText: 'OK'
                });
                navigate(-1);
                return { success: true, message: 'Job saved successfully' };
                
            } else {
                return { success: false, message: `Failed to save job: ${result.message}` };
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add/update data.',
                confirmButtonText: 'OK'
            });
            console.error('Error submitting form:', error);
            return { success: false, message: 'Error submitting form' };
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        editorHtml,
        statusMessage,
        loading,
        fetchloading,
        validationErrors,
        handleInputChange,
        handleEditorChange,
        handleSubmit
    };
};

export default useJobForm;
