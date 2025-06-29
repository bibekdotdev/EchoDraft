import { useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams(); // Get the 'id' from the URL

  return (
    <div>
      <h2>Edit Blog Page</h2>
      <p>Blog ID: {id}</p>
      {/* You can use the ID to fetch blog details or update it */}
    </div>
  );
};

export default EditBlog;
