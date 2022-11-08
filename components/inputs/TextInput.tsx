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
  text:string
}
const TextInput = ({ title, errors, text , ...att}: TextInputProps) => {
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const { register, setValue } = useFormContext();
  return (
    <div className={`relative gap-1 pt-3 ${errors && 'text-red-600'}`}>
      <input
        className={`outline-none border-b-2 w-full focus:border-black text-lg `}
        type='text'
        name={title}
        {...register(title)}
        onClick={() => {
          setIsTouched(true);
        }}
      />
      <label
        className={`absolute left-0 border-b-2 border-transparent text-lg transition  ${
          isTouched && '-translate-y-5'
        } `}
        htmlFor={title}
        {...att}>
        {`${text}`}
      </label>
      <p>{errors?.message}</p>
    </div>
  );
};
export default TextInput;
