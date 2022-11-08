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
  att?: Attributes;
  errors: FieldError;
}
const LongTextInput = ({ title, errors, ...att }: TextInputProps) => {
  const { register } = useFormContext();
  
  return (
    <div className={`relative gap-1 pt-3 mt-5 ${errors && 'text-red-600'}`}>
      <textarea
        name={title}
        {...register(title)}
        className={`resize-none w-full  border-2 border-black py-3`}
      />
      <label
        htmlFor={title}
        {...att}
        className={`absolute font-bold uppercase left-1/2 -translate-y-1/2 -translate-x-1/2 border-2 rounded-lg  px-1 border-black bg-white`}>
        {`${title}`}
      </label>
      <p>{errors?.message}</p>
    </div>
  );
};
export default LongTextInput;
