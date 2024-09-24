import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllTheAmenities } from '../../../../../../api/amenities/amenities_api';
import './amenities.module.css';
import { ProjectAmenities, getProjectAmenities, projectAmenitiesContent } from '../../../../../../api/dashboard/project_list/view_project/project_amenity_api';
import _ from 'lodash';
import { imageURL } from '../../../../../../imageURL';
import Swal from 'sweetalert2';

export default function AddProjectAmenities() {
    const [details, setDetails] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState(new Set()); // Set to manage selected amenities
    const { id } = useParams();
    const navigate = useNavigate();
    const [fetchloading, setfetchLoading] = useState(false);
    const [formData, setFormData] = useState({
     
        amenityContent: ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
            // Fetch all amenities
            const amenities = await getAllTheAmenities();
            const sortedAmenity= amenities.data.sort((a, b) => {
                if (a.title < b.title) return -1;
                if (a.title > b.title) return 1;
                return 0;
              });
            
            setDetails(sortedAmenity);
            

            // Fetch project amenities
            const projectAmenities = await getProjectAmenities(id);
            setFormData(projectAmenities.data.data1[0] ? projectAmenities.data.data1[0] : '');
            // Extract IDs with status true
            const trueStatusIds = projectAmenities.data.data
                .filter(item => item.status)
                .map(item => item.amenityId);

            // Update selectedAmenities based on the fetched amenities
            setSelectedAmenities(new Set(trueStatusIds));
        } catch (err) {
            console.error('Error fetching details:', err);
        }
        setfetchLoading(false)
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.amenityContent) errors.amenityContent = 'Amenity Content is required';
        
        return errors;
    };

    const handleChange = async (e) => {
        const { name, value} = e.target;
            setFormData({
                ...formData,
                [name]: value
            });
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
            
            const response = await projectAmenitiesContent(formData, id);
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add/update data.',
                confirmButtonText: 'OK'
            });
            console.error(error)
        }
        setLoading(false);
        // Add form submission logic here
    };


    const handleCheckboxChange = (amenityId) => {
        setSelectedAmenities((prevSelected) => {
            const updatedSelected = new Set(prevSelected);
            const newStatus = !updatedSelected.has(amenityId);

            if (newStatus) {
                updatedSelected.add(amenityId);
            } else {
                updatedSelected.delete(amenityId);
            }

            // Call debounced function
            debouncedStatus(amenityId, newStatus, id);

            return updatedSelected;
        });
    };

    const debouncedStatus = _.debounce(async (amenityId, status, id) => {
        try {
            const response = await ProjectAmenities(amenityId, status, id);
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add/update data.',
                confirmButtonText: 'OK'
            });
            console.error('Error updating status:', error);
        }
    }, 300); // Adjust debounce delay as needed

    // Helper function to check if an amenity is selected
    const isChecked = (amenityId) => selectedAmenities.has(amenityId);

    return (
        <div>
            <Sidebar />
            <div className="container-fluid">
                <div className="midde_cont">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title">
                                <h2>Project Amenities</h2>
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
                                            <h2>Amenity Content</h2>
                                            <div className="form-row">
                                            <div className="col-md-12 form-group">
                                                <label className="label_field">Amenity Content</label>
                                                <textarea
                                                    name="amenityContent"
                                                    className={`form-control ${validationErrors.amenityContent ? 'is-invalid' : ''}`}
                                                    value={formData.amenityContent}
                                                    onChange={handleChange}
                                                    rows="4" // Adjust the number of rows as needed
                                                />
                                                {validationErrors.amenityContent && (
                                                    <div className="invalid-feedback">{validationErrors.amenityContent}</div>
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
                                                <div className="col-lg-12 text-center">No Amenities Found</div>
                                            ) : (
                                                details.map((detail) => (
                                                    detail.status === true ?
                                                    <div className="col-lg-4 mb-4" key={detail._id}>
                                                        <div className="card amenity-card">
                                                          
                                                        <div className="card-body">
                                                            <div className="d-flex align-items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked(detail._id)}
                                                                    onChange={() => handleCheckboxChange(detail._id)}
                                                                    className="mr-3"
                                                                />
                                                                <img
                                                                    src={`${imageURL}/${detail.image}`}
                                                                    alt={detail.title}
                                                                    width="50"
                                                                    height="50"
                                                                    style={{ borderRadius: '50%', marginRight: '15px' }}  
                                                                />
                                                                <div>
                                                                    <h5 className="card-title mb-1">{detail.title}</h5>
                                                                    
                                                                </div>
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
    );
}
