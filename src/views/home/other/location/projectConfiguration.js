import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { Link, useParams } from 'react-router-dom';
import { deleteConfiguration, fetchProjectConfiguration, updateConfigurationStatus } from '../../../../api/location/configuration_api';
import Swal from 'sweetalert2';

export default function ProjectConfiguration() {
    const [projectConfiguration, setProjectConfiguration] = useState([]);
    const [loading, setLoading] = useState(false);
    const [projectConfiguration1, setProjectConfiguration1] = useState([]);
    const {id } = useParams();

    useEffect(() => {
        loadProjectConfiguration(id);
    }, [id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const loadProjectConfiguration = async (id) => {
        setLoading(true);
        try {
            const data = await fetchProjectConfiguration(id);
            console.log(data)
            
        //     let commonConfigurations = [];

        // // Loop through the data array, and for each object, filter the 'data' property
        // data.forEach(item => {
        //     const filteredData = item.data.filter(config => config.projectType === 'common');
        //     // Add the filtered configurations to the commonConfigurations array
        //     commonConfigurations = [...commonConfigurations, ...filteredData];
        // });

        // // Log each common project configuration
        // commonConfigurations.forEach(config => {
        //     console.log('Project Configuration:', config.projectConfiguration);
        //     console.log('Meta Title:', config.metaTitle);
        //     console.log('Meta Keyword:', config.metaKeyword);
        //     console.log('Meta Description:', config.metaDescription);
        //     console.log('CT Content:', config.ctcontent);
        //     console.log('Schema:', config.schema);
        // });

        // Optionally, set this filtered data to state if needed
        setProjectConfiguration(data);
        // setProjectConfiguration1(commonConfigurations);
        } catch (error) {
            // console.error('Error loading Project Configuration:', error);
        }
        setLoading(false);
    };

    

    const handleUpdateStatus = async (ids, status) => {
        try {
            const result = await updateConfigurationStatus(ids, status);
            if (result.success) {
                // console.log('City status updated successfully!');
                loadProjectConfiguration(id);
            } else {
                // console.error('Error updating city status:', result.message);
            }
        } catch (error) {
            // console.error('Unexpected error:', error);
        }
    };

    const handleDeleteCity = async (ids) => {
        try {
            await deleteConfiguration(ids);
            Swal.fire({
                icon: 'success',
                title:  'Success!',
                text:  'Data Deleted successfully.',
                confirmButtonText: 'OK',
                timer: 2000, 
                timerProgressBar: true, 
            });
            loadProjectConfiguration(id);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error Deleting data.',
                confirmButtonText: 'OK'
            });
            // console.error('Error deleting city:', error);
        }
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
                                        <h2>Project Configuration</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row column1">
                                <div className="col-md-12">
                                    <div className="white_shd full margin_bottom_30">
                                        <div className="full graph_head">
                                            <Link to={`/${id}/addConfiguration/common`} className="btn btn-success btn-xs">Add Project Configuration</Link>
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
                                            <table className="table table-striped projects dataTable no-configuration">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th>No</th>
                                                        <th>City</th>
                                                        <th>Project Configuration</th>   
                                                        <th>Project Type</th>                                                                                                         
                                                        
                                                        <th>FAQs</th>
                                                        
                                                        {/* <th>Content Type</th> */}
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {projectConfiguration.map((data, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                            <td className="sorting_1">{index + 1}</td>
                                                            <td>{id}</td>
                                                            <td>{data.projectConfiguration}</td>
                                                            <td>{data.projectType}</td>
                                                           
                                                            <td>
                                                                <ul className="list-inline d-flex justify-content-center">
                                                                    <li><Link to={`/${id}/configurationFAQ/${data.slugURL}/new-project`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i>New Projects</Link></li>
                                                                    <li><Link to={`/${id}/configurationFAQ/${data.slugURL}/commercial`} className="btn btn-success btn-xs"><i className="fa fa-edit"></i>Commercial</Link></li>
                                                                    <li><Link to={`/${id}/configurationFAQ/${data.slugURL}/flats`} className="btn btn-info btn-xs"><i className="fa fa-edit"></i>Flats</Link></li>
                                                                    <li><Link to={`/${id}/configurationFAQ/${data.slugURL}/apartments`} className="btn btn-warning btn-xs"><i className="fa fa-edit"></i>Apartments</Link></li>
                                                                    <li><Link to={`/${id}/configurationFAQ/${data.slugURL}/studio`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Studio Apartments</Link></li>
                                                                    <li><Link to={`/${id}/configurationFAQ/${data.slugURL}/residential`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Residential</Link></li>
                                                                </ul>
                                                            </td>
                                                            {/* <td>
                                                                <ul className="list-inline d-flex justify-content-center">
                                                                    <li><Link to={`/${id}/addConfiguration/projects`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i>Projects</Link></li>
                                                                    <li><Link to={`/${id}/addConfiguration/property`} className="btn btn-success btn-xs"><i className="fa fa-edit"></i>Residential</Link></li>
                                                                    <li><Link to={`/${id}/addConfiguration/flat`} className="btn btn-info btn-xs"><i className="fa fa-edit"></i>Flats</Link></li>
                                                                    <li><Link to={`/${id}/addConfiguration/apartment`} className="btn btn-warning btn-xs"><i className="fa fa-edit"></i>Apartments</Link></li>
                                                                   
                                                                </ul>
                                                            </td> */}
                                                            <td>
                                                                <ul className="list-inline d-flex justify-content-end">
                                                                    <li>
                                                                        {data.status === false ? (
                                                                            <button className="btn btn-warning btn-xs" onClick={() => handleUpdateStatus(data._id, true)}>Deactive</button>
                                                                        ) : (
                                                                            <button className="btn btn-success btn-xs" onClick={() => handleUpdateStatus(data._id, false)}>Active</button>
                                                                        )}
                                                                    </li>
                                                                    <li>
                                                                        <Link to={`/${id}/addConfiguration/${data._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            className="btn btn-danger btn-xs"
                                                                            onClick={() => {
                                                                                if (window.confirm('Are you sure you want to delete this city?')) {
                                                                                    handleDeleteCity(data._id);
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
