import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { Link } from 'react-router-dom';
import { fetchNews, updateNewsStatus, deleteNews } from '../../../../api/news/news_api'; // Adjust the path as needed
import { imageURL } from '../../../../imageURL';
import Swal from 'sweetalert2';

export default function NewsPaper() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        fetchNewsData();
    }, []);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchNewsData = async () => {
        setLoading(true)
        try {
            const response = await fetchNews();
            setNews(response.data);
        } catch (err) {
            // console.error('Failed to fetch news:', err);
        }
        setLoading(false)
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await updateNewsStatus(id, status);
            if (response.data.success) {
                // console.log('News status updated successfully!');
                fetchNewsData();
            } else {
                // console.error('Error updating news status:', response.data.message);
            }
        } catch (error) {
            // console.error('Unexpected error:', error);
        }
    };

    const handleDeleteNews = async (id, image, image2) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This action will permanently delete the news article and its associated images.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33', // Red for danger
                cancelButtonColor: '#3085d6', // Blue for cancel
                confirmButtonText: 'Yes, delete it!'
            });
    
            if (result.isConfirmed) {
                await deleteNews(id, image, image2);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'News article and images deleted successfully.',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true, 
                });
    
                fetchNewsData(); // Refresh the news data
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'There was an issue deleting the news article.',
                confirmButtonText: 'OK'
            });
            // Optional: console.error('Error deleting news:', error);
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
                                    <h2>News Paper</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <Link to="/addNewsPaper/add" className="btn btn-success btn-xs">Add News Paper</Link>
                                       
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
                                                                <th>News Type</th>
                                                                <th>News Image</th>
                                                                <th>News Name</th>
                                                                <th>News By</th>
                                                                <th>News Date</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {news.map((newsItem, index) => (
                                                                <tr key={newsItem._id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>News Paper</td>
                                                                    <td>
                                                                            <img 
                                                                            src={`${imageURL}/${newsItem.newsThumb}`}

                                                                                className="rounded-circle"
                                                                                style={{ objectFit: 'cover' }}
                                                                                alt={newsItem.heading}
                                                                                width="50"
                                                                                height="50"
                                                                            />
                                                                        </td>
                                                                    <td>{newsItem.heading}</td>
                                                                    <td>{newsItem.paperName}</td>
                                                                    <td>{newsItem.newsDate}</td>
                                                                    <td>
                                                                        <ul className="list-inline d-flex justify-content-end">
                                                                            <li>
                                                                                {newsItem.status === false ? (
                                                                                    <button
                                                                                        className="btn btn-warning btn-xs"
                                                                                        onClick={() => handleUpdateStatus(newsItem._id, true)}
                                                                                    >
                                                                                        Deactive
                                                                                    </button>
                                                                                ) : (
                                                                                    <button
                                                                                        className="btn btn-success btn-xs"
                                                                                        onClick={() => handleUpdateStatus(newsItem._id, false)}
                                                                                    >
                                                                                        Active
                                                                                    </button>
                                                                                )}
                                                                            </li>
                                                                            <li>
                                                                                <Link to={`/addNewsPaper/${newsItem._id}`} className="btn btn-primary btn-xs">
                                                                                    <i className="fa fa-edit"></i>
                                                                                </Link>
                                                                            </li>
                                                                            <li>
                                                                                <button
                                                                                    className="btn btn-danger btn-xs"
                                                                                    onClick={() => {
                                                                                      
                                                                                            handleDeleteNews(newsItem._id, newsItem.newsImage, newsItem.newsThumb);
                                                                                     
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
