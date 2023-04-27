type CheckBoxProps = {
  name: string;
  values: string[];
};

export const CheckBox = ({ name, values }: CheckBoxProps) => {
  return (
    <div className='flex flex-row gap-3'>
      <label htmlFor={name}>{name}:</label>
      <div className='flex gap-2'>
        {values.map((value) => (
          <div key={value} className='flex justify-center items-center'>
            <span>{value}</span>
            <input type='checkbox' value={value} />
          </div>
        ))}
      </div>
    </div>
  );
};
