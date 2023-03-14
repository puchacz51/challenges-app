import {
  Attributes,
  ChangeEvent,
  DOMAttributes,
  InputHTMLAttributes,
  MutableRefObject,
} from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

interface TimeInputProps {
  name: string;
  att?: DOMAttributes<HTMLButtonElement>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
export const TimeInput = ({ name, onChange, ...att }: TimeInputProps) => {
  const { register, getFieldState } = useFormContext();

  return (
    <div className={`relative gap-1 pt-3 mt-5 ${0 && 'text-red-600'}`}>
      <input
        name={name}
        type='datetime-local'
        {...register(name)}
        {...att}
        onChange={onChange}
        className={`resize-none w-full  border-2 border-black py-3`}
      />
      <label htmlFor={name} {...att} className={`hidden`}>
        {`${name}`}
      </label>
    </div>
  );
};
