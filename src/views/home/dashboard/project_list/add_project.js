import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from "../../sidebar";
import {
    fetchProjectById,
    fetchCities,
    fetchDevelopers,
    fetchLocalitiesByCity,
    addProject,
    updateProject
} from '../../../../api/dashboard/project_list/project_list_api'; 
import { imageURL } from "../../../../imageURL";

export default function AddProject() {
    const { id, id1 } = useParams();
    const [cities, setCities] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [locality, setLocality] = useState([]);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [priceUnit, setPriceUnit] = useState('Cr');
    const [isPriceRevealingSoon, setIsPriceRevealingSoon] = useState(false); // New state for checkbox

    const [formData, setFormData] = useState({
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        projectName: '',
        projectAddress: '',
        cityLocation: '',
        projectLocality: '',
        projectConfiguration: '',
        projectBy: '',
        // projectType: '',
        projectPrice: '',
        projectPriceUnit: 'Cr',
        ivr_no: '',
        locationMap: '',
        rera_no: '',
        city_priority: '',
        luxury_priority: '',
        newLaunch_priority: '',
        featured_priority: '',
        recent_priority: '',
        residential_priority: '',
        commercial_priority: '',
        project_status: [],
        project_logo: null,
        project_thumbnail: null,
        property_type: id1
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (id !== 'add') {
            fetchProjectById(id).then(data => setFormData(data)).catch(console.error);
        }
        fetchCities().then(data => setCities(data)).catch(console.error);
        fetchDevelopers().then(data => setDevelopers(data)).catch(console.error);
    }, [id, id1]);

    const fetchLocalities = async (cityId) => {
        try {
            const data = await fetchLocalitiesByCity(cityId);
            if (!data) {
                alert("No data Found for this city, add this Locality or choose another city");
            } else {
                setLocality(data);
            }
            
        } catch (error) {
            console.error('Error fetching localities:', error);
        }
    };

    const handleChange = async (e) => {
        const { name, value, type, checked, files } = e.target;
    
        if (type === 'file') {
            const file = files[0];
            
            // Validate image file
            try {
                await validateImage(file);
                // Update formData if file is valid
                setFormData({
                    ...formData,
                    [name]: file
                });
                // Clear any previous validation errors for this field
                setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
            } catch (error) {
                // Handle validation error
                setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
            }
        } else if (type === 'checkbox') {
            if (name === 'isPriceRevealingSoon') {
                setIsPriceRevealingSoon(checked);
                if (checked) {
                    // Set project price to "Price Revealing Soon" if checked
                    setFormData({ ...formData, projectPrice: 'Price Revealing Soon' });
                } else {
                    // Optionally, handle the case where it's unchecked, e.g., clear the price or revert it
                    setFormData({ ...formData, projectPrice: '' });
                }
            } else {
                setFormData({
                    ...formData,
                    project_status: checked
                        ? [...formData.project_status, value]
                        : formData.project_status.filter(status => status !== value)
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
            if (name === 'cityLocation' && value) {
                await fetchLocalities(value);
            }
        }
    };
    

    const validateImage = (file) => {
        const allowedTypes = ["image/png", "image/webp", "image/jpeg"];
        const reader = new FileReader();
    
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const arr = new Uint8Array(reader.result).subarray(0, 4);
                let header = "";
                for (let i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }
    
                let fileType = "";
                switch (header) {
                    case "89504e47":
                        fileType = "image/png";
                        break;
                    case "52494646":
                        fileType = "image/webp";
                        break;
                    case "ffd8ffe0":
                    case "ffd8ffe1":
                    case "ffd8ffe2":
                    case "ffd8ffe3":
                    case "ffd8ffe8":
                        fileType = "image/jpeg";
                        break;
                    default:
                        fileType = "unknown";
                        break;
                }
    
                if (!allowedTypes.includes(fileType)) {
                    reject("Only JPG, JPEG, WEBP, and PNG formats are allowed.");
                } else {
                    resolve(file);
                }
            };
    
            reader.onerror = () => reject("Error reading file.");
            reader.readAsArrayBuffer(file);
        });
    };

    

    // Handler for dropdown change
    const handleUnitChange = (event) => {
        const newPriceUnit = event.target.value;
        setPriceUnit(newPriceUnit);
        setFormData({
            ...formData,
            projectPriceUnit: newPriceUnit // Update formData with the new unit
        });
    };
    

    const validateForm = () => {
        const errors = {};
        if (!formData.projectName) errors.projectName = 'Project Name is required';
        if (!formData.projectAddress) errors.projectAddress = 'Project Address is required';
        if (!formData.cityLocation) errors.cityLocation = 'Project City is required';
        if (!formData.projectLocality) errors.projectLocality = 'Project Locality is required';
        if (!formData.projectConfiguration) errors.projectConfiguration = 'Project Configuration is required';
        if (!formData.projectBy) errors.projectBy = 'Developer is required';
        // if (!formData.projectType) errors.projectType = 'Project Type is required';
        if (!formData.projectPrice && !isPriceRevealingSoon) errors.projectPrice = 'Project Price is required';
        if (!formData.rera_no) errors.rera_no = 'Rera No is required';
        if (!formData.locationMap) errors.locationMap = 'Project Location is required';
        if (!formData.project_logo) errors.project_logo = 'Project Logo is required';
        if (!formData.project_thumbnail) errors.project_thumbnail = 'Project Image is required';
        return errors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        if (formData.project_status.length === 0){  
            alert( 'At least one Project Status is required');
            setValidationErrors(errors);
            return;
        }

        // Concatenate the project price with the selected price unit
            const formattedPrice = isPriceRevealingSoon
            ? 'Price Revealing Soon'
            : `${formData.projectPrice} ${priceUnit}`;

        // Update formData with the formatted price
        const updatedFormData = {
            ...formData,
            projectPrice: formattedPrice,
        };


        setLoading(true);
        console.log(formData)

        try {
            console.log('true')
            if (id === 'add') {
                await addProject(updatedFormData);
            } else {
                await updateProject(id, updatedFormData);
            }
            alert('Project saved successfully!');
            navigate(-1); // Redirect or clear form as needed
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to save project');
        }
        setLoading(false);
    };
    

    return(
        
            <div id="">
                <Sidebar/>
                <div className="midde_cont">
            <div className="container-fluid">
                <div className="row column_title">
                    <div className="col-md-12">
                        <div className="page_title">
                            <h2>{id === 'add' ? 'Add' : 'Edit'} Overview</h2>
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
                                <form method="POST" id="projectsforms" encType="multipart/form-data" onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="col-md-6 form-group">
                                            <label className="label_field">Meta Title</label>
                                            <input
                                                type="text"
                                                name="metaTitle"
                                                
                                                className="form-control"
                                                value={formData.metaTitle}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label className="label_field">Meta Keyword</label>
                                            <input
                                                type="text"
                                                name="metaKeyword"
                                               
                                                className="form-control"
                                                value={formData.metaKeyword}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <label className="label_field">Meta Description</label>
                                            <textarea
                                                name="metaDescription"
                                                className="form-control"
                                               
                                                rows="5"
                                                value={formData.metaDescription}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Project Name</label>
                                            <input
                                                type="text"
                                                name="projectName"
                                                
                                                className={`form-control ${validationErrors.projectName ? 'is-invalid' : ''}`}
                                                value={formData.projectName}
                                                onChange={handleChange}
                                            />
                                            {validationErrors.projectName && (
                                                            <div className="invalid-feedback">{validationErrors.projectName}</div>
                                                        )}
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Project Address</label>
                                            <input
                                                type="text"
                                                name="projectAddress"
                                               
                                                className={`form-control ${validationErrors.projectAddress ? 'is-invalid' : ''}`}
                                                value={formData.projectAddress}
                                                onChange={handleChange}
                                            />
                                            {validationErrors.projectAddress && (
                                                <div className="invalid-feedback">{validationErrors.projectAddress}</div>
                                            )}
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">City</label>
                                            <select
                                                name="cityLocation"
                                                className={`form-control ${validationErrors.cityLocation ? 'is-invalid' : ''}`}
                                                value={formData.cityLocation}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select City</option>
                                                {cities.map(city => (
                                                    <option key={city._id} value={city.slugURL}>{city.location}</option>
                                                ))}
                                            </select>
                                            {validationErrors.cityLocation && (
                                                <div className="invalid-feedback">{validationErrors.cityLocation}</div>
                                            )}
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Locality</label>
                                            <select
                                                name="projectLocality"
                                                className={`form-control ${validationErrors.projectLocality ? 'is-invalid' : ''}`}
                                                value={formData.projectLocality}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Locality</option>
                                                {locality.map(locality => (
                                                    <option key={locality._id} value={locality.sub_city}>{locality.sub_city}</option>
                                                ))}
                                            </select>
                                            {validationErrors.projectLocality && (
                                                <div className="invalid-feedback">{validationErrors.projectLocality}</div>
                                            )}
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Project Configuration</label>
                                            <select
                                                name="projectConfiguration"
                                                className={`form-control ${validationErrors.projectConfiguration ? 'is-invalid' : ''}`}
                                                value={formData.projectConfiguration}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Configuration</option>
                                                <option value="1-BHK">1 BHK</option>
                                                <option value="2-BHK">2 BHK</option>
                                                <option value="3-BHK">3 BHK</option>
                                                <option value="4-BHK">4 BHK</option>
                                                <option value="5-BHK">5 BHK</option>
                                                <option value="Villa">Villa</option>
                                                
                                                <option value="studio">Sudio Apartments</option>
                                            </select>
                                            {validationErrors.projectConfiguration && (
                                                <div className="invalid-feedback">{validationErrors.projectConfiguration}</div>
                                            )}
                                        </div>

                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Project BY</label>
                                            <select
                                                name="projectBy"
                                                className={`form-control ${validationErrors.projectBy ? 'is-invalid' : ''}`}
                                                value={formData.projectBy}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Developer</option>
                                                {developers.map(developers => (
                                                    <option key={developers._id} value={developers.developersName}>{developers.developerName}</option>
                                                ))}
                                            </select>
                                            {validationErrors.projectBy && (
                                                <div className="invalid-feedback">{validationErrors.projectBy}</div>
                                            )}
                                        </div>
                                        {/* <div className="col-md-3 form-group">
                                            <label className="label_field">Project Type</label>
                                            <input
                                                type="text"
                                                name="projectType"
                                                placeholder="Ex - Independent Floor"
                                                className={`form-control ${validationErrors.projectType ? 'is-invalid' : ''}`}
                                                value={formData.projectType}
                                                onChange={handleChange}
                                            />
                                            {validationErrors.projectType && (
                                                <div className="invalid-feedback">{validationErrors.projectType}</div>
                                            )}
                                        </div> */}
                                        <div className="col-md-3 form-group">
                                                <label className="label_field">Project Price</label>
                                                <div className="d-flex">
                                                    <input
                                                        type="text"
                                                        name="projectPrice"
                                                        // placeholder={`Ex - 4 ${priceUnit}/Lakhs/K`}
                                                        className={`form-control ${validationErrors.projectPrice ? 'is-invalid' : ''}`}
                                                        value={formData.projectPrice}
                                                        onChange={handleChange}
                                                        disabled={isPriceRevealingSoon} // Disable if checkbox is checked
                                                    />
                                                    <select
                                                        name="projectPriceUnit"
                                                        value={priceUnit}
                                                        onChange={handleUnitChange}
                                                        className={`form-control ml-2 ${validationErrors.projectPriceUnit ? 'is-invalid' : ''}`}
                                                    >
                                                        <option value="Cr">Cr</option>
                                                        <option value="Lakh">Lakh</option>
                                                        <option value="K">K</option>
                                                    </select>
                                                </div>
                                                {validationErrors.projectPrice && (
                                                    <div className="invalid-feedback">{validationErrors.projectPrice}</div>
                                                )}
                                                
                                            </div>

                                            <div className="col-md-3 form-group">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        name="isPriceRevealingSoon"
                                                        className="form-check-input"
                                                        checked={isPriceRevealingSoon}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">Price Revealing Soon</label>
                                                </div>
                                            </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">IVR Number</label>
                                            <input
                                                type="text"
                                                name="ivr_no"
                                        
                                                className="form-control"
                                                value={formData.ivr_no}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Google Map Location</label>
                                            <input
                                                type="text"
                                                name="locationMap"
                                             
                                                className={`form-control ${validationErrors.locationMap ? 'is-invalid' : ''}`}
                                                value={formData.locationMap}
                                                onChange={handleChange}
                                            />
                                            {validationErrors.locationMap && (
                                                <div className="invalid-feedback">{validationErrors.locationMap}</div>
                                            )}
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">RERA No.</label>
                                            <input
                                                type="text"
                                                name="rera_no"
                                            
                                                className={`form-control ${validationErrors.rera_no ? 'is-invalid' : ''}`}
                                                value={formData.rera_no}
                                                onChange={handleChange}
                                            />
                                            {validationErrors.rera_no && (
                                                <div className="invalid-feedback">{validationErrors.rera_no}</div>
                                            )}
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">City Priority</label>
                                            <input
                                                type="number"
                                                name="city_priority"
                                        
                                                className="form-control"
                                                value={formData.city_priority}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Luxury Priority</label>
                                            <input
                                                type="number"
                                                name="luxury_priority"
                                               
                                                className="form-control"
                                                value={formData.luxury_priority}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">New Launch Priority</label>
                                            <input
                                                type="number"
                                                name="newLaunch_priority"
                                                value={formData.newLaunch_priority}
                                               
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Featured Priority</label>
                                            <input
                                                type="number"
                                                name="featured_priority"
                                                value={formData.featured_priority}
                                               
                                                onChange={handleChange}className="form-control"
                                            />
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Recent Priority</label>
                                            <input
                                                type="number"
                                                name="recent_priority"
                                                value={formData.recent_priority}
                                                className="form-control"
                                               
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Residential</label>
                                            <input
                                                type="number"
                                                name="residential_priority"
                                                value={formData.residential_priority}
                                               className="form-control"
                                               
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Commercial</label>
                                            <input
                                                type="number"
                                                name="commercial_priority"
                                                value={formData.commercial_priority}
                                              className="form-control"
                                               
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <label className="label_field">Project Status</label>
                                            <div>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="project_status"
                                                        value="New Launch"
                                                        checked={formData.project_status.includes('new launch')}
                                                        onChange={handleChange} 
                                                    /> New Launch
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="project_status"
                                                        value="Luxury"
                                                        checked={formData.project_status.includes('luxury')}
                                                        onChange={handleChange}
                                                    /> Luxury
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="project_status"
                                                        value="Featured"
                                                        checked={formData.project_status.includes('featured')}
                                                        onChange={handleChange}
                                                    /> Featured
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="project_status"
                                                        value="Recent"
                                                        checked={formData.project_status.includes('recent')}
                                                        onChange={handleChange}
                                                    /> Recent
                                                </label>
                                                
                                            </div>
                                            
                                           
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label className="label_field">Project Logo</label>
                                            <input
                                                type="file"
                                                name="project_logo"
                                                className={`form-control ${validationErrors.project_logo ? 'is-invalid' : ''}`}
                                                onChange={handleChange}
                                            />
                                            {validationErrors.project_logo && (
                                                <div className="invalid-feedback">{validationErrors.project_logo}</div>
                                            )}
                                            {formData.project_logo ?  <img 
                                                                   src={`${imageURL}/${formData.project_logo}`}

                                                                   
                                                                    style={{ objectFit: 'cover' }}
                                                                    alt={formData.projectName}
                                                                    width="100"
                                                                    height="100"
                                                                /> : ''}
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label className="label_field">Project Thumbnail</label>
                                            <input
                                                type="file"
                                                name="project_thumbnail"
                                                className={`form-control ${validationErrors.project_thumbnail ? 'is-invalid' : ''}`}
                                                onChange={handleChange}
                                            />
                                            {validationErrors.project_thumbnail && (
                                                <div className="invalid-feedback">{validationErrors.project_thumbnail}</div>
                                            )}
                                            {formData.project_thumbnail ?  <img 
                                                                   src={`${imageURL}/${formData.project_thumbnail}`}

                                                                   
                                                                    style={{ objectFit: 'cover' }}
                                                                    alt={formData.projectName}
                                                                    width="100"
                                                                    height="100"
                                                                /> : ''}
                                        </div>
                                        <div className="col-md-12 form-group">
                                        {id === 'add' ? ( 
                                                    <button className="main_bt" type="submit" disabled={loading}>
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        'Submit'
                                                    )}
                                                </button>) : ( <button className="main_bt" type="submit" disabled={loading}>
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        'Update'
                                                    )}
                                                </button>)}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                </div>
               
    )
}