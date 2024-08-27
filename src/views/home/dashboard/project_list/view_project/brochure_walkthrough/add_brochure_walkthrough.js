import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Sidebar from "../../../../sidebar";
import { addBrochure, getBrochureByID, updateBrochure } from "../../../../../../api/dashboard/project_list/view_project/brochure_walkthrough_api";

export default function AddBrochureWalkthrough() {
    const {id, ids} = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        brochure: null,
        walkthrough: '',
        projectname: id
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        console.log(ids)
        if (ids !== 'add') {
            fetchBrochureByID(ids);
        }
    },[id, ids])
    
    const fetchBrochureByID = async (ids) => {
        try {
            const data = await getBrochureByID(ids);
            setFormData(data);
        } catch (err) {
            console.error('Failed to fetch data:', err.message);
        }
    };
    

    const handleWalkthroughChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleBrochureChange = async (e) => {
        const file = e.target.files[0];
        
        if (file) {
            try {
                // Validate the file
                await validateFile(file);
                
                // If valid, update form data
                setFormData(prevState => ({
                    ...prevState,
                    brochure: file
                }));
                
                // Clear any previous validation errors for this file
                setValidationErrors(prevErrors => ({ ...prevErrors, brochure: '' }));
            } catch (error) {
                // Handle validation error
                setValidationErrors(prevErrors => ({ ...prevErrors, brochure: error }));
            }
        } else {
            // Handle case when no file is selected
            setValidationErrors(prevErrors => ({ ...prevErrors, brochure: 'No file selected.' }));
        }
    };
    
    const validateFile = (file) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        
        return new Promise((resolve, reject) => {
            // Check if the file type is allowed
            if (!allowedTypes.includes(file.type)) {
                return reject("Only PDF and DOCX formats are allowed.");
            }
    
            // Check the file size (5 MB limit)
            const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
            if (file.size > maxSize) {
                return reject("File size must be less than 5 MB.");
            }
    
            // Check the file signature using binary data
            const reader = new FileReader();
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
                const dataView = new DataView(arrayBuffer);
                
                const isPDF = dataView.getUint8(0) === 0x25 &&
                    dataView.getUint8(1) === 0x50 &&
                    dataView.getUint8(2) === 0x44 &&
                    dataView.getUint8(3) === 0x46;
    
                const isDOCX = dataView.getUint8(0) === 0x50 &&
                    dataView.getUint8(1) === 0x4b &&
                    dataView.getUint8(2) === 0x03 &&
                    dataView.getUint8(3) === 0x04;
    
                if (isPDF || isDOCX) {
                    resolve(file);
                } else {
                    reject("Invalid file format.");
                }
            };
    
            reader.onerror = () => reject("Error reading file.");
            reader.readAsArrayBuffer(file);
        });
    };
    
    
    

    const validateForm = () => {
        const errors = {};
        
            if (!formData.walkthrough) {
                errors.walkthrough = 'Walkthrough is required';
            }
            if (!formData.brochure) {
                errors.brochure = 'Brochure is required';
            }
       
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };




     


    const handleSubmit = async (e) => {
        e.preventDefault();

        // const data = new FormData();
        // for (const key in formData) {
        //     if (formData[key] !== null && formData[key] !== '') {
        //         data.append(key, formData[key]);
        //     }
        // }
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        setLoading(true);

        try {
            if (ids !== 'add') {
                await updateBrochure(ids, formData);
            } else {
                await addBrochure(id, formData);
            }
            navigate(-1);
        } catch (error) {
            console.error('Error:', error.message);
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
                            <h2>{ids === 'add' ? 'Add' : 'Edit'} Brochure & Walkthrough</h2>
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

                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="form-row">
                                        <div className="col-md-6 form-group">
                                            <label className="label_field">Walkthrough URL</label>
                                            <input 
                                                type="text" 
                                                name="walkthrough" 
                                                id="walkthrough" 
                                                value={formData.walkthrough} 
                                                onChange={handleWalkthroughChange} 
                                                className={`form-control ${validationErrors.walkthrough ? 'is-invalid' : ''}`}
                                            />
                                            {validationErrors.walkthrough && (
                                                <div className="text-danger">{validationErrors.walkthrough}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label className="label_field">Brochure</label>
                                            <input 
                                                type="file" 
                                                name="brochure" 
                                                id="brochure" 
                                                onChange={handleBrochureChange} 
                                                className={`form-control ${validationErrors.brochure ? 'is-invalid' : ''}`}
                                            />
                                            {validationErrors.brochure && (
                                                <div className="text-danger">{validationErrors.brochure}</div>
                                            )}
                                        </div>
                                    </div>
                                    {ids === 'add' ? (
                                            <div className="form-group margin_0">
                                           
                                                    <button className="main_bt" type="submit" disabled={loading}>
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        'Submit'
                                                    )}
                                                </button>
                                              
                                            </div>): (<>
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

}