import {
  ChangeEvent,
  DOMAttributes,
} from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

interface TimeInputProps {
  name: string;
  title?: string;
  att?: DOMAttributes<HTMLButtonElement>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
export const TimeInput = ({
  name,
  onChange,
  title,
  ...att
}: TimeInputProps) => {
  const { register, getFieldState } = useFormContext();
  return (
    <div
      className={`relative gap-1  ${
        0 && 'text-red-600'
      } flex justify-center items-center border-2 border-black `}>
      <label
        htmlFor={name}
        className=' w-1/3 min-w-min w-max-[7ch]  text-center h-fit'>
        {title}
      </label>
      <input
        name={name}
        type='datetime-local'
        {...register(name)}
        {...att}
        onChange={onChange}
        className={`resize-none border-l-2 border-black py-3 px-2 `}
      />
      <label htmlFor={name} {...att} className={`hidden`}>
        {`${name}`}
      </label>
    </div>
  );
};
