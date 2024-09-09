import React, { useState, useEffect } from 'react';

import Sidebar from '../../sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProject, fetchProjects, updateProjectStatusCategory, updateSimilarPropStatus, updateStatus } from '../../../../api/dashboard/project_list/project_list_api';

import {imageURL} from '../../../../imageURL'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ProjectList() {
   
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    useEffect(() => {
        handlefetchProjects(id);
        console.log(imageURL)
    }, [id]);

  // Filter data based on the search query
  // Filter data based on the search query
const filteredProperty = projects.filter(item =>
    (item.projectName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.projectBy || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.projectConfiguration || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.projectType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.projectPrice || '').toLowerCase().includes(searchQuery.toLowerCase())
);



    

    const handlefetchProjects = async (id) => {
        setLoading(true);
        try {
            const data = await fetchProjects(id);
            // console.log(id)
            // const response = await axios.get(`http://localhost:3010/getProjectByType/${id}`);
            setProjects(data);
            
        } catch (err) {
            setError('Failed to fetch data');
           
        }
        setLoading(false);
    };

    const handleupdateStatus = async (projectID, status, slugURL) => {
        try {
            const response = await updateStatus(projectID, status, slugURL);
            if (response.data && response.data.success) {
                // Update the project status locally in the state
                setProjects(prevProjects =>
                    prevProjects.map(project =>
                        project._id === projectID ? { ...project, status } : project
                    )
                );
            } else {
                // Display the error message from the API
                setErrorMsg(response.data.message || 'Error updating project status.');
                setShowErrorModal(true); // Show the modal with the error message
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            // Show any unexpected error in the modal
            setErrorMsg(error.response?.data?.message || 'An unexpected error occurred.');
            setShowErrorModal(true);
        }
    };
    
    // Function to close the modal
    const handleCloseModal = () => setShowErrorModal(false);
    
    const handleupdateProjectStatusCategory = async (projectID, value) => {
        try {
            const response = await updateProjectStatusCategory(projectID, value); // Use await here
            if (response.data && response.data.success) {
                const data = await fetchProjects(id);
                setProjects(data);
            } else {
                console.error('Error updating Project Data:', response.data.message);
            }
        } catch (error) {
            console.log('Unexpected error:', error);
        }
    };

    const handleshowSimilarProp = async (projectID, status) => {
        try {
            const response = await updateSimilarPropStatus(projectID, status); // Use await here
            if (response.data && response.data.success) {
                const data = await fetchProjects(id);
                setProjects(data);
            } else {
                console.error('Error updating Project Data:', response.data.message);
            }
        } catch (error) {
            console.log('Unexpected error:', error);
        }
    };
    
    

    const handledeleteProject = async (projectID, image) => {
        try {
            await deleteProject(projectID ,image);
            // await axios.delete(`http://localhost:3010/deleteProject/${id}`, { data: { image } });
            // const data = await fetchProjects(id);
            //     setProjects(data);
            handlefetchProjects(id);
        } catch (error) {
            console.error('Error deleting Project:', error);
        }
    };


    return (
        <>  
       
            <div id="">
                <Sidebar/>
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>Projects</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <Link to="addProject/add" className="btn btn-success btn-xs">Add Projects</Link>
                                        <button 
                                    className="btn btn-primary btn-xs float-right"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </button>
                                    </div>
                                    <div id="subct_wrapper" className="dataTables_wrapper no-footer">
                                        <div className="dataTables_length" id="subct_length">
                                            <label>
                                                Show 
                                                <select name="subct_length" aria-controls="subct" className="">
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
                                        <div className="full price_table padding_infor_info">
                                        {loading ? (
                                            <div className="d-flex justify-content-center align-items-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                                <span className="ml-2">Loading...</span>
                                            </div>
                                        ) : ''} 
                                        <div className="table-responsive">
                                            <table id="subct" className="table table-striped projects dataTable no-footer" aria-describedby="subct_info">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Project Logo</th>
                                                        <th>Project Name</th>
                                                        <th>Project URI</th>
                                                        <th>Project By</th>
                                                        <th>Project Configuration</th>
                                                        {/* <th>Project Type</th> */}
                                                        <th>Project Address</th>
                                                        <th>Project Price</th>
                                                        <th>Project Details</th>
                                                        <th>Banner Image</th>
                                                        <th>Show Similar Properties</th>
                                                        {/* <th>Top Rated</th>
                                                        <th>Recent</th> */}
                                                        <th></th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredProperty.map((project, index) => (
                                                        <tr key={project._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                            <td className="sorting_1">{index + 1}</td>
                                                            <td>
                                                                <img 
                                                                   src={`${imageURL}/${project.project_logo}`}

                                                                    className="rounded-circle"
                                                                    style={{ objectFit: 'cover' }}
                                                                    alt={project.projectName}
                                                                    width="50"
                                                                    height="50"
                                                                />
                                                            </td>
                                                            <td>{project.projectName}</td>
                                                            <td>{project.slugURL}</td>
                                                            <td>{project.projectBy}</td>
                                                            <td>{project.projectConfiguration}</td>
                                                            {/* <td>{project.projectType}</td> */}
                                                            <td>{project.projectAddress}</td>
                                                            <td>{project.projectPrice}</td>
                                                            <td> 
                                                                <Link to= {`viewProject/${project.slugURL}`} className='btn btn-primary btn-xs'>View Project</Link>
                                                                
                                                                {/* <button className="btn btn-primary btn-xs" onClick={() => `viewProject/${project.projectName}`}>View Project</button> */}
                                                                </td>
                                                                <td><Link to= {`/projectBannerImage/${project.slugURL}`} className='btn btn-success btn-xs'>Banner Image</Link></td> 
                                                            {/* <td>{!project.project_status.includes('Featured') ? (
                                                                            <button className="btn btn-warning btn-xs" onClick={() => handleupdateProjectStatusCategory(project._id, 'Featured')}>Deactivate</button>
                                                                        ) : (
                                                                            <button className="btn btn-success btn-xs" onClick={() => handleupdateProjectStatusCategory(project._id, 'Featured')}>Active</button>
                                                                        )}</td>
                                                         
                                                            <td>{!project.project_status.includes('Recent') ? (
                                                                            <button className="btn btn-warning btn-xs" onClick={() => handleupdateProjectStatusCategory(project._id, 'Recent')}>Deactivate</button>
                                                                        ) : (
                                                                            <button className="btn btn-success btn-xs" onClick={() => handleupdateProjectStatusCategory(project._id, 'Recent')}>Active</button>
                                                                        )}</td> */}
                                                                        <td>{project.showSimilarProperties === false ? (
                                                                            <button className="btn btn-warning btn-xs" onClick={() => handleshowSimilarProp(project._id,  true)}>Deactive</button>
                                                                        ) : (
                                                                            <button className="btn btn-success btn-xs" onClick={() => handleshowSimilarProp(project._id, false)}>Active</button>
                                                                        )}</td>
                                                            <td>
                                                                <ul className="list-inline d-flex justify-content-end">
                                                                    <li>
                                                                        {project.status === false ? (
                                                                            <button className="btn btn-warning btn-xs" onClick={() => handleupdateStatus(project._id,  true, project.slugURL)}>Deactive</button>
                                                                        ) : (
                                                                            <button className="btn btn-success btn-xs" onClick={() => handleupdateStatus(project._id, false)}>Active</button>
                                                                        )}
                                                                    </li>
                                                                    <li>
                                                                        <Link to={`addProject/${project._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            className="btn btn-danger btn-xs"
                                                                            onClick={() => {
                                                                                if (window.confirm('Are you sure you want to delete this Project?')) {
                                                                                    handledeleteProject(project._id, project.projectLogo);
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
                                        </div> </div>
                                        <div className="dataTables_info" id="subct_info" role="status" aria-live="polite">
                                            Showing 1 to {projects.length} of {projects.length} entries
                                        </div>
                                        <div className="dataTables_paginate paging_simple_numbers" id="subct_paginate">
                                            <Link className="paginate_button previous disabled" aria-controls="subct" aria-disabled="true" data-dt-idx="previous" tabIndex="-1" id="subct_previous">Previous</Link>
                                            <span>
                                                {[...Array(Math.ceil(projects.length / 10)).keys()].map(page => (
                                                    <Link key={page} className="paginate_button current" aria-controls="subct" aria-current="page" data-dt-idx={page} tabIndex="0">{page + 1}</Link>
                                                ))}
                                            </span>
                                            <Link className="paginate_button next" aria-controls="subct" data-dt-idx="next" tabIndex="0" id="subct_next">Next</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                </div>
            </div>
            <Modal show={showErrorModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{errorMsg}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        
            </>
    );
}
