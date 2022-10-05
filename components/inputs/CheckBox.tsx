import { Attributes } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';

interface CheckBoxSwitchProps {
  title: string;
  att?: Attributes;
  errors: FieldValues;
}

const CheckBoxSwitch = ({ title, errors, ...att }: CheckBoxSwitchProps) => {
  const {register} = useFormContext();
  return (
    <div className='flex items-center '>
      <span className='ml-3 text-sm  pr-3 font-medium  dark:text-gray-300'>
        {title}
      </span>
      <label
        htmlFor='default-toggle'
        className='inline-flex relative my-2 items-center cursor-pointer'>
        <input
          {...register(title)}
          type='checkbox'
          value=''
          id='default-toggle'
          className='sr-only peer'
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};
export default CheckBoxSwitch;
