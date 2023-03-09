import { Attributes, useId } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';

interface CheckBoxSwitchProps {
  name: string;
  att?: Attributes;
  errors: FieldValues;
}
interface SimpleCheckBoxProps {
  name: string;
  setValue: Function;
  checked: boolean;
}

const CheckBoxSwitch = ({ name, errors, ...att }: CheckBoxSwitchProps) => {
  const { register } = useFormContext();
  return (
    <div className='flex items-center '>
      <span className='ml-3 text-sm  pr-3 font-medium  dark:text-gray-300'>
        {name}
      </span>
      <label
        htmlFor={name}
        className='inline-flex relative my-2 items-center cursor-pointer'>
        <input
          {...register(name)}
          type='checkbox'
          value=''
          id={name}
          className='sr-only peer'
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};
export const SimpleCheckBoxSwitch = ({
  name,
  setValue,
  checked,
}: SimpleCheckBoxProps) => {
  const id = useId();
  return (
    <div className='flex items-center '>
      <span className='ml-3 text-sm  pr-3 font-medium  dark:text-gray-300'>
        {name}
      </span>
      <label
        htmlFor={id}
        className='inline-flex relative my-2 items-center cursor-pointer'>
        <input
          onChange={() => setValue()}
          type='checkbox'
          value='1'
          checked={checked}
          id={id}
          className='sr-only peer'
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};

export default CheckBoxSwitch;
