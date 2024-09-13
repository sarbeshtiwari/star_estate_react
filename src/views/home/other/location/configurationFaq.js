import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../sidebar';
import { deleteFAQ, fetchFAQs, updateFAQStatus } from '../../../../api/location/configurationFAQ_api';
import Swal from 'sweetalert2';

export default function ConfigurationFAQ() {
    const [faq, setFAQ] = useState([]);
    const [loading, setLoading] = useState(false);
    const { city, propertyType , slugURL} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (slugURL && propertyType) {
            fetchFAQsData(slugURL, propertyType);
            
        }
    }, [slugURL, propertyType]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchFAQsData = async (slugURL, propertyType) => {
        setLoading(true);
        try {
            const faqs = await fetchFAQs(slugURL, propertyType);
            console.log(faqs)
            setFAQ(faqs);
        } catch (error) {
            // console.error('Error fetching FAQs:', error);
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateFAQStatus(id, status);
            fetchFAQsData(slugURL, propertyType);  // Refresh FAQs after update
        } catch (error) {
            // console.error('Error updating FAQ status:', error);
        }
    };

    const handleDeleteFAQ = async (id) => {
        try {
            await deleteFAQ(id);
            Swal.fire({
                icon: 'success',
                title:  'Success!',
                text:  'Data Deleted successfully.',
                confirmButtonText: 'OK',
                timer: 2000, 
                timerProgressBar: true, 
            });
            fetchFAQsData(slugURL, propertyType);  // Refresh FAQs after delete
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error Deleting data.',
                confirmButtonText: 'OK'
            });
            // console.error('Error deleting FAQ:', error);
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
                                    <h2>Footer FAQs</h2>
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
                                    <div className="full graph_head">
                                        <Link to={`/addConfigurationFAQ/${slugURL}/add`} className="btn btn-success btn-xs">Add FAQs</Link>
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
                                        <div className="table-responsive">
                                            <table className="table table-striped projects dataTable no-footer">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Question</th>
                                                        <th>Answers</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {faq.map((item, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                            <td className="sorting_1">{index + 1}</td>
                                                            <td>{item.faqQuestion}</td>
                                                            <td>{item.faqAnswer}</td>
                                                            <td>
                                                                <ul className="list-inline d-flex justify-content-end">
                                                                    <li>
                                                                        {item.status === false ? (
                                                                            <button className="btn btn-warning btn-xs" onClick={() => handleUpdateStatus(item._id, true)}>Deactive</button>
                                                                        ) : (
                                                                            <button className="btn btn-success btn-xs" onClick={() => handleUpdateStatus(item._id, false)}>Active</button>
                                                                        )}
                                                                    </li>
                                                                    <li>
                                                                        <Link to={`/addConfigurationFAQ/${city}/${item._id}`} className="btn btn-primary btn-xs">
                                                                            <i className="fa fa-edit"></i>
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            className="btn btn-danger btn-xs"
                                                                            onClick={() => {
                                                                                if (window.confirm('Are you sure you want to delete this FAQ?')) {
                                                                                    handleDeleteFAQ(item._id);
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
    );
}
