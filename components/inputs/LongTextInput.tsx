import { useEffect } from 'react';
import { useState } from 'react';
import { Attributes, InputHTMLAttributes, useRef } from 'react';
import {
  FieldError,
  useFormContext,
  UseFormRegisterReturn,
} from 'react-hook-form';
interface TextInputProps {
  title: string;
  name: string;
  att?: Attributes;
  errors: FieldError;
}
const LongTextInput = ({ title, errors, name, ...att }: TextInputProps) => {
  const { register, getFieldState } = useFormContext();
  const isTouched = getFieldState(name).isTouched;
  const displayError = errors&&isTouched

  return (
    <div className={`relative gap-1 pt-3 mt-5 `}>
      <textarea
        name={name}
        {...register(name)}
        className={`resize-none w-full  border-2 border-black py-3 ${
          displayError && 'text-red-600'
        }`}
      />
      <label
        htmlFor={name}
        {...att}
        className={`absolute font-bold uppercase left-1/2 -translate-y-1/2 -translate-x-1/2 border-2 rounded-lg  px-1 border-black bg-white ${
          displayError && 'text-red-600'
        }`}>
        {`${title}`}
      </label>
      {displayError && <p className='text-red-600'>{errors?.message}</p>}
    </div>
  );
};
export default LongTextInput;
