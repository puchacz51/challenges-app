import { Attributes } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

interface TimeInputProps {
  title: string;
  att?: Attributes;
}
export const TimeInput = ({ title, ...att }: TimeInputProps) => {
  const { register } = useFormContext();
  return (
    <div className={`relative gap-1 pt-3 mt-5 ${0 && 'text-red-600'}`}>
      <input
        name={title}
		type='datetime-local'
        {...register(title)}
        className={`resize-none w-full  border-2 border-black py-3`}
      />
      <label
        htmlFor={title}
        {...att}
        className={`hidden`}>
        {`${title}`}
      </label>
    </div>
  );
};
