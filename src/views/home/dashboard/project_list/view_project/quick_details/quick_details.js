import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchDetails, updateStatus, deleteDetails } from '../../../../../../api/dashboard/project_list/view_project/quick_details_api';
import Swal from 'sweetalert2';

export default function QuickDetails() {
    const [details, setDetails] = useState([]);
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
            const data = await fetchDetails(id);
            setDetails(data);
        } catch (err) {
             // console.error('Error fetching details:', err);
        }
        setLoading(false)
    };

    const handleStatusUpdate = async (detailId, status) => {
        try {
            const response = await updateStatus(detailId, status);
            if (response.success) {
                fetchDetailsHandler();
            } else {
                // console.error('Error updating status:', response.message);
            }
        } catch (error) {
            // console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (detailId) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action will permanently delete the detail.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', // Red for delete
            cancelButtonColor: '#3085d6', // Blue for cancel
            confirmButtonText: 'Yes, delete it!'
        });
    
        if (result.isConfirmed) {
            try {
                await deleteDetails(detailId);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Data deleted successfully.',
                    confirmButtonText: 'OK',
                    timer: 1000,
                    timerProgressBar: true
                });
                fetchDetailsHandler(); // Refresh the details list

            } catch (error) {
                console.error('Error deleting detail:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error deleting data.',
                    confirmButtonText: 'OK'
                });
            }
        }
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
                                    <h2>Quick Details</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <Link to={`/${id}/addQuickDetails/add`} className="btn btn-success btn-xs">Add Quick Details</Link>
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
                                                                    <th>Heading</th>
                                                                    <th>Text</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {details.map((detail, index) => (
                                                                    <tr key={detail._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                        <td className="sorting_1">{index + 1}</td>
                                                                        <td>{detail.heading}</td>
                                                                        <td>{detail.data}</td>
                                                                        <td>
                                                                            <ul className="list-inline d-flex justify-content-end">
                                                                                <li>
                                                                                    {detail.status === false ? (
                                                                                        <button className="btn btn-warning btn-xs" onClick={() => handleStatusUpdate(detail._id, true)}>Deactive</button>
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
                                                                                            
                                                                                                handleDelete(detail._id);
                                                                                         
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
    );
}
