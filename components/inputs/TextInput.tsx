import { useEffect } from 'react';
import { useState } from 'react';
import { Attributes, InputHTMLAttributes, useRef } from 'react';
import {
  FieldError,
  useFormContext,
  UseFormRegisterReturn,
} from 'react-hook-form';
interface TextInputProps {
  name: string;
  att?: Attributes;
  errors: FieldError;
  text: string;
}
const TextInput = ({ name, errors, text, ...att }: TextInputProps) => {
  const {
    register,
    setValue,
    formState: { touchedFields },
  } = useFormContext();

  const [isTouched, setIsTouched] = useState(touchedFields[name]);
  const displayError = isTouched && errors;
  return (
    <div
      className={`relative gap-1 pt-3 ${
        displayError && errors && 'text-red-600'
      }`}>
      <input
        className={`outline-none border-b-2 w-full focus:border-black text-lg `}
        type='text'
        name={name}
        {...register(name)}
        onClick={() => setIsTouched(true)}
      />
      <label
        className={`absolute left-0 border-b-2 border-transparent text-lg transition  ${
          isTouched && '-translate-y-5'
        } `}
        htmlFor={name}
        {...att}>
        {`${text}`}
      </label>
      {displayError && <p>{errors?.message}</p>}
    </div>
  );
};

export default TextInput;
