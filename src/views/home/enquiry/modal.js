import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Modal = ({ isOpen, onClose, onSubmit, text }) => {
    const [localText, setLocalText] = useState(text);

    useEffect(() => {
        setLocalText(text); // Update localText when text prop changes
    }, [text]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(localText);
        setLocalText(''); // Clear the local text after submission
    };

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{text ? 'Update Content' : 'Add Content'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <textarea
                            className="form-control"
                            rows="4"
                            value={localText}
                            onChange={(e) => setLocalText(e.target.value)}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            {text ? 'Update' : 'Submit'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;

