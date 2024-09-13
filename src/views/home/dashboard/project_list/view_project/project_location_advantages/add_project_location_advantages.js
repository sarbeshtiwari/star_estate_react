import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getLocationAdvantages } from '../../../../../../api/location_advantages/location_advantages_api';
import { getProjectLocationAdvantages, ProjectLocationAdvantages, projectLocationContent } from '../../../../../../api/dashboard/project_list/view_project/project_location_advantages_api';
import _ from 'lodash';
import { imageURL } from '../../../../../../imageURL';
import Swal from 'sweetalert2';

export default function AddProjectLocationAdvantages() {
    const [details, setDetails] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(new Set());
    const [textBoxValues, setTextBoxValues] = useState({});
    const [proximityUnits, setProximityUnits] = useState({});
    const [loading , setLoading] = useState(false);
    const [fetchloading, setfetchLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
     
        locationContent: ''
    });
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchDetailsHandler(id);
    }, [id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchDetailsHandler = async (id) => {
        setfetchLoading(true)
        try {
            const Location = await getLocationAdvantages();
            setDetails(Location);
            
            const projectLocation = await getProjectLocationAdvantages(id);
            console.log(projectLocation)
            setFormData(projectLocation.data1[0] ? projectLocation.data1[0] : '');
            const trueStatusIds = projectLocation.data
                .filter(item => item.status)
                .map(item => item.LocationAdvantagesId);

            setSelectedLocation(new Set(trueStatusIds));

            // Initialize textBoxValues and proximityUnits from the existing projectLocation data
            const textBoxValues = {};
            const proximityUnits = {};

            projectLocation.data.forEach(item => {
                if (item.status) {
                    textBoxValues[item.LocationAdvantagesId] = {
                        title: item.title || '',
                        proximity: item.proximity || ''
                    };
                    proximityUnits[item.LocationAdvantagesId] = item.unit || '';
                }
            });

            setTextBoxValues(textBoxValues);
            setProximityUnits(proximityUnits);

        } catch (err) {
            console.error('Error fetching details:', err);
        }
        setfetchLoading(false)
    };

    const handleCheckboxChange = (locationId) => {
        setSelectedLocation((prevSelected) => {
            const updatedSelected = new Set(prevSelected);
            const newStatus = !updatedSelected.has(locationId);
    
            if (newStatus) {
                updatedSelected.add(locationId);
            } else {
                updatedSelected.delete(locationId);
            }
    
            // Call handleAddClick with the new status
            handleAddClick(locationId, newStatus);  // Pass the new status (true/false)
    
            return updatedSelected;
        });
    };
    
    

    // const handleCheckboxChange = (locationId) => {
    //     setSelectedLocation((prevSelected) => {
    //         const updatedSelected = new Set(prevSelected);
    //         const newStatus = !updatedSelected.has(locationId);

    //         if (newStatus) {
    //             updatedSelected.add(locationId);
    //         } else {
    //             updatedSelected.delete(locationId);
    //         }

    //         // debouncedStatus(locationId, newStatus, id);

    //         // Update the state
    //         return updatedSelected;
    //     });
    // };

    const handleTextBoxChange = (id, field, value) => {
        setTextBoxValues((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleProximityUnitChange = (id, unit) => {
        console.log(`Updating ${id} proximity unit with value: ${unit}`);
        setProximityUnits((prev) => ({
            ...prev,
            [id]: unit
        }));
    };

    const handleAddClick = async (locationId, status) => {
        const title = textBoxValues[locationId]?.title || '';
        const proximity = textBoxValues[locationId]?.proximity || '';
        const unit = proximityUnits[locationId] || '';
    
        // If it's checked (status = true) and title is missing, show an alert and prevent the update
        if (status && !title) {
            Swal.fire({
                icon: 'warning',
                title: 'Title is Mandatory',
                text: 'Please provide a title before submitting.',
                confirmButtonText: 'OK',
                timer: 1000,
            });
            return;
        }
    
        setLoading(true);
    
        try {
            // Ensure status is either true or false
            const validStatus = status !== undefined ? status : true;
    
            const response = await ProjectLocationAdvantages(locationId, validStatus, id, title, proximity, unit);
            Swal.fire({
                icon: 'success',
                title: validStatus ? 'Success!' : 'Unchecked Successfully',
                text: validStatus ? 'Data updated successfully.' : 'Data unchecked successfully.',
                confirmButtonText: 'OK',
                timer: 1000,
                timerProgressBar: true
            });
        } catch (error) {
            console.error('Error adding/updating data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add/update data.',
                confirmButtonText: 'OK'
            });
        }
    
        setLoading(false);
    };
    
    
    

    // const handleAddClick = async (locationId) => {
    //     const title = textBoxValues[locationId]?.title || '';
    //     const proximity = textBoxValues[locationId]?.proximity || '';
    //     const unit = proximityUnits[locationId] || '';

    
    //     // if (!unit && proximity) {
    //     //     alert('Please select a proximity unit.');
    //     //     return;
    //     // }

    //     if(!title) {
    //         alert("Title is mandatory");
    //         return;
    //     }
    //     setLoading(true);
    
    //     try {
    //         const isExisting = selectedLocation.has(locationId);
    //         const response = await ProjectLocationAdvantages(locationId, isExisting, id, title, proximity, unit);
    //         alert(isExisting ? 'Data updated successfully.' : 'Data added successfully.');
    //     } catch (error) {
    //         console.error('Error adding/updating data:', error);
    //         alert('Failed to add/update data.');
    //     }
    //     setLoading(false);
    // };
    
    const isChecked = (locationId) => selectedLocation.has(locationId);

    const handleChange = async (e) => {
        const { name, value} = e.target;
            setFormData({
                ...formData,
                [name]: value
            });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.locationContent) errors.locationContent = 'Location Content is required';
        
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        setLoading(true);
        try {
            
            const response = await projectLocationContent(formData, id);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title:  'Success!',
                    text:  'Data added successfully.',
                    confirmButtonText: 'OK',
                    timer: 1000,
                    timerProgressBar: true
                });
                navigate(-1);
            }
        }catch(error){
            console.error(error)
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
                                    <h2>Project Location Advantages</h2>
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
                                    <div id="subct_wrapper" className="dataTables_wrapper no-footer">
                                    {fetchloading ? (
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            <span className="ml-2">Loading...</span>
                                        </div>
                                    ) : ''} 
                                        <div className="full price_table padding_infor_info">
                                            <div className="row">
                                            <form onSubmit={handleSubmit} id="submit" encType="multipart/form-data">
                                            <h2>Location Content</h2>
                                            <div className="form-row">
                                            <div className="col-md-12 form-group">
                                                <label className="label_field">Location Content</label>
                                                <textarea
                                                    name="locationContent"
                                                    className={`form-control ${validationErrors.locationContent ? 'is-invalid' : ''}`}
                                                    value={formData.locationContent}
                                                    onChange={handleChange}
                                                    rows="4" // Adjust the number of rows as needed
                                                />
                                                {validationErrors.locationContent && (
                                                    <div className="invalid-feedback">{validationErrors.locationContent}</div>
                                                )}
                                            </div>

                                                
                                            </div>
                                            
                                            <div className="form-group margin_0">
                                           
                                                    <button className="main_bt" type="submit" disabled={loading} style={{ marginBottom: '20px' }}>
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        'Submit'
                                                    )}
                                                </button>
                                              
                                            </div>
                                            </form>
                                                {details.length === 0 ? (
                                                    <div className="col-lg-12 text-center">No Data Found</div>
                                                ) : (
                                                    details.map((detail) => (
                                                        detail.status === true ?
                                                        <div className="col-lg-2 mb-4" key={detail._id}>
                                                            <div className="card Location-card">
                                                            <img
                                                                src={`${imageURL}/${detail.image}`}
                                                                alt={detail.title}
                                                                style={{ height: '100px', objectFit: 'cover' }}
                                                                className="card-img-top"
                                                            />

                                                                <div className="card-body">
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked(detail._id)}
                                                                            onChange={() => handleCheckboxChange(detail._id)}
                                                                            className="mr-3"
                                                                        />
                                                                        <div>
                                                                            <h5 className="card-title mb-1">{detail.title}</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="card-footer">
                                                                    <div className="form-group">
                                                                        <label htmlFor={`title-${detail._id}`}>Title:</label>
                                                                        <input
                                                                            type="text"
                                                                            id={`title-${detail._id}`}
                                                                            value={textBoxValues[detail._id]?.title || ''}
                                                                            onChange={(e) => handleTextBoxChange(detail._id, 'title', e.target.value)}
                                                                            disabled={!isChecked(detail._id)}
                                                                            className="form-control"
                                                                        />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor={`proximity-${detail._id}`}>Proximity:</label>
                                                                        <input
                                                                            type="number"
                                                                            id={`proximity-${detail._id}`}
                                                                            value={textBoxValues[detail._id]?.proximity || ''}
                                                                            onChange={(e) => handleTextBoxChange(detail._id, 'proximity', e.target.value)}
                                                                            disabled={!isChecked(detail._id)}
                                                                            className="form-control"
                                                                        />
                                                                        <div className="form-check">
                                                                            {['km', 'm', 'hr', 'min'].map(unit => (
                                                                                <div className="d-flex align-items-center mr-4" key={unit}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`${unit}-${detail._id}`}
                                                                                        name={`proximity-unit-${detail._id}`}
                                                                                        value={unit}
                                                                                        checked={proximityUnits[detail._id] === unit}
                                                                                        onChange={() => handleProximityUnitChange(detail._id, unit)}
                                                                                        className=""
                                                                                    />
                                                                                    <label htmlFor={`${unit}-${detail._id}`} className="form-check-label ml-2">{unit.toUpperCase()}</label>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <button 
                                                                            className="btn btn-secondary btn-xs float-right"
                                                                            onClick={() => handleAddClick(detail._id)}
                                                                            disabled={!isChecked(detail._id) || loading}
                                                                            
                                                                        >
                                                                            {isChecked(detail._id) ? (<>
                                                                            {loading ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>): 'Update'}
                                                                            </>) : ''}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> : ('')
                                                    ))
                                                )}
                                            </div>
                                        </div>
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
