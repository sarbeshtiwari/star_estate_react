import React, { useState } from 'react';
import axios from 'axios';

const GalleryModal = ({ showModal, handleClose, handleFormSubmit, eventId }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] =useState(false);

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('eventImages', files[i]);
        }

        setLoading(true);

        try {
            await axios.post(`https://ecis.in/star-api/starEstate/images/uploadEventImages/${eventId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            handleClose(); // Close modal after submission
        } catch (error) {
            console.error('Error uploading images:', error);
        }
        setLoading(false);
    };

    if (!showModal) return null;

    return (
        <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Event Gallery</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            &times;
                        </button>
                    </div>
                    <form onSubmit={submitForm}>
                        <div className="modal-body">
                            <input type="file" multiple onChange={handleFileChange} />
                        </div>
                        <div className="modal-footer">
            
                                                
                                               
                                            
                            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        'Upload'
                                                    )}</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GalleryModal;
