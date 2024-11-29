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
        <p>{id}</p>
      {story ? (
        <>
          <h1 className="text-2xl font-bold">{story.title}</h1>
          {/* <p className="mt-4 text-lg">{story.description}</p> */}
        </>
      ) : (
        <p>Story not found</p>
      )}
    </div>
  );
};

export default SingleStory;
