import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../../sidebar';
import { getProjectbanksRatings, addProjectBanksRatings } from '../../../../../../api/dashboard/project_list/view_project/project_banks_api';
import Swal from 'sweetalert2';

export default function AddBanksandRatings() {
    const [formData, setFormData] = useState({
        accountNumber: '',
        IFSCcode: '',
        CIFno: '',
        bankName: '',
        bankAddress: '',
        otherDetails: '',
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { id, ids } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDetailsHandler(id);
    }, [id]);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const fetchDetailsHandler = async (id) => {
        try {
            const ratings = await getProjectbanksRatings(id);
            setFormData(ratings.data); // Set the form data directly
        } catch (err) {
            console.error('Error fetching details:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.accountNumber) errors.accountNumber = 'Account Number is required';
        if (!formData.IFSCcode) errors.IFSCcode = 'IFSC Code is required';
        if (!formData.CIFno) errors.CIFno = 'CIF No is required';
        if (!formData.bankName) errors.bankName = 'Bank Name is required';       
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        setLoading(true);
        try {
            const response = await addProjectBanksRatings(formData, id);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title:  'Success!',
                    text:  'Data added successfully.',
                    confirmButtonText: 'OK'
                });
                navigate(-1);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
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
                                    <h2>Add Bank Details</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row column1">
                            <div className="col-md-12">
                                <div className="white_shd full margin_bottom_30">
                                    <div className="full graph_head">
                                        <button 
                                            className="btn btn-primary btn-xs float-right"
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </button>
                                    </div>
                                    <div className="full price_table padding_infor_info">
                                        <span className="status text-danger"></span>
                                        <form onSubmit={handleSubmit} id="submit" encType="multipart/form-data">
                                            <h2>Bank Details</h2>
                                            <div className="form-row">
                                                <div className="col-md-3 form-group">
                                                    <label className="label_field">Account Number</label>
                                                    <input
                                                        type="number"
                                                        name="accountNumber"
                                                        className={`form-control ${validationErrors.accountNumber ? 'is-invalid' : ''}`}
                                                        value={formData.accountNumber}
                                                        onChange={handleChange}
                                                    />
                                                    {validationErrors.accountNumber && (
                                                        <div className="invalid-feedback">{validationErrors.accountNumber}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-3 form-group">
                                                    <label className="label_field">IFSC Code</label>
                                                    <input
                                                        type="text"
                                                        name="IFSCcode"
                                                        className={`form-control ${validationErrors.IFSCcode ? 'is-invalid' : ''}`}
                                                        value={formData.IFSCcode}
                                                        onChange={handleChange}
                                                    />
                                                    {validationErrors.IFSCcode && (
                                                        <div className="invalid-feedback">{validationErrors.IFSCcode}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-3 form-group">
                                                    <label className="label_field">CIF No</label>
                                                    <input
                                                        type="text"
                                                        name="CIFno"
                                                        className={`form-control ${validationErrors.CIFno ? 'is-invalid' : ''}`}
                                                        value={formData.CIFno}
                                                        onChange={handleChange}
                                                    />
                                                    {validationErrors.CIFno && (
                                                        <div className="invalid-feedback">{validationErrors.CIFno}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-3 form-group">
                                                    <label className="label_field">Bank Name</label>
                                                    <input
                                                        type="text"
                                                        name="bankName"
                                                        className={`form-control ${validationErrors.bankName ? 'is-invalid' : ''}`}
                                                        value={formData.bankName}
                                                        onChange={handleChange}
                                                    />
                                                    {validationErrors.bankName && (
                                                        <div className="invalid-feedback">{validationErrors.bankName}</div>
                                                    )}
                                                </div>
                                                <div className="col-md-3 form-group">
                                                    <label className="label_field">Bank Address</label>
                                                    <input
                                                        type="text"
                                                        name="bankAddress"
                                                        className={`form-control`}
                                                        value={formData.bankAddress}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-3 form-group">
                                                    <label className="label_field">Other Details</label>
                                                    <textarea
                                                        type="text"
                                                        name="otherDetails"
                                                        className={`form-control`}
                                                        value={formData.otherDetails}
                                                        onChange={handleChange}
                                                    />
                                                    {validationErrors.otherDetails && (
                                                        <div className="invalid-feedback">{validationErrors.otherDetails}</div>
                                                    )}
                                                </div>
                                            </div>
                                            {ids === 'add' ? (
                                                <div className="form-group margin_0">
                                                    <button className="main_bt" type="submit" disabled={loading}>
                                                        {loading ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : (
                                                            'Submit'
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="form-group margin_0">
                                                    <button className="main_bt" type="submit" disabled={loading}>
                                                        {loading ? (
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        ) : (
                                                            'Update'
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </form>
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






















// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import Sidebar from '../../../../sidebar';
// import { getBankList } from '../../../../../../api/bank_list/bank_list_api';
// import { addProjectBanksRatings, getProjectBanks, getProjectbanksRatings, ProjectBanks } from '../../../../../../api/dashboard/project_list/view_project/project_banks_api';
// import _ from 'lodash';
// import { imageURL } from '../../../../../../imageURL';

// export default function AddBanksandRatings() {
//     const [details, setDetails] = useState([]);
//     const [selectedbankList, setSelectedBankList] = useState(new Set());
//     const { id, ids } = useParams();
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
     
//         lifestyle: '',
//         amenities: '',
//         layout: '',
//         connectivity: '',
//         value_for_money: '',
//     });
//     const [validationErrors, setValidationErrors] = useState({});
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchDetailsHandler(id);
        
//     }, [id, ids]);

//     const fetchDetailsHandler = async (id) => {
//         try {
//             // Fetch all banks
//             const data = await getBankList();
//             setDetails(data);

//             // Fetch project banks
//             const projectBanks = await getProjectBanks(id);

//             // Extract IDs with status true
//             const trueStatusIds = projectBanks.data
//                 .filter(item => item.status)
//                 .map(item => item.BanksId);
//             // Update selectedBanks based on the fetched Banks
//             setSelectedBankList(new Set(trueStatusIds));
//             const ratings = await getProjectbanksRatings(id);
//             console.log(ratings.data1[0])
//             setFormData(ratings.data1[0]);
//         } catch (err) {
//             console.error('Error fetching details:', err);
//         }
//     };

//     const handleChange = async (e) => {
//         const { name, value} = e.target;

//         // if (type === 'checkbox') {
//         //     setFormData(prevFormData => ({
//         //         ...prevFormData,
//         //         banks: checked
//         //             ? [...prevFormData.banks, value]
//         //             : prevFormData.banks.filter(bank => bank !== value)
//         //     }));
//         // } else {
//             setFormData({
//                 ...formData,
//                 [name]: value
//             });
//         // }
//     };


//     const handleCheckboxChange = (bankId) => {
//         setSelectedBankList((prevSelected) => {
//             const updatedSelected = new Set(prevSelected);
//             const newStatus = !updatedSelected.has(bankId);

//             if (newStatus) {
//                 updatedSelected.add(bankId);
//             } else {
//                 updatedSelected.delete(bankId);
//             }

//             // Call debounced function
//             debouncedStatus(bankId, newStatus, id);

//             return updatedSelected;
//         });
//     };

//     const debouncedStatus = _.debounce(async (bankId, status, id) => {
//         try {
//             const response = await ProjectBanks(bankId, status, id);
//             console.log(response);
//         } catch (error) {
//             console.error('Error updating status:', error);
//         }
//     }, 300); // Adjust debounce delay as needed

//     // Helper function to check if an bank is selected
//     const isChecked = (bankId) => selectedbankList.has(bankId);

//     const validateForm = () => {
//         const errors = {};
//         if (!formData.lifestyle) errors.lifestyle = 'Lifestyle is required';
//         if (!formData.amenities) errors.amenities = 'Amenities is required';
//         if (!formData.layout) errors.layout = 'Layout is required';
//         if (!formData.connectivity) errors.connectivity = 'Connectivity is required';
//         if (!formData.value_for_money) errors.value_for_money = 'Value for Money is required';
//         return errors;
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         const errors = validateForm();
//         if (Object.keys(errors).length > 0) {
//             setValidationErrors(errors);
//             return;
//         }
//         setLoading(true);
//         try {
            
//             const response = await addProjectBanksRatings(formData, id);
//             if (response.success) {
//                 navigate(-1);
//             }
//         }catch(error){
//             console.error(error)
//         }
//         setLoading(false);
//         // Add form submission logic here
//     };

//     return (
//         <div>
//             <Sidebar />
//             <div>
//                 <div className="midde_cont">
//                     <div className="container-fluid">
//                         <div className="row column_title">
//                             <div className="col-md-12">
//                                 <div className="page_title">
//                                     <h2>Add Banks & Ratings</h2>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="row column1">
//                             <div className="col-md-12">
//                                 <div className="white_shd full margin_bottom_30">
//                                     <div className="full graph_head">
//                                         <button 
//                                             className="btn btn-primary btn-xs float-right"
//                                             onClick={() => navigate(-1)}
//                                         >
//                                             Back
//                                         </button>
//                                     </div>
//                                     <div className="full price_table padding_infor_info">
//                                         <span className="status text-danger"></span>
//                                         <form onSubmit={handleSubmit} id="submit" encType="multipart/form-data">
//                                             <h2>Rating</h2>
//                                             <div className="form-row">
//                                                 <div className="col-md-3 form-group">
//                                                     <label className="label_field">Lifestyle</label>
//                                                     <input
//                                                         type="number"
//                                                         name="lifestyle"
//                                                         placeholder="eg: 80"
//                                                         className={`form-control ${validationErrors.lifestyle ? 'is-invalid' : ''}`}
//                                                         value={formData.lifestyle}
//                                                         onChange={handleChange}
//                                                     />
//                                                     {validationErrors.lifestyle && (
//                                                             <div className="invalid-feedback">{validationErrors.lifestyle}</div>
//                                                         )}
//                                                 </div>
//                                                 <div className="col-md-3 form-group">
//                                                     <label className="label_field">Amenities</label>
//                                                     <input
//                                                         type="number"
//                                                         name="amenities"
//                                                         placeholder="eg: 80"
//                                                         className={`form-control ${validationErrors.amenities ? 'is-invalid' : ''}`}
//                                                         value={formData.amenities}
//                                                         onChange={handleChange}
//                                                     />
//                                                     {validationErrors.amenities && (
//                                                             <div className="invalid-feedback">{validationErrors.amenities}</div>
//                                                         )}
//                                                 </div>
//                                                 <div className="col-md-3 form-group">
//                                                     <label className="label_field">Layout</label>
//                                                     <input
//                                                         type="number"
//                                                         name="layout"
//                                                         placeholder="eg: 80"
//                                                         className={`form-control ${validationErrors.layout ? 'is-invalid' : ''}`}
//                                                         value={formData.layout}
//                                                         onChange={handleChange}
//                                                     />
//                                                     {validationErrors.layout && (
//                                                             <div className="invalid-feedback">{validationErrors.layout}</div>
//                                                         )}
//                                                 </div>
//                                                 <div className="col-md-3 form-group">
//                                                     <label className="label_field">Connectivity</label>
//                                                     <input
//                                                         type="number"
//                                                         name="connectivity"
//                                                         placeholder="eg: 80"
//                                                         className={`form-control ${validationErrors.connectivity ? 'is-invalid' : ''}`}
//                                                         value={formData.connectivity}
//                                                         onChange={handleChange}
//                                                     />
//                                                     {validationErrors.connectivity && (
//                                                             <div className="invalid-feedback">{validationErrors.connectivity}</div>
//                                                         )}
//                                                 </div>
//                                                 <div className="col-md-3 form-group">
//                                                     <label className="label_field">Value for Money</label>
//                                                     <input
//                                                         type="number"
//                                                         name="value_for_money"
//                                                         placeholder="eg: 80"
//                                                         className={`form-control ${validationErrors.value_for_money ? 'is-invalid' : ''}`}
//                                                         value={formData.value_for_money}
//                                                         onChange={handleChange}
//                                                     />
//                                                     {validationErrors.value_for_money && (
//                                                             <div className="invalid-feedback">{validationErrors.value_for_money}</div>
//                                                         )}
//                                                 </div>
//                                             </div>
//                                             {ids === 'add' ? (
//                                             <div className="form-group margin_0">
                                           
//                                                     <button className="main_bt" type="submit" disabled={loading}>
//                                                     {loading ? (
//                                                         <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//                                                     ) : (
//                                                         'Submit'
//                                                     )}
//                                                 </button>
                                              
//                                             </div>): (<>
//                                             <div className="form-group margin_0">
//                                             <button className="main_bt" type="submit" disabled={loading}>
//                                                     {loading ? (
//                                                         <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//                                                     ) : (
//                                                         'Update'
//                                                     )}
//                                                 </button>
//                                             </div></>)}
//                                             <span id="result" className="text-danger mt-4 d-block"></span>
//                                             <div className="mb-4"><h2>Approved Banks</h2></div>
//                                             <div className="row">
//                                                 {details.length === 0 ? (
//                                                     <div className="col-lg-12 text-center">No Banks Found</div>
//                                                 ) : (
//                                                     details.map((detail) => (
//                                                         detail.status === true ?
//                                                         <div className="col-lg-3 mb-4" key={detail._id}>
//                                                             <div className="card amenity-card">
                                                                
//                                                                 <div className="card-body">
//                                                                     <div className="d-flex align-items-center">
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             // name="banks"
//                                                                             // value={detail._id} // Unique value for the checkbox
//                                                                             checked={isChecked(detail._id)}
//                                                                             onChange={() => handleCheckboxChange(detail._id)}
//                                                                             className="mr-3"
//                                                                         /><img src={`${imageURL}/${detail.image}`} alt={detail.alt_tag} width="50"
//                                                                         height="50"
//                                                                         style={{ borderRadius: '50%', marginRight: '15px' }}/>
//                                                                         <div>
//                                                                             <h5 className="card-title mb-1">{detail.title}</h5>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div> : null
//                                                     ))
//                                                 )}
//                                             </div>
                                            
                                           
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
