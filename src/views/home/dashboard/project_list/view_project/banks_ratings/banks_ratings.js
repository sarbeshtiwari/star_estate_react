import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProjectBanks } from '../../../../../../api/dashboard/project_list/view_project/project_banks_api';


export default function ProjectBanksRatings() {
    const [details, setDetails] = useState([]);
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
        try {
            const response = await getProjectBanks(id);
            console.log(response)
            // setDetails(response)
            // Assuming `response` is an object with a property that holds the array
            if (response && response.data) {
                // console.log('data')
                // Check if response.data is an array
                // if (Array.isArray(response.data)) {
                    
                    setDetails([response.data]);
                // } 
            } else {
                // No data received
                // console.error('No data received:', response);
                setDetails([]);
            }
        } catch (err) {
            // console.error('Error fetching details:', err);
            setDetails([]);
        }
    };
    
    const handleStatusUpdate = () => {}

    const handleDelete = () => {}

   

    return (
        <div >
            <Sidebar />
            <div>
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>Bank Details</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        {details.length === 0 ? ( <Link to={`/${id}/addBanks/add`} className="btn btn-success btn-xs">Add</Link>): ('')}
                                       
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
                                                                    <th>Account Number</th>
                                                                    <th>IFSC Code</th>
                                                                    <th>CIF No</th>
                                                                    <th>Bank Name</th>
                                                                    <th>Bank Address</th>
                                                                    <th>Other Details</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {details.map((detail, index) => (
                                                                    <tr key={detail._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                        <td className="sorting_1">{index + 1}</td>
                                                                        <td>{detail.accountNumber}</td>
                                                                        <td>{detail.IFSCcode}</td>
                                                                        <td>{detail.CIFno}</td>
                                                                        <td>{detail.bankName}</td>
                                                                        <td>{detail.bankAddress}</td>
                                                                        <td>{detail.otherDetails}</td>
                                                                        <td>
                                                                            {/* <ul className="list-inline d-flex justify-content-end"> */}
                                                                                {/* <li>
                                                                                    {detail.status === false ? (
                                                                                        <button className="btn btn-warning btn-xs" onClick={() => handleStatusUpdate(detail._id, true)}>Deactive</button>
                                                                                    ) : (
                                                                                        <button className="btn btn-success btn-xs" onClick={() => handleStatusUpdate(detail._id, false)}>Active</button>
                                                                                    )}
                                                                                </li> */}
                                                                                {/* <li> */}
                                                                                    <Link to={`/${id}/addBanks/${detail._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                                {/* </li> */}
                                                                                {/* <li>
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
                                                                                </li> */}
                                                                            {/* </ul> */}
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
