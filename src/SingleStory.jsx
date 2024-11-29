import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const SingleStory = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(id)

  // Fetch story data from the API based on the id
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`https://birthday-gift-server.vercel.app/api/v1/storey/${id}`);
        const data = await response.json();
        console.log(data)
        setStory(data.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching story');
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  // Render the loading, error, or story data
  if (loading) {
    return <p>Loading ....</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {story ? (
        <div className='bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] h-screen overflow-auto  '>
          <div className='flex items-center h-full px-5 md:px-10 lg '>
            <div className='space-y-5 border p-10 border-black/10 '>
              <h1 className="subHeading">{story.title}</h1>
              <p className="para font-custom text-white/70 leading-8">{story.des}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Story not found</p>
      )}
    </div>
  );
};

export default SingleStory;
