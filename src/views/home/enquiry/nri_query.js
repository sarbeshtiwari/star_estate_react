import Sidebar from "../sidebar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { fetchNRIQuery } from "../../../api/enquiry/nri_query";

export default function NRIQuery(){
    const [NRIQuery, setNRIQuery] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state
    const [currentPage, setCurrentPage] = useState(1); // Current page state

    useEffect(() => {
        const fetchData = async () => {
            await fetchUserQuery();
        };
        fetchData();
    }, []);

    const fetchUserQuery = async () => {
        try {
            setLoading(true);
            const result = await fetchNRIQuery();
            setNRIQuery(result);
        } catch (error) {
            setError('Error fetching data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };    


  // Filter data based on the search query
  const filteredNRIQuery = NRIQuery.filter(item =>
    item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.Email.toLowerCase().includes(searchQuery.toLowerCase())
  );

    const handleCopy = () => {
        const textToCopy = "Some text to copy"; // Replace with actual content
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert("Text copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    };

    const downloadCSV = (data) => {
        const csvRows = [];
        // Adding headers
        csvRows.push(['No', 'Name', 'Email', 'Mobile', 'Query',  'Created at']); // Replace with actual headers

        // Adding data rows
        data.forEach((row, index) => {
            csvRows.push([index + 1, row.Name, row.Email, row.phoneNumber, row.user_query,  row.created_at]);
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
        const ws = XLSX.utils.json_to_sheet(data, { header: ['No', 'Name', 'Email', 'Mobile', 'Query', 'Created at'] });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'data.xlsx');
    };

    const downloadPDF = (data) => {
        const doc = new jsPDF();
        doc.text("PDF content here", 10, 10); // Customize as needed
        data.forEach((item, index) => {
            doc.text(`${index + 1}: ${item.Name}, ${item.Email}, ${item.phoneNumber}, ${item.user_query},  ${item.created_at}`, 10, 20 + index * 10);
        });
        doc.save('data.pdf');
    };

    const deleteNRIQuery = () => {}

    const totalPages = Math.ceil(filteredNRIQuery.length / itemsPerPage);

    const currentData = filteredNRIQuery.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    
    return (
    <>
    <div >
        <Sidebar />
        <div>
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title">
                                <h2>NRI Queries</h2>
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
                                                {/* <table border="0" cellSpacing="5" cellPadding="5">
                                                    <tbody>
                                                        <tr>
                                                            <td>Start date:</td>
                                                            <td><input type="text" id="min" name="min" autoComplete="off"/></td>
                                                        </tr>
                                                        <tr>
                                                            <td>End date:</td>
                                                            <td><input type="text" id="max" name="max" autoComplete="off"/></td>
                                                        </tr>
                                                    </tbody>
                                                </table> */}
                                                <div id="pjdataTable_wrapper" className="dataTables_wrapper no-footer">
                                                <div className="dt-buttons">
                                                       
                                                        <button 
                                                            className="dt-button buttons-excel buttons-html5" 
                                                            type="button" 
                                                            onClick={() => downloadExcel(NRIQuery)}
                                                        >
                                                            <span>Excel</span>
                                                        </button>
                                                        <button 
                                                            className="dt-button buttons-csv buttons-html5" 
                                                            type="button" 
                                                            onClick={() => downloadCSV(NRIQuery)}
                                                        >
                                                            <span>CSV</span>
                                                        </button>
                                                        <button 
                                                            className="dt-button buttons-pdf buttons-html5" 
                                                            type="button" 
                                                            onClick={() => downloadPDF(NRIQuery)}
                                                        >
                                                            <span>PDF</span>
                                                        </button>
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
                                                    {loading ? (
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                                <span className="ml-2">Loading...</span>
                                                            </div>
                                                        ) : ''}
                                                    <table id="pjdataTable" className="table table-striped projects display dataTable no-footer" style={{width: "100%"}} aria-describedby="pjdataTable_info">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th className="sorting sorting_asc" tabIndex="0" aria-controls="pjdataTable" rowSpan="1" colSpan="1" aria-sort="ascending" aria-label="No: activate to sort column descending" style={{width: "19px"}}>
                                                                    No

                                                                </th>
                                                                <th className="sorting" tabIndex="0" aria-controls="pjdataTable" rowSpan="1" colSpan="1" aria-label="Name: activate to sort column ascending" style={{width: "56px"}}>
                                                                    Name

                                                                </th>
                                                                <th className="sorting" tabIndex="0" aria-controls="pjdataTable" rowSpan="1" colSpan="1" aria-label="Email: activate to sort column ascending" style={{width: "56px"}}>
                                                                    Email
                                                                </th>
                                                                <th className="sorting" tabIndex="0" aria-controls="pjdataTable" rowSpan="1" colSpan="1" aria-label="Mobile: activate to sort column ascending" style={{width: "68px"}}>
                                                                    Mobile
                                                                </th>
                                                               
                                                                <th className="sorting" tabIndex="0" aria-controls="pjdataTable" rowSpan="1" colSpan="1" aria-label="Query: activate to sort column ascending" style={{width: "43px"}}>
                                                                    Query
                                                                </th>
                                                                <th width="16%" className="sorting" tabIndex="0" aria-controls="pjdataTable" rowSpan="1" colSpan="1" aria-label="Start date: activate to sort column ascending" style={{width: "69px"}}>
                                                                    Created At
                                                                </th>
                                                                {/* <th className="sorting" tabIndex="0" aria-controls="pjdataTable" rowSpan="1" colSpan="1" aria-label="Action: activate to sort column ascending" style={{width: "44px"}}>
                                                                    Action
                                                                </th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredNRIQuery.map((NRIQuery, index) => (
                                                                <tr key={NRIQuery._id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        {NRIQuery.Name}
                                                                    </td>
                                                                    <td>{NRIQuery.Email}</td>
                                                                    <td>{NRIQuery.phoneNumber}</td>
                                                                    
                                                                    <td>{NRIQuery.user_query}</td>
                                                                    <td>{NRIQuery.created_at.slice(0,10)}</td>
                                                                    {/* <td> */}
                                                                        {/* <ul className="list-inline d-flex justify-content-end"> */}
                                                                           
                                                                           
                                                                            
                                                                            {/* <li> */}
                                                                                {/* <button
                                                                                    className="btn btn-danger btn-xs"
                                                                                    onClick={() => {
                                                                                        if (window.confirm('Are you sure you want to delete this NRIQuery?')) {
                                                                                            deleteNRIQuery(NRIQuery._id);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <i className="fa fa-trash"></i>
                                                                                </button> */}
                                                                            {/* </li>
                                                                        </ul> */}
                                                                    {/* </td> */}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <div className="dataTables_info" id="subct_info" role="status" aria-live="polite">
                                                    Showing {currentData.length} of {filteredNRIQuery.length} entries
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
        </div>
    </div>
    </>
    )

    
}
