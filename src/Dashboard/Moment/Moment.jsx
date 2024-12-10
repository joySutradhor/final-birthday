import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

function Moment() {
  const {
    register,
    handleSubmit,
    setValue, 
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [momentId, setMomentId] = useState(null); 

  const onSubmit = async (data) => {
    if (!momentId) {
      Swal.fire('Error!', 'No ID found for updating.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch(
        `https://birthday-gift-web.vercel.app/api/v1/title/${momentId}`,
        data
      );
      if (response.status === 200) {
        Swal.fire('Success!', 'Your data has been submitted.', 'success');
        console.log(response);
        setLoading(false);
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get('https://birthday-gift-web.vercel.app/api/v1/title')
      .then((response) => {
        const fetchedMoment = response.data.data[0];
        setMomentId(fetchedMoment?._id); // Save the ID
        setValue('title', fetchedMoment?.title || '');
        setValue('des', fetchedMoment?.des || '');
      })
      .catch((error) => console.error('Error fetching moments:', error));
  }, [setValue]);

  return (
    <section className="mt-10">
      <div className="border p-5 lg:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Input Field */}
          <div className="mb-4">
            <label htmlFor="title" className="block d__des">
             Happy Moment Title
            </label>
            <input
              type="text"
              id="title"
              {...register('title', { required: 'Title is required' })}
              className={`mt-1 block w-full p-2 border ${
                errors.title ? 'border-red-500' : 'focus:outline-none'
              } rounded`}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          {/* Textarea Field */}
          <div className="mb-4">
            <label htmlFor="des" className="block d__des">
             Description
            </label>
            <textarea
              id="des"
              {...register('des', { required: 'Description is required' })}
              className={`mt-1 block w-full p-2 border ${
                errors.des ? 'border-red-500' : 'focus:outline-none'
              } rounded`}
              rows="4"
            ></textarea>
            {errors.des && <p className="text-red-500 text-sm">{errors.des.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-2 bg-gray-700 text-white font-medium rounded"
          >
            {loading ? 'Wait Submitting.......' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Moment;
