import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../sidebar';
import { Link } from 'react-router-dom';

import image from '../../../../assets/images/logo.png'
import { deleteBankList, getBankList, updateBankListStatus } from '../../../../api/bank_list/bank_list_api';
import { imageURL } from '../../../../imageURL';
import Swal from 'sweetalert2';

export default function ApprovedBanks(){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    },[])

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try { 
            const response = await getBankList();
            setData(response);
         }
         catch (error) {
            console.error(error);
         }
         setLoading(false)
    }

    const handleupdateStatus = async (id, status) => {
        try {
            await updateBankListStatus(id, status);
            
                const data = await getBankList();
                setData(data);
           
        } catch (error) {
            // console.error('Unexpected error:', error.message);
        }
    };

    const handleDelete = async (id, image) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This action will permanently delete the data and associated image.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33', // Red for danger
                cancelButtonColor: '#3085d6', // Blue for cancel
                confirmButtonText: 'Yes, delete it!'
            });
    
            if (result.isConfirmed) {
                await deleteBankList(id, image);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Data deleted successfully.',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true, 
                });
                const data = await getBankList();
                setData(data); // Refresh the data list after deletion
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error deleting the data.',
                confirmButtonText: 'OK'
            });
        }
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
                                    <h2>Approved Banks</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                <div className="full graph_head">
                        <Link to="/addApprovedBanks/add" className="btn btn-success btn-xs">Add</Link>
                      
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
                                                    <table id="subct" className="table table-striped projects">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Image</th>
                                                                <th>Title</th>
                                                                
                                                                <th>Alt</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.map((data, index) => (
                                                                <tr key={data._id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                            <img 
                                                                            src={`${imageURL}/${data.image}`}

                                                                                className="rounded-circle"
                                                                                style={{ objectFit: 'cover' }}
                                                                                alt={data.title}
                                                                                width="50"
                                                                                height="50"
                                                                            />
                                                                        </td>
                                                                    <td>{data.title}</td>
                                                                    
                                                                    <td>{data.alt_tag}</td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-end">
                                                                            <li>
                                                                                {data.status === false ? (
                                                                                     <button className="btn btn-warning btn-xs" onClick={() => handleupdateStatus(data._id, true)}>Deactive</button>
                                                                                   
                                                                                ) : (
                                                                                    <button className="btn btn-success btn-xs" onClick={() => handleupdateStatus(data._id, false)}>Active</button>
                                                                                )}
                                                                            </li>
                                                                           
                                                                            <li>
                                                                                <Link to={`/addApprovedBanks/${data._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                            </li>
                                                                            <li>
                                                                                <button
                                                                                    className="btn btn-danger btn-xs"
                                                                                    onClick={() => {
                                                                                       
                                                                                            handleDelete(data._id, data.image);
                                                                                        
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
    );
}