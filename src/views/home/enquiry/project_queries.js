
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar';
import Modal from './modal'; // Import the modal component
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';
import { deleteProjectQuery, fetchProjectQuery, updateProjectQuery } from '../../../api/enquiry/project_quires';
import Swal from 'sweetalert2';

const ProjectQueries = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null); // Track selected item ID
    const [noteText, setNoteText] = useState(''); // Track the note text
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
    }, []); // Empty dependency array to fetch data only once on component mount

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    
  // Filter data based on the search query
  const query = data.filter(item => {
    const Name = item.Name?.toLowerCase() || '';
    const Email = item.Email?.toLowerCase() || '';
    const phoneNumber = item.phoneNumber || '';
    const projectName = item.projectName?.toLowerCase() || '';
    const user_query = item.user_query?.toLowerCase() || '';
    const search = searchQuery.toLowerCase();

    return Name.includes(search) ||
           Email.includes(search) ||
           
           projectName.includes(search) ||
           user_query.includes(search);
});

    const fetchUserQuery = async () => {
        try {
            setLoading(true);
            const result = await fetchProjectQuery();
            setData(result);
        } catch (error) {
            setError('Error fetching data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProjectQuery(id);
            Swal.fire({
                icon: 'success',
                title:  'Success!',
                text:  'Data Deleted successfully.',
                confirmButtonText: 'OK',
                timer: 2000, 
                timerProgressBar: true, 
            });
            fetchUserQuery();
        } catch (error) {
            console.error('Error deleting query:', error);
        }
    };

    const handleOpenModal = (item) => {
        setSelectedItemId(item.id); // Set selected item ID
        setNoteText(item.note || ''); // Prefill note text or set empty string
        setModalOpen(true);
    };

    const handleModalSubmit = async (text) => {
        if (selectedItemId !== null) {
            try {
                console.log('Submitted text:', text);
                await updateProjectQuery(selectedItemId, text); // Pass the selectedItemId to saveQuery
                fetchUserQuery(); // Refresh the data after saving
                setModalOpen(false); // Close the modal
                setSelectedItemId(null); // Reset selected item ID
                setNoteText(''); // Reset note text
            } catch (error) {
                console.error('Error saving query:', error);
            }
        } else {
            console.error('No item selected for saving.');
        }
    };

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
        csvRows.push(['No', 'Name', 'Email', 'Mobile', 'Project Name', 'Created at']); // Replace with actual headers

        // Adding data rows
        data.forEach((row, index) => {
            csvRows.push([index + 1, row.Name, row.Email, row.phoneNumber, row.projectName, row.created_at]);
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
        const ws = XLSX.utils.json_to_sheet(data, { header: ['No', 'Name', 'Email', 'Mobile', 'Project Name', 'Created at'] });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'data.xlsx');
    };

    const downloadPDF = (data) => {
        const doc = new jsPDF();
        doc.text("PDF content here", 10, 10); // Customize as needed
        data.forEach((item, index) => {
            doc.text(`${index + 1}: ${item.Name}, ${item.Email}, ${item.phoneNumber}, ${item.projectName}, ${item.created_at}`, 10, 20 + index * 10);
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
                                <h2>Project Queries</h2>
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
                                                            <td>Created at:</td>
                                                            <td><input type="date" id="min" name="min" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td>End date:</td>
                                                            <td><input type="date" id="max" name="max" /></td>
                                                        </tr>
                                                    </tbody>
                                                </table> */}
                                                <div id="pjdataTable_wrapper" className="dataTables_wrapper no-footer">
                                                    <div className="dt-buttons">
                                                        {/* <button 
                                                            className="dt-button buttons-copy buttons-html5" 
                                                            type="button" 
                                                            onClick={handleCopy}
                                                        >
                                                            <span>Copy</span>
                                                        </button> */}
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
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Mobile</th>
                                                                <th>Project Name</th>
                                                                {/* <th>Query</th> */}

                                                                <th>Created at</th>
                                                                {/* <th>Note</th> */}
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {query.map((item, index) => (
                                                                <tr key={item._id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.Name}</td>
                                                                    <td>{item.Email}</td>
                                                                    <td>{item.phoneNumber}</td>
                                                                    <th>{item.projectName}</th>

                                                                    {/* <td>{item.user_query}</td> */}
                                                                    <td>{item.created_at.slice(0,10)}</td>
                                                                    {/* <td>{item.note ? item.note.slice(0,20) : item.note}</td> */}
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content">
                                                                            <li>
                                                                                <button className="btn btn-danger btn-xs" onClick={() => {
                                                                                    if (window.confirm('Are you sure you want to delete this DATA?')) {
                                                                                        handleDelete(item._id);
                                                                                    }
                                                                                }}>
                                                                                    <i className="fa fa-trash"></i>
                                                                                </button>
                                                                            </li>
                                                                            {/* <li>
                                                                                <button 
                                                                                    className="btn btn-primary btn-xs" 
                                                                                    onClick={() => handleOpenModal(item)} // Pass item to handleOpenModal
                                                                                >
                                                                                    <i className="fa fa-plus"></i> 
                                                                                    {item.note === null ? 'Add Note' : 'Update Note'}
                                                                                </button>
                                                                            </li> */}
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedItemId(null); // Reset selected item ID on modal close
                    setNoteText(''); // Reset note text on modal close
                }}
                onSubmit={handleModalSubmit}
                text={noteText} // Pass the note text to the modal
            />
        </>
    );
};

export default ProjectQueries;
