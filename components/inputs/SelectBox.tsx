import { title } from 'process';
import { HTMLAttributes } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

interface SelectBoxProps extends HTMLAttributes<HTMLSelectElement> {
  title: string;
  values: string[];
  wrapperClass?: string;
}
interface SelectBoxFormProps extends SelectBoxProps {
  name: string;
  errors: FieldError;
}
export const SelectBox = ({
  title,
  values,
  className = '',
  wrapperClass = '',
  ...props
}: SelectBoxProps) => {
  return (
    <div
      className={
        'border-2 border-black uppercase flex items-center my-2' + wrapperClass
      }>
      <span className='px-3 py-1 border-r-2 border-black font-bold'>
        {title}{' '}
      </span>
      <select name={title} className={'max-w-[20ch]' + className} {...props}>
        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export const SelectBoxForm = ({
  title,
  name,
  values,
  errors,
  className = '',
  wrapperClass = '',
  ...props
}: SelectBoxFormProps) => {
  const { register, getFieldState, trigger } = useFormContext();
  const isTouched = getFieldState(name).isTouched;
  const displayError = errors && isTouched;

  return (
    <div
      className={
        `border-2 border-black uppercase flex items-center mb-[1.2em] flex-wrap relative ${
          displayError && 'text-red-600'
        }` + wrapperClass
      }>
      {displayError && (
        <span className=' block w-full text-red-600 text-center absolute top-[110%]   '>
          {errors.message}
        </span>
      )}

      <span className='px-3 py-1 border-r-2 border-black font-bold '>
        {title}{' '}
      </span>
      <select
        name={name}
        {...register(name)}
        className={'max-w-[20ch]' + className}
        {...props}>
        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};
