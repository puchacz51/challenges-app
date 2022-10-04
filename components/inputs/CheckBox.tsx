import { Attributes } from 'react';
import { FieldValues, useForm, UseFormRegisterReturn } from 'react-hook-form';

interface CheckBoxSwitchProps {
  title: string;
  att?: Attributes;
  errors: FieldValues;
}

const CheckBoxSwitch = ({ title, errors, ...att }: CheckBoxSwitchProps) => {
  const register = useForm();
  return (
    <div className={` gap-1 pt-3 ${errors && 'text-red-600'}`}>
      <label htmlFor={title}>{title}</label>
      <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
      <input
        type='checkbox'
        className='sr-only peer'
        name={title}
        {...register}
      />
    </div>
  );
};
export default CheckBoxSwitch;
