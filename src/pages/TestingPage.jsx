import { API_BASE_URL } from '../utils/api';

const TestingPage = () => {
  return (
    <div>
      <img src={`${API_BASE_URL}/he.jpg`} className='w-fit' alt="Test" />

      <form action={`${API_BASE_URL}/postimage`} method='post' encType="multipart/form-data">
        <label htmlFor="img">Give the Image</label>
        <input type="file" name="image" id="img" />
        <label htmlFor="name">This is my Name</label>
        <input type="text" name='name' id="name" />
        <input type="submit" value={"Submit"} className='p-2 bg-blue-500 text-white cursor-pointer' />
      </form>
    </div>
  );
};

export default TestingPage;