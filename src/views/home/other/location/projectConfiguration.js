import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { Link, useParams } from 'react-router-dom';
import { deleteConfiguration, fetchProjectConfiguration, updateConfigurationStatus } from '../../../../api/location/configuration_api';

export default function ProjectConfiguration() {
    const [projectConfiguration, setProjectConfiguration] = useState([]);
    const {id } = useParams();

    useEffect(() => {
        loadProjectConfiguration(id);
    }, [id]);

    const loadProjectConfiguration = async (id) => {
        try {
            const data = await fetchProjectConfiguration(id);
            console.log(data)
            setProjectConfiguration(data);
        } catch (error) {
            console.error('Error loading Project Configuration:', error);
        }
    };

    const handleUpdateStatus = async (ids, status) => {
        try {
            const result = await updateConfigurationStatus(ids, status);
            if (result.success) {
                console.log('City status updated successfully!');
                loadProjectConfiguration(id);
            } else {
                console.error('Error updating city status:', result.message);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const handleDeleteCity = async (ids) => {
        try {
            await deleteConfiguration(ids);
            loadProjectConfiguration(id);
        } catch (error) {
            console.error('Error deleting city:', error);
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
                                            <Link to={`/${id}/addConfiguration/add`} className="btn btn-success btn-xs">Add Project Configuration</Link>
                                        </div>
                                        <div className="full price_table padding_infor_info">
                                        <div className="table-responsive">
                                            <table className="table table-striped projects dataTable no-configuration">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th>No</th>
                                                        <th>City</th>
                                                        <th>Project Configuration</th>                                                                                                            
                                                        
                                                        {/* <th>FAQs</th> */}
                                                        
                                                        <th>Content Type</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {projectConfiguration.map((data, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                            <td className="sorting_1">{index + 1}</td>
                                                            <td>{id}</td>
                                                            <td>{data.projectConfiguration}</td>
                                                           
{/*                                                            
                                                            <td>
                                                                <ul className="list-inline d-flex justify-content-center">
                                                                    <li><Link to={`/${id}/configurationFAQ/New`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i>New Projects</Link></li>
                                                                    <li><Link to={`/${id}/configurationFAQ/commercial`} className="btn btn-success btn-xs"><i className="fa fa-edit"></i>Commercial</Link></li>
                                                                    <li><Link to={`/${id}/configurationFAQ/flat`} className="btn btn-info btn-xs"><i className="fa fa-edit"></i>Flats</Link></li>
                                                                    <li><Link to={`/${id}/configurationFAQ/apartment`} className="btn btn-warning btn-xs"><i className="fa fa-edit"></i>Apartments</Link></li>
                                                                    <li><Link to={`/${id}/configurationFAQ/studio`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Studio Apartments</Link></li>
                                                                    <li><Link to={`/${id}/configurationFAQ/residential`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Residential</Link></li>
                                                                </ul>
                                                            </td> */}
                                                            <td>
                                                                <ul className="list-inline d-flex justify-content-center">
                                                                    <li><Link to={`/${id}/addConfiguration/New Projects`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i>New Projects</Link></li>
                                                                    <li><Link to={`/${id}/addConfiguration/Residential`} className="btn btn-success btn-xs"><i className="fa fa-edit"></i>Residential</Link></li>
                                                                    <li><Link to={`/${id}/addConfiguration/Flat`} className="btn btn-info btn-xs"><i className="fa fa-edit"></i>Flats</Link></li>
                                                                    <li><Link to={`/${id}/addConfiguration/Apartment`} className="btn btn-warning btn-xs"><i className="fa fa-edit"></i>Apartments</Link></li>
                                                                    <li><Link to={`/${id}/addConfiguration/studio`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Studio Apartments</Link></li>
                                                                </ul>
                                                            </td>
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
