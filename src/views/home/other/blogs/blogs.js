// src/components/Blogs/Blogs.js

import React, { useState, useEffect } from 'react';
import Sidebar from '../../sidebar';
import { Link } from 'react-router-dom';
import { fetchBlogs, updateBlogStatus, deleteBlog } from '../../../../api/blogs/blogs_api';
import image from '../../../../assets/images/logo.png';
import { imageURL } from '../../../../imageURL';
import Swal from 'sweetalert2';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const loadBlogs = async () => {
            setLoading(true);
            try {
                const blogData = await fetchBlogs();
                setBlogs(blogData);
            } catch (err) {
                // console.log('Failed to fetch data');
            }
            setLoading(false)
        };

        loadBlogs();
    }, []);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await updateBlogStatus(id, status);
            if (response.success) {
                // console.log('Blog status updated successfully!');
                setBlogs(prevBlogs => prevBlogs.map(blog => blog._id === id ? { ...blog, status } : blog));
            } else {
                // console.error('Error updating blog status:', response.message);
            }
        } catch (error) {
            // console.error('Unexpected error:', error);
        }
    };

    const handleDeleteBlog = async (id, image) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this action!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33', // Red for danger
                cancelButtonColor: '#3085d6', // Blue for cancel
                confirmButtonText: 'Yes, delete it!'
            });
    
            if (result.isConfirmed) {
                await deleteBlog(id, image);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Blog deleted successfully.',
                    confirmButtonText: 'OK',
                    timer: 2000, 
                    timerProgressBar: true, 
                });
    
                setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== id));
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error deleting the blog.',
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
                                                            {blogs.map((blog, index) => (
                                                                <tr key={blog._id}>
                                                                    <td>{index + 1}</td>
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
                                                                                    onClick={() => {
                                                                                        
                                                                                            handleDeleteBlog(blog._id, blog.blogsImage);
                                                                                    
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
