import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { imageURL } from '../../../../imageURL';
import { deleteStarRera, getStarRera, updateStarReraStatus } from '../../../../api/starRera/starRera_api';
import Swal from 'sweetalert2';

export default function StarRera() {
   
    const [details, setDetails] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDetailsHandler();
    }, []);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchDetailsHandler = async () => {
        setLoading(true)
        try {
            const data = await getStarRera();
            setDetails(data);
        } catch (err) {
            // console.error('Error fetching details:', err);
        }
        setLoading(false)
    };

    const handleStatusUpdate = async (detailId, status) => {
        try {
            await updateStarReraStatus(detailId, status);
            const response =  await getStarRera();
            setDetails(response);
        } catch (error) {
            // console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (detailId) => {
        try {
            // Show SweetAlert confirmation dialog
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This action will permanently delete the selected detail.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33', // Red for danger
                cancelButtonColor: '#3085d6', // Blue for cancel
                confirmButtonText: 'Yes, delete it!'
            });
    
            // Proceed if the user confirms the deletion
            if (result.isConfirmed) {
                await deleteStarRera(detailId);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Data deleted successfully.',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true, 
                });
    
                // Refresh the data
                const response = await getStarRera();
                setDetails(response);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'There was an issue deleting the data.',
                confirmButtonText: 'OK'
            });
            // Optional: console.error('Error deleting detail:', error);
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
                                    <h2>Star Rera</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <Link to={`/addStarRera/add`} className="btn btn-success btn-xs">Add Star Rera</Link>
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
                                                                    <th>RERA No</th>
                                                                    <th>Rera Website</th>
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
                                                                        <td>{detail.title}</td>
                                                                        <td>{detail.reraNO}</td>
                                                                       <td>{detail.reraWebsite}</td>
                                                                        <td>
                                                                            <ul className="list-inline d-flex justify-content-end">
                                                                                <li>
                                                                                    {detail.status === false ? (
                                                                                        <button className="btn btn-warning btn-xs" onClick={() => handleStatusUpdate(detail._id, true)}>Deactivate</button>
                                                                                    ) : (
                                                                                        <button className="btn btn-success btn-xs" onClick={() => handleStatusUpdate(detail._id, false)}>Active</button>
                                                                                    )}
                                                                                </li>
                                                                                {/* <li>
                                                                                    <Link to={`/addStarRera/${detail._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                                </li> */}
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
