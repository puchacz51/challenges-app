const TextInput = ({ text, register, ...att }) => {
  return (
    <div className='relative gap-1 pt-3'>
      <label
        className=' absolute text-gray-600 border-b-2 border-transparent text-lg peer-focus:-translate-y-4  '
        htmlFor={register.name}
        {...att}>
        {`${text}`}
      </label>
      <input
        className='peer outline-none border-b-2 border-gray-600 w-full active:border-black    text-lg'
        type='text'
        name={register.name}
        {...register}
      />
    </div>
  );
};
export default TextInput;
