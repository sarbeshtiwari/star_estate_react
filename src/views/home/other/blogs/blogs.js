import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../sidebar';
import { Link } from 'react-router-dom';
import { fetchBlogs, updateBlogStatus, deleteBlog } from '../../../../api/blogs/blogs_api';
import { imageURL } from '../../../../imageURL';
import Swal from 'sweetalert2';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadBlogs = async () => {
            setLoading(true);
            try {
                const blogData = await fetchBlogs();
                setBlogs(blogData);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch blogs.',
                });
            }
            setLoading(false);
        };

        loadBlogs();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const filteredData = useMemo(() => 
        blogs.filter(item =>
            (item.blogsName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.blogsCategory || '').toLowerCase().includes(searchQuery.toLowerCase())
        ), [blogs, searchQuery]
    );

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await updateBlogStatus(id, status);
            if (response.success) {
                setBlogs(prevBlogs => prevBlogs.map(blog => blog._id === id ? { ...blog, status } : blog));
            } else {
                console.error('Error updating blog status:', response.message);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const handleDeleteBlog = async (id, image) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await deleteBlog(id, image);
                Swal.fire('Deleted!', 'Blog deleted successfully.', 'success');
                setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== id));
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Error deleting the blog.',
                });
            }
        }
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Sidebar />
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title">
                                <h2>Blogs</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row column1">
                        <div className="col-md-12">
                            <div className="white_shd full margin_bottom_30">
                                <div className="full graph_head">
                                    <Link to="/addBlogs/add" className="btn btn-success btn-xs">Add Blogs</Link>
                                </div>
                                <div className="full price_table padding_infor_info">
                                    {loading && (
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            <span className="ml-2">Loading...</span>
                                        </div>
                                    )}
                                    <div id="subct_wrapper" className="dataTables_wrapper no-footer">
                                        <div className="dataTables_length" id="subct_length">
                                            <label>
                                                Show
                                                <select
                                                    name="subct_length"
                                                    aria-controls="subct"
                                                    value={itemsPerPage}
                                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                                >
                                                    <option value="10">10</option>
                                                    <option value="25">25</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
                                                </select> entries
                                            </label>
                                        </div>
                                        <div id="pjdataTable_filter" className="dataTables_filter">
                                            <label>Search:
                                                <input
                                                    type="search"
                                                    className=""
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </label>
                                        </div>
                                        <div className="table-responsive">
                                            <table id="subct" className="table table-striped projects dataTable no-footer">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Blog Type</th>
                                                        <th>Blogs Image</th>
                                                        <th>Blogs Name</th>
                                                        <th>Blogs By</th>
                                                        <th>Blogs Desc</th>
                                                        <th>Blogs Date</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentData.map((blog, index) => (
                                                        <tr key={blog._id}>
                                                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                            <td>{blog.blogsCategory}</td>
                                                            <td>
                                                                <img 
                                                                    src={`${imageURL}/${blog.blogsImage}`}
                                                                    className="rounded-circle"
                                                                    style={{ objectFit: 'cover' }}
                                                                    alt={blog.imageTitle}
                                                                    width="50"
                                                                    height="50"
                                                                />
                                                            </td>
                                                            <td>{blog.blogsName.slice(0, 20)}</td>
                                                            <td>{blog.blogsBy}</td>
                                                            <td>{blog.content.slice(0, 20)}</td>
                                                            <td>{blog.blogsDate}</td>
                                                            <td>
                                                                <ul className="list-inline d-flex justify-content-end">
                                                                    <li>
                                                                        {blog.status === false ? (
                                                                            <button className="btn btn-warning btn-xs" onClick={() => handleUpdateStatus(blog._id, true)}>Deactive</button>
                                                                        ) : (
                                                                            <button className="btn btn-success btn-xs" onClick={() => handleUpdateStatus(blog._id, false)}>Active</button>
                                                                        )}
                                                                    </li>
                                                                    <li>
                                                                        <Link to={`/addBlogs/${blog._id}`} className="btn btn-primary btn-xs"><i className="fa fa-edit"></i></Link>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            className="btn btn-danger btn-xs"
                                                                            onClick={() => handleDeleteBlog(blog._id, blog.blogsImage)}
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
                                        <div className="dataTables_info" role="status" aria-live="polite">
                                            Showing {currentData.length} of {filteredData.length} entries
                                        </div>
                                        <div className="dataTables_paginate paging_simple_numbers">
                                            <button 
                                                className="paginate_button previous" 
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
                                                        onClick={() => handlePageChange(page + 1)}
                                                    >
                                                        {page + 1}
                                                    </button>
                                                ))}
                                            </span>
                                            <button 
                                                className="paginate_button next" 
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
    );
}
