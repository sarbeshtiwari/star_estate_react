import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { Link } from 'react-router-dom';
import { fetchCities, updateCityStatus, deleteCity } from '../../../../api/location/location_api';

export default function Cities() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCities = async () => {
            
            try {
                const fetchData = async () => {
                    setLoading(true);
                    const data = await fetchCities();
                    setCities(data);
                    setLoading(false)
                };
                fetchData();
            } catch (error) {
                console.error('Error loading cities:', error);
            } 
        };

        loadCities();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const result = await updateCityStatus(id, status);
            if (result.success) {
                console.log('City status updated successfully!');
                // Re-fetch cities or update state accordingly
                const updatedCities = cities.map(city =>
                    city._id === id ? { ...city, status } : city
                );
                setCities(updatedCities);
            } else {
                console.error('Error updating city status:', result.message);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const handleDeleteCity = async (id) => {
        try {
            await deleteCity(id);
            setCities(cities.filter(city => city._id !== id));
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
                                        <h2>Cities</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row column1">
                                <div className="col-md-12">
                                    <div className="white_shd full margin_bottom_30">
                                        <div className="full graph_head">
                                            <Link to="/addLocation/city/add" className="btn btn-success btn-xs">Add Cities</Link>
                                        </div>
                                       
                                        <div className="full price_table padding_infor_info">
                                        
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
                                                                <th>State</th>
                                                                <th>Priority</th>
                                                                <th>Sub City</th>
                                                                <th>City By Keywords</th>
                                                                <th>FAQs</th>
                                                                <th>Footer FAQs</th>
                                                                <th>Content Type</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cities.map((city, index) => (
                                                                <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                    <td className="sorting_1">{index + 1}</td>
                                                                    <td>{city.location}</td>
                                                                    <td>{city.state}</td>
                                                                    <td>{city.priority}</td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-center">
                                                                            <li><Link to={`/subCities/${city.slugURL}`} className="btn btn-success btn-xs">Go</Link></li>
                                                                        </ul>
                                                                    </td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-center">
                                                                            <li><Link to={`/projects/${city.slugURL}`} className="btn btn-success btn-xs">Open</Link></li>
                                                                        </ul>
                                                                    </td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-center">
                                                                            <li><Link to={`/footerFAQ/${city.slugURL}/common`} className="btn btn-success btn-xs">Go</Link></li>
                                                                        </ul>
                                                                    </td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-center">
                                                                            <li><Link to={`/footerFAQ/${city.slugURL}/new-projects`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i>New Projects</Link></li>
                                                                            <li><Link to={`/footerFAQ/${city.slugURL}/commercial`} className="btn btn-success btn-xs"><i className="fa fa-edit"></i>Commercial</Link></li>
                                                                            <li><Link to={`/footerFAQ/${city.slugURL}/flats`} className="btn btn-info btn-xs"><i className="fa fa-edit"></i>Flats</Link></li>
                                                                            <li><Link to={`/footerFAQ/${city.slugURL}/apartments`} className="btn btn-warning btn-xs"><i className="fa fa-edit"></i>Apartments</Link></li>
                                                                            <li><Link to={`/footerFAQ/${city.slugURL}/studio`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Studio Apartments</Link></li>
                                                                            <li><Link to={`/footerFAQ/${city.slugURL}/residential`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Residential</Link></li>
                                                                        </ul>
                                                                    </td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-center">
                                                                            <li><Link to={`/addLocation/${city.slugURL}/new-projects`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i>New Projects</Link></li>
                                                                            <li><Link to={`/addLocation/${city.slugURL}/commercial`} className="btn btn-success btn-xs"><i className="fa fa-edit"></i>Commercial</Link></li>
                                                                            <li><Link to={`/addLocation/${city.slugURL}/residential`} className="btn btn-success btn-xs"><i className="fa fa-edit"></i>Residential</Link></li>
                                                                            <li><Link to={`/addLocation/${city.slugURL}/flats`} className="btn btn-info btn-xs"><i className="fa fa-edit"></i>Flats</Link></li>
                                                                            <li><Link to={`/addLocation/${city.slugURL}/apartments`} className="btn btn-warning btn-xs"><i className="fa fa-edit"></i>Apartments</Link></li>
                                                                            <li><Link to={`/addLocation/${city.slugURL}/studio`} className="btn btn-secondary btn-xs"><i className="fa fa-edit"></i>Studio Apartments</Link></li>
                                                                        </ul>
                                                                    </td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-end">
                                                                            <li>
                                                                                {city.status === false ? (
                                                                                    <button className="btn btn-warning btn-xs" onClick={() => handleUpdateStatus(city._id, true)}>Deactive</button>
                                                                                ) : (
                                                                                    <button className="btn btn-success btn-xs" onClick={() => handleUpdateStatus(city._id, false)}>Active</button>
                                                                                )}
                                                                            </li>
                                                                            <li>
                                                                                <Link to={`/addLocation/${city.slugURL}/common`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                            </li>
                                                                            <li>
                                                                                <button
                                                                                    className="btn btn-danger btn-xs"
                                                                                    onClick={() => {
                                                                                        if (window.confirm('Are you sure you want to delete this city?')) {
                                                                                            handleDeleteCity(city._id);
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
        </>
    );
}
