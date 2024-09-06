import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProjectLocationAdvantages } from '../../../../../../api/dashboard/project_list/view_project/project_location_advantages_api';
import { getLocationAdvantages } from '../../../../../../api/location_advantages/location_advantages_api';
import { imageURL } from '../../../../../../imageURL';

export default function ProjectLocationAdvantage() {
  
    const [details, setDetails] = useState([]);
    const [LocationAdvantages, setLocationAdvantages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDetailsHandler();
    }, [id]);

    const fetchDetailsHandler = async () => {
        setLoading(true)
        try {
            // Fetch project LocationAdvantages
            const projectResponse = await getProjectLocationAdvantages(id);
            const projectLocationAdvantages = Array.isArray(projectResponse.data) ? projectResponse.data : [];
            
            // Filter LocationAdvantages where status is true
            const activeLocationAdvantages = await projectLocationAdvantages.filter(LocationAdv => LocationAdv.status === true);
            
            // Fetch all LocationAdvantages
            const allLocationAdvantagesResponse = await getLocationAdvantages();
            // const allLocationAdvantages = Array.isArray(allLocationAdvantagesResponse.data) ? allLocationAdvantagesResponse.data : [];

            // Map IDs of active LocationAdvantages to their details from all LocationAdvantages
            const LocationAdvantagesMap = new Map(allLocationAdvantagesResponse.map(LocationAdv => [LocationAdv._id, LocationAdv]));
            // const matchedLocationAdvantages = await activeLocationAdvantages.map(LocationAdv => LocationAdvantagesMap.get(LocationAdv.LocationAdvantagesId)).filter(Boolean);
            const matchedLocationAdvantages = await activeLocationAdvantages.map(LocationAdv => LocationAdvantagesMap.get(LocationAdv.LocationAdvantagesId)).filter(Boolean);

            const finalLocationAdvantages = matchedLocationAdvantages
            .filter(LocationAdv => LocationAdv.status === true);

            // Update state with matched LocationAdvantages
            setDetails(activeLocationAdvantages);
      
           
            setLocationAdvantages(finalLocationAdvantages);

        } catch (err) {
            console.error('Error fetching details:', err);
            setDetails([]);
            setLocationAdvantages([]);
        }
        setLoading(false)
    };

    // const handleStatusUpdate = async (detailId, status) => {
    //     try {
    //         const response = await updateStatus(detailId, status);
    //         if (response.success) {
    //             fetchDetailsHandler();
    //         } else {
    //             console.error('Error updating status:', response.message);
    //         }
    //     } catch (error) {
    //         console.error('Error updating status:', error);
    //     }
    // };

    // const handleDelete = async (detailId) => {
    //     try {
    //         await deleteDetails(detailId);
    //         fetchDetailsHandler();
    //     } catch (error) {
    //         console.error('Error deleting detail:', error);
    //     }
    // };

    return (
        <div >
            <Sidebar />
            <div >
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>Location Advantages</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <Link to={`/${id}/addProjectLocationAdvantages`} className="btn btn-success btn-xs">{details.length === 0 ? 'Add' : 'Edit'}</Link>
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
                                                                    <th>Proximity</th>
                                                                    {/* <th></th> */}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {LocationAdvantages.length === 0 ? ( <tr>
                                                                        <td colSpan="4" className="text-center">No Data Available</td>
                                                                    </tr>) : 
                                                                    (
                                                                        LocationAdvantages.map((detail, index) => (
                                                                    <tr key={detail._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                        <td className="sorting_1">{index + 1}</td>
                                                                        <td>{detail.image ? (
                                                                            <img 
                                                                                src={`${imageURL}/${detail.image}`} 
                                                                                alt={detail.title}
                                                                                style={{ width: '70px', height: '50px' }} // Adjust size as needed
                                                                            />
                                                                        ) : (
                                                                            <span>No Image Available</span>
                                                                        )}</td>
                                                                        <td>{detail.title}</td>
                                                                        <td>{details[index].proximity} {details[index].unit}</td>
                                                                        {/* <td>
                                                                            <ul className="list-inline d-flex justify-content-end">
                                                                                <li>
                                                                                    {detail.status === false ? (
                                                                                        <button className="btn btn-warning btn-xs" onClick={() => handleStatusUpdate(detail._id, true)}>Deactivate</button>
                                                                                    ) : (
                                                                                        <button className="btn btn-success btn-xs" onClick={() => handleStatusUpdate(detail._id, false)}>Active</button>
                                                                                    )}
                                                                                </li>
                                                                                <li>
                                                                                    <Link to={`/${id}/addQuickDetails/${detail._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                                </li>
                                                                                <li>
                                                                                    <button
                                                                                        className="btn btn-danger btn-xs"
                                                                                        onClick={() => {
                                                                                            if (window.confirm('Are you sure you want to delete this Detail?')) {
                                                                                                handleDelete(detail._id);
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <i className="fa fa-trash"></i>
                                                                                    </button>
                                                                                </li>
                                                                            </ul>
                                                                        </td> */}
                                                                    </tr>
                                                                )))}
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
