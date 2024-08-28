import React, { useState, useEffect } from 'react';
import './modal.css'; // You need to create a CSS file for styling

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
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{text ? 'Update Note' : 'Add Note'}</h2>
                <textarea
                    rows="4"
                    value={localText}
                    onChange={(e) => setLocalText(e.target.value)}
                />
                <button onClick={handleSubmit}>{text ? 'Update' : 'Submit'}</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
