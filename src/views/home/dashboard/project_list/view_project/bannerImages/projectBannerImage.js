import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../../../sidebar';
import { deleteBanner, fetchBannerByID, updateBannerStatus } from '../../../../../../api/bannerImage/projectBannerImage';
import { imageURL } from '../../../../../../imageURL';
// import image from '../../../assets/images/logo.png';
// import { fetchHomeBanner, updateHomeBannerStatus, deleteHomeBanner, globals } from '../../api/bannerImage/bannerImage';
// import ImageModal from '../../widgets/imageModel';

export default function ProjectHomeBanner() {
    const [homeBanner, setHomeBanner] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [modalAltText, setModalAltText] = useState('');

    const {id} = useParams();

    const handleShow = (imageUrl, altText) => {
        // setModalImageUrl(imageUrl);
        // setModalAltText(altText);
        // setShowModal(true);
    };
    const handleClose = () => setShowModal(false);

    useEffect(() => {
        

        loadHomeBanner(id);
    }, [id]);
    
    const loadHomeBanner = async (id) => {
        try {
            setLoading(true);
            const homeBannerData = await fetchBannerByID(id);
            setHomeBanner(homeBannerData);
        } catch (err) {
            setError(`No data found for, ${id}`);
            console.log('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (imageID, currentStatus) => {
        try {
            const result = await updateBannerStatus(imageID, currentStatus);
            if (result.success) {
                setHomeBanner(prevHomeBanner => 
                    prevHomeBanner.map(homeBanner =>
                        homeBanner._id === imageID ? { ...homeBanner, status: currentStatus } : homeBanner
                    )
                );
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const handleDeleteHomeBanner = async (imageID) => {
        try {
            const result = await deleteBanner(imageID);
            if (result.success) {
                alert('Banner deleted successfully');
                loadHomeBanner(id);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error deleting home banner:', error);
            alert(`Error: ${error.message}`);
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
                                        <Link to={`/addBanner/${id}`} className="btn btn-success btn-xs mr-2">Add Home Banner</Link>
                                       
                                        
                                      
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
                                                                                    onClick={() => {
                                                                                        if (window.confirm('Are you sure you want to delete this home banner?')) {
                                                                                            handleDeleteHomeBanner(banner._id);
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
        {/* <ImageModal 
         show={showModal} 
         handleClose={handleClose} 
         imageUrl={modalImageUrl} 
         altText={modalAltText} 
     /> */}
        </>
    );
}
