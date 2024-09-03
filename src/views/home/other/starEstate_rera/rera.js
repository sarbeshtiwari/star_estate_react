import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { imageURL } from '../../../../imageURL';
import { deleteStarRera, getStarRera, updateStarReraStatus } from '../../../../api/starRera/starRera_api';

export default function StarRera() {
   
    const [details, setDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDetailsHandler();
    }, []);

    const fetchDetailsHandler = async () => {
        try {
            const data = await getStarRera();
            setDetails(data);
        } catch (err) {
            console.error('Error fetching details:', err);
        }
    };

    const handleStatusUpdate = async (detailId, status) => {
        try {
            await updateStarReraStatus(detailId, status);
            const response =  await getStarRera();
            setDetails(response);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (detailId) => {
        try {
            await deleteStarRera(detailId);
            const response =  await getStarRera();
            setDetails(response);
        } catch (error) {
            console.error('Error deleting detail:', error);
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
