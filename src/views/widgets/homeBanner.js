import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../home/sidebar';
import { deleteBanner, fetchBannerByID, updateBannerStatus } from '../../api/bannerImage/bannerImage';
import { imageURL } from '../../imageURL';
// import image from '../../../assets/images/logo.png';
// import { fetchHomeBanner, updateHomeBannerStatus, deleteHomeBanner, globals } from '../../api/bannerImage/bannerImage';
// import ImageModal from '../../widgets/imageModel';
import Swal from 'sweetalert2';

export default function HomeBanner() {
    const [homeBanner, setHomeBanner] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [modalAltText, setModalAltText] = useState('');

    const handleShow = (imageUrl, altText) => {
        // setModalImageUrl(imageUrl);
        // setModalAltText(altText);
        // setShowModal(true);
    };
    const handleClose = () => setShowModal(false);

    useEffect(() => {
        

        loadHomeBanner();
    }, []);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);
    
    const loadHomeBanner = async () => {
        try {
            setLoading(true);
            const homeBannerData = await fetchBannerByID();
            setHomeBanner(homeBannerData);
        } catch (err) {
            setError('Failed to load data');
            // console.log('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, currentStatus) => {
        try {
            const result = await updateBannerStatus(id, currentStatus);
            if (result.success) {
                setHomeBanner(prevHomeBanner => 
                    prevHomeBanner.map(homeBanner =>
                        homeBanner._id === id ? { ...homeBanner, status: currentStatus } : homeBanner
                    )
                );
            } else {
                // console.error('Error updating home banner status:', result.message);
            }
        } catch (error) {
            // console.error('Unexpected error:', error);
        }
    };

    const handleDeleteHomeBanner = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This action will permanently delete the home banner.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33', // Red for danger
                cancelButtonColor: '#3085d6', // Blue for cancel
                confirmButtonText: 'Yes, delete it!'
            });
    
            if (result.isConfirmed) {
                // Proceed with the deletion if confirmed
                const response = await deleteBanner(id);
                
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Home banner deleted successfully.',
                        confirmButtonText: 'OK',
                        timer: 2000,
                        timerProgressBar: true, 
                    });
                    loadHomeBanner(); // Refresh the banner list
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete the banner. Please try again.',
                        confirmButtonText: 'OK'
                    });
                }
            }
        } catch (error) {
            console.error('Error deleting home banner:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting the banner.',
                confirmButtonText: 'OK'
            });
        }
    };
    

    return (
        <>
        <div>
            <Sidebar/>
            <div>
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>Home Banner</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <Link to="/addHomeBanner" className="btn btn-success btn-xs mr-2">Add Home Banner</Link>
                                       
                                        
                                      
                                        </div>
                                    
                                    <div className="full price_table padding_infor_info">
                                    {loading && <div className="loading">Loading...</div>}
                                    {error && <div className="alert alert-danger">{error}</div>}
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="table-responsive-sm">
                                                    <table id="subct" className="table table-striped projects">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th>No</th>
                                                                
                                                                <th>Image Desktop</th>
                                                                <th>Image Tablet</th>
                                                                <th>Image Mobile</th>

                                                                {/* <th>Alt Tag</th> */}
                                                                <th>Current Status</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {homeBanner.map((banner, index) => (
                                                                <tr key={banner._id}>
                                                                    <td>{index + 1}</td>
                                                                   
                                                                    <td>
                                                                <img
                                                                    src={banner.desktop_image_url ? `${banner.desktop_image_url}` : '/url/to/default/image'}
                                                                    // className="rounded-circle"
                                                                    style={{ objectFit: 'cover' }}
                                                                    alt={banner.alt_tag}
                                                                    width="50"
                                                                    height="50"
                                                                    onClick={() => handleShow(`${banner.desktop_image_url}`, banner.alt_tag)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <img
                                                                    src={banner.tablet_image_url ? `${banner.tablet_image_url}` : '/url/to/default/image'}
                                                                    // className="rounded-circle"
                                                                    style={{ objectFit: 'cover' }}
                                                                    alt={banner.alt_tag}
                                                                    width="40"
                                                                    height="20"
                                                                    onClick={() => handleShow(`${banner.tablet_image_url}`, banner.alt_tag)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <img
                                                                    src={banner.mobile_image_url ? `${banner.mobile_image_url}` : '/url/to/default/image'}
                                                                    // className="rounded-circle"
                                                                    style={{ objectFit: 'cover' }}
                                                                    alt={banner.alt_tag}
                                                                    width="30"
                                                                    height="50"
                                                                    onClick={() => handleShow(`${banner.mobile_image_url}`, banner.alt_tag)}
                                                                />
                                                            </td>
                                                                    {/* <td>{banner.alt_tag_desktop}</td> */}
                                                                    <td>
                                                                        
                                                                          
                                                                                {banner.status === false ? (
                                                                                    <button className="btn btn-warning btn-xs" onClick={() => handleUpdateStatus(banner._id, true)}>Deactive</button>
                                                                                ) : (
                                                                                    <button className="btn btn-success btn-xs" onClick={() => handleUpdateStatus(banner._id, false)}>Active</button>
                                                                                )}
                                                                          
                                                                       
                                                                    </td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-center">
                                                                            {/* <li>
                                                                                <Link to={`/addHomeBanner/${banner.id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                            </li> */}
                                                                            <li>
                                                                                <button
                                                                                    className="btn btn-danger btn-xs"
                                                                                    onClick={() => {       handleDeleteHomeBanner(banner._id);
                                                                                    
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
        {/* <ImageModal 
         show={showModal} 
         handleClose={handleClose} 
         imageUrl={modalImageUrl} 
         altText={modalAltText} 
     /> */}
        </>
    );
}
