import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../sidebar';
import { fetchDevelopers, updateDeveloperStatus, deleteDeveloper } from '../../../../api/developer/developer_api';
import image from '../../../../assets/images/logo.png'; // Default image
import { imageURL } from '../../../../imageURL';
import Swal from 'sweetalert2';

export default function Developer() {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state
    const [currentPage, setCurrentPage] = useState(1); // Current page state

    useEffect(() => {
        const loadDevelopers = async () => {
            setLoading(true);
            try {
                const data = await fetchDevelopers();
                setDevelopers(data);
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        
        loadDevelopers();
    }, []);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    
    const filteredDeveloper = developers.filter(item =>
        (item.developerName || '').toLowerCase().includes(searchQuery.toLowerCase())        
    ); 

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await updateDeveloperStatus(id, status);
            if (response.success) {
                // console.log('Developer status updated successfully!');
                const data = await fetchDevelopers();
                setDevelopers(data);
            } else {
                // console.error('Error updating developer status:', response.message);
            }
        } catch (error) {
            // console.error('Unexpected error:', error.message);
        }
    };

    const handleDelete = async (id, image) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This action will permanently delete the developer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33', // Red for danger
                cancelButtonColor: '#3085d6', // Blue for cancel
                confirmButtonText: 'Yes, delete it!'
            });
    
            if (result.isConfirmed) {
                await deleteDeveloper(id, image);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Developer deleted successfully.',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true, 
                });
    
                const data = await fetchDevelopers();
                setDevelopers(data); // Refresh the developer list
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error deleting the developer.',
                confirmButtonText: 'OK'
            });
        }
    };

    const totalPages = Math.ceil(filteredDeveloper.length / itemsPerPage);

    const currentData = filteredDeveloper.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
                                    <h2>Developer</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <Link to="/addDeveloper/add" className="btn btn-success btn-xs">Add Developer</Link>
                                    </div>
                                    <div className="full price_table padding_infor_info">
                                       {loading ? (
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                                <span className="ml-2">Loading...</span>
                                                            </div>
                                                        ) : ''}
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
                                            <table id="subct" className="table table-striped projects dataTable no-footer" aria-describedby="subct_info">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th>No</th>
                                                        
                                                        <th>Developer Name</th>
                                                        
                                                        <th>Developer Priority</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentData.map((developer, index) => (
                                                        <tr key={developer._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                             <td className="sorting_1">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                            {/* <td>
                                                                <img 
                                                                   src={`${imageURL}/${developer.developerLogo}`}

                                                                    className="rounded-circle"
                                                                    style={{ objectFit: 'cover' }}
                                                                    alt={developer.developerName}
                                                                    width="50"
                                                                    height="50"
                                                                />
                                                            </td> */}
                                                            <td>{developer.developerName}</td>
                                                            {/* <td>{developer.establishYear}</td>
                                                            <td>{developer.no_of_projects}</td>
                                                            <td>{developer.ongoingProjects}</td> */}
                                                            <td>{developer.developerPriority}</td>
                                                            <td>
                                                                <ul className="list-inline d-flex justify-content-end">
                                                                    <li>
                                                                        {developer.status === false ? (
                                                                            <button className="btn btn-warning btn-xs" onClick={() => handleUpdateStatus(developer._id, true)}>Deactive</button>
                                                                        ) : (
                                                                            <button className="btn btn-success btn-xs" onClick={() => handleUpdateStatus(developer._id, false)}>Active</button>
                                                                        )}
                                                                    </li>
                                                                    <li>
                                                                        <Link to={`/addDeveloper/${developer._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            className="btn btn-danger btn-xs"
                                                                            onClick={() => handleDelete(developer._id, developer.developerLogo)}
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
                                        <div className="dataTables_info" id="subct_info" role="status" aria-live="polite">
                                                    Showing {currentData.length} of {filteredDeveloper.length} entries
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
                                    </div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
