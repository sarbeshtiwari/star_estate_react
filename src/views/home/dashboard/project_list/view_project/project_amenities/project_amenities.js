import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import { fetchDetails } from '../../../../../../api/dashboard/project_list/view_project/quick_details_api';
import { getProjectAmenities } from '../../../../../../api/dashboard/project_list/view_project/project_amenity_api';
import { getAllTheAmenities } from '../../../../../../api/amenities/amenities_api';
import { imageURL } from '../../../../../../imageURL';

export default function ProjectAmenities() {
    const [details, setDetails] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDetailsHandler();
    }, [id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchDetailsHandler = async () => {
        setLoading(true)
        try {
            // Fetch project amenities
            const projectResponse = await getProjectAmenities(id);
            // Ensure projectResponse.data is an array
            const projectAmenities = Array.isArray(projectResponse.data.data) ? projectResponse.data.data : [];
            
            // Filter amenities where status is true
            const activeAmenities = projectAmenities.filter(amenity => amenity.status === true);
            
            // Fetch all amenities
            const allAmenitiesResponse = await getAllTheAmenities();
            // Ensure allAmenitiesResponse.data is an array
            let allAmenities = Array.isArray(allAmenitiesResponse.data) ? allAmenitiesResponse.data : [];
            
            // console.log('Active Amenities:', activeAmenities);
            // console.log('All Amenities:', allAmenities);
    
            // Map IDs of active amenities to their details from all amenities
            const amenitiesMap = new Map(allAmenities.map(amenity => [amenity._id, amenity]));
            const matchedAmenities = activeAmenities.map(amenity => amenitiesMap.get(amenity.amenityId)).filter(Boolean);
    
            // Update state with matched amenities
            // console.log('Matched Amenities:', matchedAmenities);
            setDetails(activeAmenities);
            setAmenities(matchedAmenities);
    
        } catch (err) {
            // console.error('Error fetching details:', err);
            setDetails([]);
            setAmenities([]);
        }
        setLoading(false)
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
                                    <h2>Project Amenities</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <Link to={`/${id}/addProjectAmenities`} className="btn btn-success btn-xs">
                                            {details.length === 0 ? 'Add' : 'Edit'}
                                        </Link>
                                        <button 
                                            className="btn btn-primary btn-xs float-right"
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </button>
                                    </div>
                                    <div id="subct_wrapper" className="dataTables_wrapper no-footer">
                                    {loading ? (
    <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
        </div>
        <span className="ml-2">Loading...</span>
    </div>
) : ''} 
                                        <div className="full price_table padding_infor_info">
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="table-responsive-sm">
                                                        <table id="subct" className="table table-striped projects">
                                                            <thead className="thead-dark">
                                                                <tr>
                                                                    <th>No</th>
                                                                   
                                                                    <th>Icon</th>
                                                                    <th>Title</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {amenities.length === 0 ? (
                                                                    <tr>
                                                                        <td colSpan="4" className="text-center">No Data Available</td>
                                                                    </tr>
                                                                ) : (
                                                                    amenities.map((amenity, index) => (
                                                                        <tr key={amenity._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                            <td className="sorting_1">{index + 1}</td>
                                                                            
                                                                            <td> <img 
                                                                   src={`${imageURL}/${amenity.image}`}

                                                                    className="rounded-circle"
                                                                    style={{ objectFit: 'cover' }}
                                                                    alt={''}
                                                                    width="50"
                                                                    height="50"
                                                                /></td>
                                                                            <td>{amenity.title}</td>
                                                                        </tr>
                                                                    ))
                                                                )}
                                                            </tbody>
                                                        </table>
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
            </div>
        </div>
    );
}
