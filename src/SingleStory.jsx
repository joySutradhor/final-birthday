import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StoryHeader from './StoryHeader';

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
        const response = await fetch(`https://birthday-gift-website.vercel.app/api/v1/storey/${id}`);
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
    return <div>
      <p className='bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] h-screen flex justify-center items-center text-white/80 font-bold text-xl'>Loading ....</p>
    </div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <StoryHeader />
      {story ? (
        <div className='bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] h-[100vh] overflow-auto  '>
          <div className=' mt-[20%] xl:mt-[10%] px-5 md:px-10   '>
            <div className='space-y-5 border p-5 md:p-10 border-black/10 '>
              <h1 className="heading">{story.title}</h1>
              <p className="para leading-5"
                style={{
                  whiteSpace: "pre-wrap",
                  paddingTop: "10px",

                }}>{story.des}</p>
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
