import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchFAQs, updateFAQStatus, deleteFAQ } from '../../../../../../api/location/sub_city/sub_city_faq_api';
import Swal from 'sweetalert2';

export default function SubCityFooterFAQ() {
    const [faq, setFAQ] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { sub_city, content_type } = useParams();

    useEffect(() => {
        if (sub_city && content_type) {
            const loadFAQs = async () => {
                setLoading(true);
                try {
                    const faqs = await fetchFAQs(sub_city, content_type);
                    setFAQ(faqs);
                } catch (error) {
                    // console.error('Error loading FAQs:', error);
                }
                setLoading(false)
            };

            loadFAQs();
        }
    }, [sub_city, content_type]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateFAQStatus(id, status);
            const faqs = await fetchFAQs(sub_city, content_type);
            setFAQ(faqs);
        } catch (error) {
            // console.error('Error updating status:', error);
        }
    };

    const handleDeleteFAQ = async (id) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action will permanently delete the FAQ.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', // Red for delete
            cancelButtonColor: '#3085d6', // Blue for cancel
            confirmButtonText: 'Yes, delete it!'
        });
    
        if (result.isConfirmed) {
            try {
                await deleteFAQ(id);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'FAQ deleted successfully.',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true,
                    willClose: async () => {
                        // Fetch updated FAQs data after the success message
                        const faqs = await fetchFAQs(sub_city, content_type);
                        setFAQ(faqs);
                    }
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'There was an error deleting the FAQ.',
                    confirmButtonText: 'OK'
                });
                // Optional: console.error('Error deleting FAQ:', error);
            }
        }
    };
    

    return (
        <div >
            <Sidebar />
            <div>
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
                                        <Link to={`/SubCityaddFAQ/${sub_city}/add`} className="btn btn-success btn-xs">Add FAQs</Link>
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
                                                    {faq.map((faqItem, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                            <td className="sorting_1">{index + 1}</td>
                                                            <td>{faqItem.faqQuestion}</td>
                                                            <td>{faqItem.faqAnswer}</td>
                                                            <td>
                                                                <ul className="list-inline d-flex justify-content-end">
                                                                    <li>
                                                                        {faqItem.status === false ? (
                                                                            <button className="btn btn-warning btn-xs" onClick={() => handleUpdateStatus(faqItem._id, true)}>Deactive</button>
                                                                        ) : (
                                                                            <button className="btn btn-success btn-xs" onClick={() => handleUpdateStatus(faqItem._id, false)}>Active</button>
                                                                        )}
                                                                    </li>
                                                                    <li>
                                                                        <Link to={`/SubCityaddFAQ/${sub_city}/${faqItem._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            className="btn btn-danger btn-xs"
                                                                            onClick={() => {
                                                                              
                                                                                    handleDeleteFAQ(faqItem._id);
                                                                             
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
