import React, { useState, useEffect } from 'react';
import Sidebar from '../../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchSubCities, updateSubCityStatus, deleteSubCity } from '../../../../../api/location/sub_city/sub_city_api';
import Swal from 'sweetalert2';

export default function SubCities() {
    const [subCities, setSubCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    
    const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    

    useEffect(() => {
        const getSubCities = async () => {
            setLoading(true);
            try {
                const data = await fetchSubCities(id);
                if (data.length === 0) {
                    alert("No data Found");
                }
                setSubCities(data);
            } catch (error) {
                // console.error('Error fetching subCities:', error);
            }
            setLoading(false);
        };

        getSubCities();
    }, [id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const handleUpdateStatus = async (subCityId, status) => {
        try {
            const result = await updateSubCityStatus(subCityId, status);
            if (result.success) {
                // console.log('City status updated successfully!');
                setSubCities(prev => prev.map(subCity =>
                    subCity._id === subCityId ? { ...subCity, status } : subCity
                ));
            } else {
                // console.error('Error updating city status:', result.message);
            }
        } catch (error) {
            // console.error('Unexpected error:', error);
        }
    };

    const handleDelete = async (subCityId) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action will permanently delete the category.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', // Red for confirm
            cancelButtonColor: '#3085d6', // Blue for cancel
            confirmButtonText: 'Yes, delete it!'
        });
    
        if (result.isConfirmed) {
            try {
                await deleteSubCity(subCityId);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Category deleted successfully.',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true,
                    willClose: () => {
                        // Update state after the success message
                        setSubCities(prev => prev.filter(subCity => subCity._id !== subCityId));
                    }
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Error deleting the category.',
                    confirmButtonText: 'OK'
                });
                // Optional: console.error('Error deleting category:', error);
            }
        }
    };
    

    const filteredSubcity = subCities.filter(item =>
        (item.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sub_city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.priority || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total pages based on filtered data
    const totalPages = Math.ceil(filteredSubcity.length / itemsPerPage);

    // Get data for the current page
    const currentData = filteredSubcity.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div>
                <Sidebar />
                <div>
                    <div className="midde_cont">
                        <div className="container-fluid">
                            <div className="row column_title">
                                <div className="col-md-12">
                                    <div className="page_title">
                                        <h2>Sub Cities</h2>
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
                                            <Link to={`/addSubCities/city/add`} className="btn btn-success btn-xs">Add Sub Cities</Link>
                                        </div>
                                        <div className="full price_table padding_infor_info">
                                        <div id="subct_wrapper" className="dataTables_wrapper no-footer">
                                            <div className="dataTables_length" id="subct_length">
                                                <label>
                                                    Show
                                                    <select 
                                                        name="subct_length" 
                                                        aria-controls="subct" 
                                                        className="" 
                                                        value={itemsPerPage}
                                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                                    >
                                                        <option value="10">10</option>
                                                        <option value="25">25</option>
                                                        <option value="50">50</option>
                                                        <option value="100">100</option>
                                                    </select> entries
                                                </label>
                                            </div>
                                            <div id="pjdataTable_filter" className="dataTables_filter">
                                                <label>Search:
                                                    <input
                                                        type="search"
                                                        className=""
                                                        placeholder=""
                                                        aria-controls="pjdataTable"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </label>
                                            </div>
                                            <div className="table-responsive">
                                                {loading ? (
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                        <span className="ml-2">Loading...</span>
                                                    </div>
                                                ) : ''}
                                                <table className="table table-striped projects dataTable no-footer">
                                                    <thead className="thead-dark">
                                                        <tr>
                                                            <th>No</th>
                                                            <th>Cities</th>
                                                            <th>Sub City Name</th>
                                                            <th>Priority</th>
                                                            <th >FAQs</th>
                                                            <th>Content Type Update</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentData.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="7">No Data Found</td>
                                                            </tr>
                                                        ) : (
                                                            currentData.map((subCity, index) => (
                                                                <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                    <td className="sorting_1">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                                    <td>{subCity.city}</td>
                                                                    <td>{subCity.sub_city}</td>
                                                                    <td>{subCity.priority}</td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-center">
                                                                            <li><Link to={`/SubCityfooterFAQ/${subCity.slugURL}/new-projects`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i>New Projects</Link></li>
                                                                            <li><Link to={`/SubCityfooterFAQ/${subCity.slugURL}/residential`} className="btn btn-success btn-xs"><i className="fa fa-edit"></i>Residential</Link></li>
                                                                            <li><Link to={`/SubCityfooterFAQ/${subCity.slugURL}/flats`} className="btn btn-info btn-xs"><i className="fa fa-edit"></i>Flats</Link></li>
                                                                            <li><Link to={`/SubCityfooterFAQ/${subCity.slugURL}/apartments`} className="btn btn-warning btn-xs"><i className="fa fa-edit"></i>Apartments</Link></li>
                                                                            <li><Link to={`/SubCityfooterFAQ/${subCity.slugURL}/studio`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Studio Apartments</Link></li>
                                                                            <li><Link to={`/SubCityfooterFAQ/${subCity.slugURL}/residential`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Residential</Link></li>
                                                                        </ul>
                                                                    </td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-center">
                                                                            <li><Link to={`/addSubCities/${subCity.slugURL}/new-projects`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i>New Projects</Link></li>
                                                                            <li><Link to={`/addSubCities/${subCity.slugURL}/residential`} className="btn btn-success btn-xs"><i className="fa fa-edit"></i>Residential</Link></li>
                                                                            <li><Link to={`/addSubCities/${subCity.slugURL}/commercial`} className="btn btn-success btn-xs"><i className="fa fa-edit"></i>Commercial</Link></li>
                                                                            <li><Link to={`/addSubCities/${subCity.slugURL}/flats`} className="btn btn-info btn-xs"><i className="fa fa-edit"></i>Flats</Link></li>
                                                                            <li><Link to={`/addSubCities/${subCity.slugURL}/apartments`} className="btn btn-warning btn-xs"><i className="fa fa-edit"></i>Apartments</Link></li>
                                                                            <li><Link to={`/addSubCities/${subCity.slugURL}/studio`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Studio Apartments</Link></li>
                                                                        </ul>
                                                                    </td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-end">
                                                                            <li>
                                                                                {subCity.status === false ? (
                                                                                    <button className="btn btn-warning btn-xs" onClick={() => handleUpdateStatus(subCity._id, true)}>Deactive</button>
                                                                                ) : (
                                                                                    <button className="btn btn-success btn-xs" onClick={() => handleUpdateStatus(subCity._id, false)}>Active</button>
                                                                                )}
                                                                            </li>
                                                                            <li>
                                                                                <Link to={`/addSubCities/${subCity.slugURL}/common`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                            </li>
                                                                            <li>
                                                                                <button
                                                                                    className="btn btn-danger btn-xs"
                                                                                    onClick={() => handleDelete(subCity._id)}
                                                                                >
                                                                                    <i className="fa fa-trash"></i>
                                                                                </button>
                                                                            </li>
                                                                        </ul>
                                                                    </td>
                                                                </tr>
                                                            )))
                                                        }
                                                    </tbody>
                                                </table>
                                                <div className="dataTables_info" id="subct_info" role="status" aria-live="polite">
                                                    Showing {currentData.length} of {filteredSubcity.length} entries
                                                </div>
                                                <div className="dataTables_paginate paging_simple_numbers" id="subct_paginate">
                                                    <button 
                                                        className="paginate_button previous" 
                                                        aria-controls="subct" 
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Previous
                                                    </button>
                                                    <span>
                                                        {[...Array(totalPages).keys()].map(page => (
                                                            <button 
                                                                key={page} 
                                                                className={`paginate_button ${page + 1 === currentPage ? 'current' : ''}`} 
                                                                aria-controls="subct" 
                                                                onClick={() => handlePageChange(page + 1)}
                                                            >
                                                                {page + 1}
                                                            </button>
                                                        ))}
                                                    </span>
                                                    <button 
                                                        className="paginate_button next" 
                                                        aria-controls="subct" 
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
