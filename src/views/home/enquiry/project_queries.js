import Sidebar from "../sidebar";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ProjectQueries(){
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div>
            <Sidebar />
            <div>
                <div className="midde_cont">
                    <div className="container-fluid">
                        <div className="row column_title">
                            <div className="col-md-12">
                                <div className="page_title">
                                    <h2>Project Queries</h2>
                                </div>
                            </div>
                        </div>
                        
                        </div></div>
                </div></div>
    )

}