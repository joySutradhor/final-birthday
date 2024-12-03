import React, { useState } from 'react'; 
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import BorderColorIcon from '@mui/icons-material/BorderColor';




function CreateStory() {
    const { register, handleSubmit, formState: { errors } , reset } = useForm();
    const [loading, setLoading] = useState(false); // Add loading state
 

    const onSubmit = async (data) => {
        console.log(data)
        // If loading is true, prevent submitting again
        if (loading) return;


        // Show SweetAlert confirmation dialog before proceeding
        const swalWithBootstrapButtons = Swal.mixin();

        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, submit it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Show loading state while submitting
                setLoading(true); // Set loading to true

                const loadingSwal = Swal.fire({
                    title: 'Submitting...',
                    text: 'Please wait while we submit your story.',
                    icon: 'info',
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                try {
                    // Simulate an API request (replace with your actual API call)
                    const response = await axios.post('https://birthday-gift-web.vercel.app/api/v1/storey/create', data);
                    console.log('Story Created:', response.data);

                    // Hide the loading Swal and show success message
                    loadingSwal.close();
                    swalWithBootstrapButtons.fire({
                        title: "Submitted!",
                        text: "Your story has been submitted successfully.",
                        icon: "success"
                    });
                    reset() ;
                    window.location.reload() ;
                } catch (error) {
                    // Handle error, hide the loading Swal, and show error message
                    loadingSwal.close();
                    swalWithBootstrapButtons.fire({
                        title: "Error!",
                        text: "There was an error submitting your story.",
                        icon: "error"
                    });
                    
                } finally {
                    // Reset the loading state after submission attempt
                    setLoading(false);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your story submission has been cancelled.",
                    icon: "error"
                });
            }
        });
    };

    return (
        <>
            <section className='mt-10 border p-5 md:p-10'>
                <h2 className='d__des mb-8 flex items-center gap-1'> <span> <BorderColorIcon /></span> Write Your Feelings Here</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <label className='block d__des mb-2' htmlFor="title">Story Title</label>
                        <input
                            type="text"
                            id="title"
                            {...register('title', { required: 'Story Title is required' })}
                            className="border p-2 w-full outline-none"
                        />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>

                    <div className="mb-6">
                        <label className='block d__des mb-2' htmlFor="des">Story description </label>
                        <textarea
                            id="des"
                            {...register('des', { required: 'Story des is required' })}
                            className="border p-2 w-full outline-none"
                            rows="4"
                        />
                        {errors.des && <p className="text-red-500">{errors.des.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="bg-gray-700 text-white p-2 px-8 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </section>


        </>
    );
}

export default CreateStory;

