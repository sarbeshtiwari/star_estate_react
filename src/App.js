import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/login/login';
import Dashboard from './views/home/dashboard/dashboard';
import Footer from './views/widgets/footer';

import LogoutComponent from './views/widgets/logout';
import Category from './views/home/category/category';
import JobPost from './views/home/job/jobPost';
import AddCategory from './views/home/category/add_category';
import AddCareer from './views/home/job/add_career';
import AddAminitiesCategory from './views/home/other/amenities/add_amenities_category';
import AmenitiesCategory from './views/home/other/amenities/amenities_category';
import Amenities from './views/home/other/amenities/amenities';
import AddAmenities from './views/home/other/amenities/add_amenities';
import LocationAdvantages from './views/home/other/location_advantages/location_advantages';
import AddLocationAdvantages from './views/home/other/location_advantages/add_location_advantaes';
import ApprovedBanks from './views/home/other/approved_banks/approved_banks';
import AddApprovedBanks from './views/home/other/approved_banks/add_approved_banks';
import Developer from './views/home/other/developer/developer';
import AddDeveloper from './views/home/other/developer/add_developer';
import Blogs from './views/home/other/blogs/blogs';
import AddBlogs from './views/home/other/blogs/add_blogs';
import Events from './views/home/other/events/events';
import AddEvents from './views/home/other/events/add_events';
import EventsGallery from './views/home/other/events/events_gallery';
import NewsPaper from './views/home/other/news_paper/news_paper';
import AddNewsPaper from './views/home/other/news_paper/add_news_paper';
import ProjectQueries from './views/home/enquiry/project_queries';
import ContactUs from './views/home/enquiry/contact_us';
import Career from './views/home/enquiry/career';
import Cities from './views/home/other/location/cities';
import AddLocation from './views/home/other/location/addLocation';
import SubCities from './views/home/other/location/sub-city/subCity';
import AddSubCity from './views/home/other/location/sub-city/addSubCity';
import FooterFAQ from './views/home/other/location/footer_faq/footer_faq';
import AddFAQ from './views/home/other/location/footer_faq/add_faq';
import SubCityFooterFAQ from './views/home/other/location/sub-city/faq/sub_city_faq';
import SubCityAddFAQ from './views/home/other/location/sub-city/faq/add_sub_city_faq';
import AddProject from './views/home/dashboard/project_list/add_project';
import ProjectList from './views/home/dashboard/project_list/project_list';
import ViewProject from './views/home/dashboard/project_list/view_project/view_project';
import QuickDetails from './views/home/dashboard/project_list/view_project/quick_details/quick_details';
import AddQuickDetails from './views/home/dashboard/project_list/view_project/quick_details/add_quick_details';
import ContentSEO from './views/home/dashboard/project_list/view_project/content_seo/content_seo';
import AddContentSEO from './views/home/dashboard/project_list/view_project/content_seo/add_content_seo';
import ProjectSpecification from './views/home/dashboard/project_list/view_project/project_specification/project_specification';
import AddProjectSpecification from './views/home/dashboard/project_list/view_project/project_specification/add_project_specification';
import ProjectFAQ from './views/home/dashboard/project_list/view_project/project_faq/project_faq';
import AddProjectFAQ from './views/home/dashboard/project_list/view_project/project_faq/add_project_faq';
import BrochureWalkthrough from './views/home/dashboard/project_list/view_project/brochure_walkthrough/brochure_walkthrough';
import AddBrochureWalkthrough from './views/home/dashboard/project_list/view_project/brochure_walkthrough/add_brochure_walkthrough';
import ProjectAmenities from './views/home/dashboard/project_list/view_project/project_amenities/project_amenities';
import AddProjectAmenities from './views/home/dashboard/project_list/view_project/project_amenities/addProject_amenities';
import FloorPlan from './views/home/dashboard/project_list/view_project/floor_plan/floor_plan';
import AddFloorPlan from './views/home/dashboard/project_list/view_project/floor_plan/add_floor_plan';
import ProjectLocationAdvantage from './views/home/dashboard/project_list/view_project/project_location_advantages/project_location_advantages';
import AddProjectLocationAdvantages from './views/home/dashboard/project_list/view_project/project_location_advantages/add_project_location_advantages';
import ProjectGallery from './views/home/dashboard/project_list/view_project/project_gallery/project_gallery';
import AddProjectGallery from './views/home/dashboard/project_list/view_project/project_gallery/addProject_gallery';
import ProjectRera from './views/home/dashboard/project_list/view_project/project_rera/project_rera';
import AddProjectRERA from './views/home/dashboard/project_list/view_project/project_rera/addProject_rera';
import ProjectBanksRatings from './views/home/dashboard/project_list/view_project/banks_ratings/banks_ratings';
import AddBanksandRatings from './views/home/dashboard/project_list/view_project/banks_ratings/add_banks_ratings';
import ProtectedRoute from './PrivateRoute';
import Sidebar from './views/home/sidebar';
import ProjectConfiguration from './views/home/other/location/projectConfiguration';
import AddConfiguration from './views/home/other/location/addConfiguration';
import HomeBanner from './views/widgets/homeBanner';
import AddBannerImage from './views/widgets/bannerImage';
import StarRera from './views/home/other/starEstate_rera/rera';
import AddStarRERA from './views/home/other/starEstate_rera/addRera';
import Advertisements from './views/home/other/advertisements/advertisements';
import AddAdvertisements from './views/home/other/advertisements/addAdvertisements';
import Awards from './views/home/other/awards/awards';
import AddAwards from './views/home/other/awards/addAwards';
import ClientSpeak from './views/home/other/clientsSpeak/client_speak';
import AddClientSpeak from './views/home/other/clientsSpeak/addClientSpeak';
import ConfigurationFAQ from './views/home/other/location/configurationFaq';
import AddConfigurationFAQ from './views/home/other/location/addConfigurationFAQ';
import ProjectHomeBanner from './views/home/dashboard/project_list/view_project/bannerImages/projectBannerImage';
import AddProjectBannerImage from './views/home/dashboard/project_list/view_project/bannerImages/addProjectBannerImage';
import NRIQuery from './views/home/enquiry/nri_query';
import Investor from './views/home/enquiry/investors';
import PropertyEvaluation from './views/home/enquiry/propertyEvaluation';

