import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBrochure, updateStatus, deleteDetails } from '../../../../../../api/dashboard/project_list/view_project/brochure_walkthrough_api';
import { imageURL } from '../../../../../../imageURL';

export default function BrochureWalkthrough() {
    const { id } = useParams();
    const [details, setDetails] = useState([]);
    const [popupContent, setPopupContent] = useState(null); // State to hold popup content
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDetailsHandler();
    }, [id]);

    const fetchDetailsHandler = async () => {
        setLoading(true);
        try {
            const data = await getBrochure(id);
            setDetails(data);
        } catch (err) {
            console.error('Error fetching details:', err);
        }
        setLoading(false)
    };

    const handleStatusUpdate = async (detailId, status) => {
        try {
            const response = await updateStatus(detailId, status);
            if (response.success) {
                fetchDetailsHandler();
            } else {
                console.error('Error updating status:', response.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (detailId) => {
        try {
            await deleteDetails(detailId);
            fetchDetailsHandler();
        } catch (error) {
            console.error('Error deleting detail:', error);
        }
    };

    // Handle showing brochure in a popup
    const handleBrochureClick = (url) => {
        const fileExtension = url.split('.').pop().toLowerCase();
        let content;
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            content = <img src={url} alt="Brochure" style={{ width: '100%', height: 'auto' }} />;
        } else if (['pdf'].includes(fileExtension)) {
            content = <iframe src={url} title="Brochure PDF" style={{ width: '100%', height: '600px' }} />;
        } else {
            window.open(url, '_blank');
            return;
        }
        setPopupContent(content);
    };

    // Handle showing walkthrough in a popup
    const handleWalkthroughClick = (url) => {
        setPopupContent(
            <iframe
                src={url}
                title="Walkthrough Video"
                frameBorder="0"
                allowFullScreen
                style={{ width: '100%', height: '500px' }}
            />
        );
    };

    // Close the popup
    const closePopup = () => {
        setPopupContent(null);
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
                                    <h2>Brochure And Walkthrough</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                    {details.length === 0 || details.every(detail => detail.status === false) ? (
                                        <Link to={`/${id}/addBrochureWalkthrough/add`} className="btn btn-success btn-xs">
                                            Add Brochure And Walkthrough
                                        </Link>
                                    ) : (
                                        ''
                                    )} 
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
                                                                    {/* <th>Brochure</th> */}
                                                                    <th>Walkthrough</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {details.length === 0 ? (
                                                                    <tr>
                                                                        <td colSpan="4" className="text-center">No Data Found</td>
                                                                    </tr>
                                                                ) : (
                                                                    details.map((detail, index) => (
                                                                        <tr key={detail._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                            <td className="sorting_1">{index + 1}</td>
                                                                            {/* <td> */}
                                                                                
                                                                                {/* <button 
                                                                                    className="btn btn-info btn-xs" 
                                                                                    onClick={() => handleBrochureClick(`${imageURL}/${detail.brochure}`)}
                                                                                >
                                                                                    Open Brochure
                                                                                </button> */}
                                                                            {/* </td> */}
                                                                            {detail.walkthrough}
                                                                            {/* <td>
                                                                                <button
                                                                                    className="btn btn-primary btn-xs"
                                                                                    onClick={() => handleWalkthroughClick(detail.walkthrough)}
                                                                                >
                                                                                    Open Walkthrough
                                                                                </button>
                                                                            </td> */}
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
                                                                                        <Link to={`/${id}/addBrochureWalkthrough/${detail._id}`} className="btn btn-primary btn-xs">
                                                                                            <i className="fa fa-edit"></i>
                                                                                        </Link>
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
                                                                    ))
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            {popupContent && (
                                                <div className="popup-container">
                                                    <div className="popup-content">
                                                        <button className="close-btn" onClick={closePopup}>X</button>
                                                        {popupContent}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup Styles */}
            <style jsx>{`
                .popup-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .popup-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    position: relative;
                    max-width: 100%;
                    max-height: 80%;
                    overflow: auto;
                }
                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
