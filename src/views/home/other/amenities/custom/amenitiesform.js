import { useState, useEffect } from 'react';
import { fetchAmenityData, updateAmenityStatus, deleteAmenity, getAllTheAmenities } from '../../../../../api/amenities/amenities_api'; 
import Swal from 'sweetalert2';

const useAmenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getAllTheAmenities();
                if (data && Array.isArray(data.data)) {
                    setAmenities(data.data);
                } else {
                    setError('Unexpected data format.');
                }
            } catch (error) {
                setError('Failed to fetch amenities data.');
            }
            setLoading(false);
        };

        fetchData();
    }, []);
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    const handleUpdateStatus = async (cat_id, status) => {
        try {
            await updateAmenityStatus(cat_id, status);
            setAmenities(prevAmenities =>
                prevAmenities.map(amenity =>
                    amenity._id === cat_id ? { ...amenity, status } : amenity
                )
            );
        } catch (error) {
            setError('Failed to update amenity status.');
        }
    };

    const handleDeleteAmenity = async (cat_id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to undo this action!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33', // Danger color
                cancelButtonColor: '#3085d6', // Safe color
                confirmButtonText: 'Yes, delete it!'
            });
    
            if (result.isConfirmed) {
                await deleteAmenity(cat_id);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Amenity deleted successfully.',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true, 
                });
    
                setAmenities(prevAmenities =>
                    prevAmenities.filter(amenity => amenity._id !== cat_id)
                );
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error deleting the amenity.',
                confirmButtonText: 'OK'
            });
        }
    };
    

    return {
        amenities,
        error,
        loading,
        handleUpdateStatus,
        handleDeleteAmenity
    };
};

export default useAmenities;