function App() {
  return (
    <BrowserRouter basename="/starestate-panel">
    {/* <ProtectedRoute element ={<Sidebar></Sidebar>}/> */}
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute element ={<Dashboard />}/>} />
        <Route path=":id3/:id2/:id1/addProject/:id" element={<ProtectedRoute element ={<AddProject/>}/>}/>
        <Route path=":id/projectType/:id" element={<ProtectedRoute element ={<ProjectList/>}/>}/>
        <Route path=":id/:id/:id/viewProject/:id" element={<ProtectedRoute element ={<ViewProject/>}/>}/>
        <Route path="/quickDetails/:id" element={<ProtectedRoute element ={<QuickDetails/>}/>}/>
        <Route path="/:id/addQuickDetails/:ids" element={<ProtectedRoute element ={<AddQuickDetails/>}/>}/>
        <Route path="/contentSEO/:id" element={<ProtectedRoute element ={<ContentSEO/>}/>}/>
        <Route path='/:id/addContentSEO/:ids' element={<ProtectedRoute element ={<AddContentSEO/>}/>}/>
        <Route path="/projectSpecifications/:id" element={<ProtectedRoute element ={<ProjectSpecification/>}/>}/>
        <Route path="/:id/addprojectSpecifications/:ids" element={<ProtectedRoute element ={<AddProjectSpecification/>}/>}/>
        <Route path="/projectFAQ/:id" element={<ProtectedRoute element ={<ProjectFAQ/>}/>}/>
        <Route path="/:id/addProjectFAQ/:ids" element={<ProtectedRoute element ={<AddProjectFAQ/>}/>}/>
        <Route path="/brochureWalkthrough/:id" element={<ProtectedRoute element ={<BrochureWalkthrough/>}/>}/>
        <Route path="/:id/addBrochureWalkthrough/:ids" element={<ProtectedRoute element ={<AddBrochureWalkthrough/>}/>}/>
        <Route path="/projectAmenities/:id" element={<ProtectedRoute element ={<ProjectAmenities/>}/>}/>
        <Route path="/:id/addProjectAmenities" element={<ProtectedRoute element ={<AddProjectAmenities/>}/>}/>
        <Route path="/floorPlan/:id" element={<ProtectedRoute element ={<FloorPlan/>}/>}/>
        <Route path="/:id/addFloorPlan/:ids" element={<ProtectedRoute element ={<AddFloorPlan/>}/>}/>
        <Route path="/projectLocationAdvantages/:id" element={<ProtectedRoute element ={<ProjectLocationAdvantage/>}/>}/>
        <Route path="/:id/addProjectLocationAdvantages" element={<ProtectedRoute element ={<AddProjectLocationAdvantages/>}/>}/>
        <Route path="/projectGallery/:id" element={<ProtectedRoute element ={<ProjectGallery/>}/>}/>
        <Route path="/:id/addProjectGallery/:ids" element={<ProtectedRoute element ={<AddProjectGallery/>}/>}/>
        <Route path="/projectRERA/:id" element={<ProtectedRoute element ={<ProjectRera/>}/>}/>
        <Route path="/:id/addProjectRERA/:ids" element={<ProtectedRoute element ={<AddProjectRERA/>}/>}/>
        <Route path="/projectBanks/:id" element={<ProtectedRoute element ={<ProjectBanksRatings/>}/>}/>
        <Route path="/:id/addBanks/:ids" element={<ProtectedRoute element ={<AddBanksandRatings/>}/>}/>
        <Route path='/projectBannerImage/:id' element={<ProtectedRoute element={<ProjectHomeBanner/>}/>}/>
        <Route path='/addBanner/:id' element={<ProtectedRoute element={<AddProjectBannerImage/>}/>}/>

        <Route path="/category" element ={<ProtectedRoute element ={<Category/>}/>}/>       
        <Route  path="/AddCategory/:id" element ={<ProtectedRoute element ={<AddCategory/>}/>}/>

        <Route path="/bannerImage" element = {<ProtectedRoute element={ <HomeBanner/>}/>}/>
        <Route path='/addHomeBanner' element = {<ProtectedRoute element={<AddBannerImage/>}/>}/> 
        
        <Route path="/jobPost" element = {<ProtectedRoute element ={<JobPost/>}/>}/>
        <Route path="/AddCareer/:id" element = {<ProtectedRoute element ={<AddCareer/>}/>}/>
        
        <Route path="/logout" element ={<ProtectedRoute element ={<LogoutComponent/>}/>}/>

        {/* Others */}
        {/* <Route path="/amenities_category" element={<ProtectedRoute element ={<AmenitiesCategory/>}/>}/>
        <Route path="/addAmenitiesCategory/:id" element={<ProtectedRoute element ={<AddAminitiesCategory/>}/>}/> */}
        <Route path="/Amenities" element={<ProtectedRoute element ={<Amenities/>}/>}/>
        <Route path="/addAmenities/:id" element={<ProtectedRoute element ={<AddAmenities/>}/>}/>

        <Route path="/location" element={<ProtectedRoute element ={<Cities/>}/>}/>
        <Route path="/addLocation/:ids/:id" element={<ProtectedRoute element ={<AddLocation/>}/>}/>

        <Route path="/subCities/:id" element={<ProtectedRoute element ={<SubCities/>}/>}/>
        <Route path="/addSubCities/:id/:ids" element={<ProtectedRoute element ={<AddSubCity/>}/>}/>

        <Route path="/projects/:id" element={<ProtectedRoute element={<ProjectConfiguration/>}/>}/>
        <Route path='/:ids/addConfiguration/:id' element={<ProtectedRoute element={<AddConfiguration/>}/>}/>

        <Route path= '/:city/configurationFAQ/:slugURL/:propertyType' element={<ProtectedRoute element={<ConfigurationFAQ/>}/>}/>
        <Route path='/addConfigurationFAQ/:slugURL/:id' element={<ProtectedRoute element={<AddConfigurationFAQ/>}/>}/>

        <Route path = "/SubCityfooterFAQ/:sub_city/:content_type" element = {<ProtectedRoute element ={<SubCityFooterFAQ/>}/>}/>
        <Route path = "/SubCityaddFAQ/:ids/:id" element = {<ProtectedRoute element ={<SubCityAddFAQ/>}/>}/>

        <Route path = "/footerFAQ/:city/:projectType" element = {<ProtectedRoute element ={<FooterFAQ/>}/>}/>
        <Route path = "/addFAQ/:ids/:id" element = {<ProtectedRoute element ={<AddFAQ/>}/>}/>

        <Route path="/locationAdvantages" element={<ProtectedRoute element ={<LocationAdvantages/>}/>}/>
        <Route path="/addLocationAdvantages/:id" element={<ProtectedRoute element ={<AddLocationAdvantages/>}/>}/>

        <Route path="/approvedBanks" element={<ProtectedRoute element ={<ApprovedBanks/>}/>}/>
        <Route path="/addApprovedBanks/:id" element={<ProtectedRoute element ={<AddApprovedBanks/>}/>}/>

        <Route path="/developer" element={<ProtectedRoute element ={<Developer/>}/>}/>
        <Route path="/addDeveloper/:id" element={<ProtectedRoute element ={<AddDeveloper/>}/>}/>

        <Route path='/starRera' element={<ProtectedRoute element={<StarRera/>}/>}/>
        <Route path='/addStarRera/:id' element={<ProtectedRoute element={<AddStarRERA/>}/>}/>

        <Route path='/clientSpeak' element={<ProtectedRoute element={<ClientSpeak/>}/>}/>
        <Route path='/addClientSpeak/:id' element={<ProtectedRoute element={<AddClientSpeak/>}/>}/>

        {/* Media */}

        <Route path="/blogs" element={<ProtectedRoute element ={<Blogs/>}/>}/>
        <Route path="/addBlogs/:id" element={<ProtectedRoute element ={<AddBlogs/>}/>}/>

        <Route path="/events" element={<ProtectedRoute element ={<Events/>}/>}/>
        <Route path="/addEvents/:id" element={<ProtectedRoute element ={<AddEvents/>}/>}/>
        <Route path="/eventsGallery/:id" element={<ProtectedRoute element ={<EventsGallery/>}/>}/>

        <Route path="/newsPaper" element = {<ProtectedRoute element ={<NewsPaper/>}/>}/>
        <Route path="/addNewsPaper/:id" element = {<ProtectedRoute element ={<AddNewsPaper/>}/>}/>               

        <Route path='/advertisements' element={<ProtectedRoute element={<Advertisements/>}/>}/>
        <Route path='/addAdvertisements' element={<ProtectedRoute element={<AddAdvertisements/>}/>}/>

        <Route path='/awards' element={<ProtectedRoute element={<Awards/>}/>}/>
        <Route path='/addAwards' element={<ProtectedRoute element={<AddAwards/>}/>}/>

        {/* Enquiry */}
        <Route path="/ProjectQueries" element = {<ProtectedRoute element ={<ProjectQueries/>}/>}/>
        <Route path="/ContactUs" element = {<ProtectedRoute element ={<ContactUs/>}/>}/>
        <Route path="/career" element = {<ProtectedRoute element ={<Career/>}/>}/>
        <Route path="/nriQuery" element ={<ProtectedRoute element ={<NRIQuery/>}/>}/>
        <Route path="/investor" element = {<ProtectedRoute element={<Investor/>}/>}/>
        <Route path="/propertyEvaluation" element = {<ProtectedRoute element={<PropertyEvaluation/>}/>}/>

      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
