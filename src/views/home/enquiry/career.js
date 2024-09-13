
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar';
import Modal from './modal'; // Import the modal component
import { deleteCareer, fetchCareer, updateCareer } from '../../../api/enquiry/career';
import { imageURL } from '../../../imageURL';
import Swal from 'sweetalert2';



const Career = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null); // Track selected item ID
    const [noteText, setNoteText] = useState(''); // Track the note text
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            await fetchUserQuery();
        };
        fetchData();
    }, []); // Empty dependency array to fetch data only once on component mount


    const fetchUserQuery = async () => {
        try {
            setLoading(true);
            const result = await fetchCareer();
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
            await deleteCareer(id);
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
                await updateCareer(selectedItemId, text); // Pass the selectedItemId to saveQuery
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

    return (
        <>
            <Sidebar />
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title">
                                <h2>Careers Query</h2>
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
                                                   
                                                {loading ? (
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                                <span className="ml-2">Loading...</span>
                                                            </div>
                                                        ) : ''}
                                                    {error && <div className="alert alert-danger">{error}</div>}

                                                   
                                                    <table id="pjdataTable" className="table table-striped projects display dataTable no-footer" style={{ width: '100%' }}>
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Mobile</th>
                                                                
                                                                <th>Category</th>
                                                                <th>Location</th>
                                                                <th>Job Type</th>
                                                                <th>Resume</th>

                                                                <th>Created at</th>
                                                                {/* <th>Note</th> */}
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.map((item, index) => (
                                                                <tr key={item.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.Name}</td>
                                                                    <td>{item.Email}</td>
                                                                    <td>{item.phoneNumber}</td>
                                                                    <th>{item.category}</th>
                                                                    <th>{item.location}</th>
                                                                    <th>{item.job_type}</th>
                                                                    <th>
                                                                        {item.resume ? (
                                                                            <a href={`${imageURL}/${item.resume}`} target="_blank" rel="noopener noreferrer">
                                                                            Open
                                                                            </a>
                                                                        ) : (
                                                                            ''
                                                                        )}
                                                                        </th>


                                                                    
                                                                    <td>{item.created_at.slice(0,10)}</td>
                                                                    {/* <td>{item.note ? item.note.slice(0,20) : item.note}</td> */}
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

export default Career;
