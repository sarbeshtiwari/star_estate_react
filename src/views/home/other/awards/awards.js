import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../sidebar';
import { imageURL } from '../../../../imageURL';
import { deleteAward, fetchAwards, updateAwardStatus } from '../../../../api/awards/awards_api';

export default function Awards() {

    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            try {
                const data = await fetchAwards();
                setEvent(data);
            } catch (err) {
                setError(err.message);
            } 
            setLoading(false);
        };

        loadEvents();
    }, []);

    const handleStatusUpdate = async (id, currentStatus) => {
        try {
            await updateAwardStatus(id, !currentStatus);
            setEvent(prevEvents => 
                prevEvents.map(evt => evt._id === id ? { ...evt, status: !currentStatus } : evt)
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this Event?')) {
            try {
                await deleteAward(id);
                setEvent(prevEvents => prevEvents.filter(evt => evt._id !== id));
            } catch (error) {
                setError(error.message);
            }
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
                                    <h2>Awards</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <Link to="/addAwards" className="btn btn-success btn-xs">Add Awards</Link>
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
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="table-responsive-sm">
                                                    <table id="pjdataTable" className="table table-striped projects dataTable no-footer">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Awards Image</th>
                                                                <th>Awards Name</th>
                                                               
                                                                <th>Awards Date</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {event.map((evt, index) => (
                                                                <tr key={evt._id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                            <img 
                                                                            src={`${imageURL}/${evt.awardImage}`}

                                                                                className="rounded-circle"
                                                                                style={{ objectFit: 'cover' }}
                                                                                alt={evt.eventName}
                                                                                width="50"
                                                                                height="50"
                                                                            />
                                                                        </td>
                                                                    <td>{evt.awardName}</td>
                                                                    
                                                                   
                                                                    <td>{evt.awardDate}</td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-end">
                                                                            <li>
                                                                                <button
                                                                                    className={`btn btn-xs ${evt.status ? 'btn-success' : 'btn-warning'}`}
                                                                                    onClick={() => handleStatusUpdate(evt._id, evt.status)}
                                                                                >
                                                                                    {evt.status ? 'Active' : 'Deactive'}
                                                                                </button>
                                                                            </li>
                                                                            {/* <li>
                                                                                <Link to={`/addAwards/${evt._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                            </li> */}
                                                                            <li>
                                                                                <button
                                                                                    className="btn btn-danger btn-xs"
                                                                                    onClick={() => handleDeleteEvent(evt._id)}
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
    );
}
