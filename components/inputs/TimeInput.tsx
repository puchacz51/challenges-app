import { Attributes } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

interface TimeInputProps {
  name: string;
  att?: Attributes;
}
export const TimeInput = ({ name, ...att }: TimeInputProps) => {
  const { register, getFieldState } = useFormContext();
  const isTouched = getFieldState(name);

  return (
    <div className={`relative gap-1 pt-3 mt-5 ${0 && 'text-red-600'}`}>
      <input
        name={name}
        type='datetime-local'
        {...register(name)}
        className={`resize-none w-full  border-2 border-black py-3`}
      />
      <label htmlFor={name} {...att} className={`hidden`}>
        {`${name}`}
      </label>
    </div>
  );
};
