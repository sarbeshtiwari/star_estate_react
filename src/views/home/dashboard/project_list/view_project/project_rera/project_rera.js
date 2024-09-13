import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProjectRera, getProjectReraByProject, updateProjectReraStatus } from '../../../../../../api/dashboard/project_list/view_project/project_rera_api';
import { imageURL } from '../../../../../../imageURL';
import Swal from 'sweetalert2';

export default function ProjectRera() {
   
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
            const data = await getProjectReraByProject(id);
            setDetails(data);
        } catch (err) {
            // console.error('Error fetching details:', err);
        }
        setLoading(false)
    };

    const handleStatusUpdate = async (detailId, status) => {
        try {
            await updateProjectReraStatus(detailId, status);
            const response =  await getProjectReraByProject(id);
            setDetails(response);
        } catch (error) {
            // console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (detailId) => {
        try {
            await deleteProjectRera(detailId);
            Swal.fire({
                icon: 'success',
                title:  'Success!',
                text:  'Data Deleted successfully.',
                confirmButtonText: 'OK',
                timer: 2000, 
                timerProgressBar: true, 
            });
            const response =  await getProjectReraByProject(id);
            setDetails(response);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error Deleting data.',
                confirmButtonText: 'OK'
            });
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
                                    <h2>Project RERA Details</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <Link to={`/${id}/addProjectRERA/add`} className="btn btn-success btn-xs">Add QR Code</Link>
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
                                                                    <th>RERA No</th>
                                                                    <th>RERA Heading</th>
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
                                                                        <td>{detail.reraHeading}</td>
                                                                       <td>{detail.reraWebsite}</td>
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
                                                                                    <Link to={`/${id}/addProjectRERA/${detail._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
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
    );
}
