import axios from 'axios';
import { useRef } from 'react';
import { readFileAsText } from '../components/utilities/challengeFormData'; 

const sendFormData = async (fd: FormData) => {
  const res = await axios.post('api/test', fd, {
    transformRequest: (formData) => {
      for (let to of formData) {
        console.log(to);
      }
      return formData;
    },
    // headers: {
    //   'content-type': 'multipart/form-data',
    // },
  });
  return res.data;
};

const Test = () => {
  const imageRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = async () => {
    const fd = new FormData();
    fd.append('name', 'bartosz');
    const files = imageRef.current.files;
    for (let file of files) {
      fd.append('images[]', file, 'image.jpg');
    }
    sendFormData(fd);
  };

  return (
    <div>
      {' '}
      <form onSubmit={handleFormSubmit}>
        <input name='images' type='file' multiple ref={imageRef} />
        <input type='text' name='test' className='border-2 border-black' />
        <button type='button' onClick={handleFormSubmit}>
          submit
        </button>
      </form>
      3
    </div>
  );
};

export default Test;
