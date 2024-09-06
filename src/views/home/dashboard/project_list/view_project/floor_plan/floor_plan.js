import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteFloorPlan, getFloorContent, getFloorPlanByProject, projectFloorContent, updateFloorPlanStatus } from '../../../../../../api/dashboard/project_list/view_project/floor_plan_api';
import { imageURL } from '../../../../../../imageURL';
import Modal from '../../../../enquiry/modal';

export default function FloorPlan() {
    
    const [details, setDetails] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null); // Track selected item ID
    const [noteText, setNoteText] = useState(''); // Track the note text
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
     
        floorPlanContent: ''
    });

    useEffect(() => {
        fetchDetailsHandler();
    }, [id]);

    const fetchDetailsHandler = async () => {
        setLoading(true)
        try {
            const data = await getFloorPlanByProject(id);
            setDetails(data);
        } catch (err) {
            console.error('Error fetching details:', err);
        }
        setLoading(false)
    };

    const handleStatusUpdate = async (detailId, status) => {
        try {
            await updateFloorPlanStatus(detailId, status);
            const response =  await getFloorPlanByProject(id);
            setDetails(response);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (detailId) => {
        try {
            await deleteFloorPlan(detailId);
             const response =  await getFloorPlanByProject(id);
            setDetails(response);
        } catch (error) {
            console.error('Error deleting detail:', error);
        }
    };

    const handleOpenModal = async () => {
        setSelectedItemId(id); // Set selected item ID
        setLoading(true)
        const data = await getFloorContent(id);
        setLoading(false)
        setNoteText(data.floorPlanContent || ''); // Prefill note text or set empty string
        setModalOpen(true);
    };

    const handleModalSubmit = async (text) => {
        if (selectedItemId !== null) {
            try {
                // Update formData with the note text from the modal
                setFormData({
                    ...formData,
                    floorPlanContent: text, // Assuming the text corresponds to `floorPlanContent`
                });
    
                console.log('Submitted text:', { ...formData, floorPlanContent: text }, id);
    
                await projectFloorContent(id, { ...formData, floorPlanContent: text }); // Pass the updated formData to the API
    
                // Close the modal and reset the state
                setModalOpen(false);
                setSelectedItemId(null);
                setNoteText('');
            } catch (error) {
                console.error('Error saving query:', error);
            }
        } else {
            console.error('No item selected for saving.');
        }
    };

    return (
        <>
        <div >
            <Sidebar />
            <div >
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>Floor Plan</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                <div className="full graph_head">
                                        <Link to={`/${id}/addFloorPlan/add`} className="btn btn-success btn-xs me-2">
                                            Add Floor Plan
                                        </Link>
                                        <button 
                                            className="btn btn-primary btn-xs me-2" 
                                            onClick={() => handleOpenModal(id)}
                                        >
                                            <i className="fa fa-plus"></i> 
                                            {' Add Content'}
                                        </button>
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
                                                                    <th>Image</th>
                                                                    <th>Area</th>
                                                                    <th>Title</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {details.map((detail, index) => (
                                                                    <tr key={detail._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                        <td className="sorting_1">{index + 1}</td>
                                                                        <td>
                                                                            <img 
                                                                            src={`${imageURL}/${detail.image}`}

                                                                                className="rounded-circle"
                                                                                style={{ objectFit: 'cover' }}
                                                                                alt={detail.title}
                                                                                width="50"
                                                                                height="50"
                                                                            />
                                                                        </td>
                                                                        
                                                                        <td>{detail.area}</td>
                                                                        <td>{detail.title}</td>
                                                                        <td>
                                                                            <ul className="list-inline d-flex justify-content-end">
                                                                                <li>
                                                                                    {detail.status === false ? (
                                                                                        <button className="btn btn-warning btn-xs" onClick={() => handleStatusUpdate(detail._id, true)}>Deactivate</button>
                                                                                    ) : (
                                                                                        <button className="btn btn-success btn-xs" onClick={() => handleStatusUpdate(detail._id, false)}>Active</button>
                                                                                    )}
                                                                                </li>
                                                                                <li>
                                                                                    <Link to={`/${id}/addFloorPlan/${detail._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
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
                                                                        </td>
                                                                    </tr>
                                                                ))}
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
        <Modal
            isOpen={isModalOpen}
            onClose={() => {
                setModalOpen(false);
                setSelectedItemId(null); // Reset selected item ID on modal close
                setNoteText(''); // Reset note text on modal close
            }}
            value={formData.floorPlanContent}
            onSubmit={(text) => handleModalSubmit(text)} // Pass the submitted text to the handler
            text={noteText} // Pass the note text to the modal
        />
    </>
    );
}
