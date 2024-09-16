
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { deleteInvestor, fetchInvestor } from '../../../api/enquiry/investor';

const Investor = () => {
    const [data, setData] = useState([    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state
    const [currentPage, setCurrentPage] = useState(1); // Current page state


    useEffect(() => {
        const fetchData = async () => {
            await fetchInvestors();
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    
  // Filter data based on the search query
  const query = data.filter(item => {
    const broker_name = item.broker_name?.toLowerCase() || '';
    const email = item.email?.toLowerCase() || '';
    const phoneNumber = item.phoneNumber || '';
    const company_name = item.company_name?.toLowerCase() || '';
    const registration_no = item.registration_no?.toLowerCase() || '';
    const search = searchQuery.toLowerCase();

    return broker_name.includes(search) ||
           email.includes(search) ||
           
           company_name.includes(search) ||
           registration_no.includes(search);
});

    const fetchInvestors = async () => {
        try {
            setLoading(true);
            const result = await fetchInvestor();
            setData(result);
        } catch (error) {
            // setError('Error fetching data');
            // console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteInvestor(id);
            Swal.fire({
                icon: 'success',
                title:  'Success!',
                text:  'Data Deleted successfully.',
                confirmButtonText: 'OK',
                timer: 2000, 
                timerProgressBar: true, 
            });
            fetchInvestors();
        } catch (error) {
            // console.error('Error deleting query:', error);
        }
    };

    const downloadCSV = (data) => {
        const csvRows = [];
        // Adding headers
        csvRows.push(['No', 'Broker Name', 'Email', 'Mobile', 'Company Name', 'Registration No', 'Created at']);

        // Adding data rows
        data.forEach((row, index) => {
            csvRows.push([index + 1, row.broker_name, row.email, row.phoneNumber, row.company_name, row.registration_no, row.created_at]);
        });

        const csvString = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();

        URL.revokeObjectURL(url);
    };

    const downloadExcel = (data) => {
        const ws = XLSX.utils.json_to_sheet(data, { header: ['No', 'Broker Name', 'Email', 'Mobile', 'Company Name', 'Registration No', 'Created at'] });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'data.xlsx');
    };

    const downloadPDF = (data) => {
        const doc = new jsPDF();
        doc.text("PDF content here", 10, 10);
        data.forEach((item, index) => {
            doc.text(`${index + 1}: ${item.broker_name}, ${item.email}, ${item.phoneNumber}, ${item.company_name} ${item.registration_no}, ${item.created_at}`, 10, 20 + index * 10);
        });
        doc.save('data.pdf');
    };

    const totalPages = Math.ceil(query.length / itemsPerPage);

    const currentData = query.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Sidebar />
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title">
                                <h2>Investor</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row column1">
                        <div className="col-md-12">
                            <div className="white_shd full margin_bottom_30">
                                <div className="full price_table padding_infor_info">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="table-responsive-sm">
                                               
                                                <div id="pjdataTable_wrapper" className="dataTables_wrapper no-footer">
                                                    <div className="dt-buttons">
                                                      
                                                        <button 
                                                            className="dt-button buttons-excel buttons-html5" 
                                                            type="button" 
                                                            onClick={() => downloadExcel(data)}
                                                        >
                                                            <span>Excel</span>
                                                        </button>
                                                        <button 
                                                            className="dt-button buttons-csv buttons-html5" 
                                                            type="button" 
                                                            onClick={() => downloadCSV(data)}
                                                        >
                                                            <span>CSV</span>
                                                        </button>
                                                        <button 
                                                            className="dt-button buttons-pdf buttons-html5" 
                                                            type="button" 
                                                            onClick={() => downloadPDF(data)}
                                                        >
                                                            <span>PDF</span>
                                                        </button>
                                                    </div>
                                                    {loading ? (
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                                <span className="ml-2">Loading...</span>
                                                            </div>
                                                        ) : ''}
                                                    {error && <div className="alert alert-danger">{error}</div>}

                                                    <div id="pjdataTable_filter" className="dataTables_filter">
                                                        <label>
                                                            Search:
                                                            <input
                                                                type="search"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                placeholder=""
                                                                aria-controls="pjdataTable"
                                                            />
                                                        </label>
                                                    </div>
                                                    <table id="pjdataTable" className="table table-striped projects display dataTable no-footer" style={{ width: '100%' }}>
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Broker Name</th>
                                                                <th>Email</th>
                                                                <th>Mobile</th>
                                                                
                                                                <th>Company Name</th>
                                                                <th>Registration No</th>

                                                                <th>Created at</th>
                                                                {/* <th>Note</th> */}
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {query.map((item, index) => (
                                                                <tr key={item._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.broker_name}</td>
                                                                    <td>{item.email}</td>
                                                                    <td>{item.phoneNumber}</td>
                                                                    <th>{item.company_name}</th>
                                                                    

                                                                    <td>{item.registration_no}</td>
                                                                    <td>{item.created_at.slice(0, 10)}</td>
                                                                
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content">
                                                                            <li>
                                                                                <button className="btn btn-danger btn-xs" onClick={() => {
                                                                                    if (window.confirm('Are you sure you want to delete this DATA?')) {
                                                                                        handleDelete(item.id);
                                                                                    }
                                                                                }}>
                                                                                    <i className="fa fa-trash"></i>
                                                                                </button>
                                                                            </li>
                                                                         
                                                                        </ul>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <div className="dataTables_info" id="subct_info" role="status" aria-live="polite">
                                                    Showing {currentData.length} of {query.length} entries
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
};

export default Investor;
