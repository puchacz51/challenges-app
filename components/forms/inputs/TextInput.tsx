import {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  HTMLProps,
  useState,
} from 'react';
import { Attributes, InputHTMLAttributes, useRef } from 'react';
import {
  FieldError,
  Path,
  useFormContext,
  UseFormRegisterReturn,
  FieldValues,
} from 'react-hook-form';
// interface TextInputProps<T extends FieldValues> {
//   name: Path<T>;
//   errors: FieldError;
//   text: string;
//   att?: HTMLProps<HTMLInputElement>[];
// }

interface TextInputProps<T extends FieldValues>
  extends ComponentPropsWithoutRef<'input'> {
  name: Path<T>;
  errors: FieldError;
  text: string;
  att?: HTMLProps<HTMLInputElement>[];
}
export const FormTextInput = <T extends FieldValues>({
  name,
  errors,
  text,
  ...att
}: TextInputProps<T>) => {
  const {
    register,
    formState: { touchedFields },
    getFieldState,
  } = useFormContext<T>();
  const [isClicked, setIsClicked] = useState(false);
  const isTouched = getFieldState(name)?.isTouched || isClicked;
  const displayError = isTouched && errors;

  return (
    <div
      className={`relative gap-1 pt-3 ${
        displayError && errors && 'text-red-600'
      }`}>
      <input
        className={`outline-none border-b-2 w-full focus:border-black text-lg `}
        type='text'
        name={name as string}
        {...att}
        {...register(name)}
        onClick={() => setIsClicked(true)}
      />
      <label
        className={`absolute left-0 border-b-2 border-transparent text-lg transition  ${
          isTouched && '-translate-y-5'
        } `}
        htmlFor={name as string}>
        {`${text}`}
      </label>
      {displayError && <p>{errors?.message}</p>}
    </div>
  );
};

// const TextInput = ({ name, errors, text, ...att }: TextInputProps) => {
//   const {
//     register,
//     formState: { touchedFields },
//     getFieldState,
//   } = useFormContext<FormChallenge>();
//   const [isClicked, setIsClicked] = useState(false);
//   const isTouched = getFieldState(name).isTouched || isClicked;
//   const displayError = isTouched && errors;

//   return (
//     <div
//       className={`relative gap-1 pt-3 ${
//         displayError && errors && 'text-red-600'
//       }`}>
//       <input
//         className={`outline-none border-b-2 w-full focus:border-black text-lg `}
//         type='text'
//         name={name}
//         {...register(name)}
//         onClick={() => setIsClicked(true)}
//       />
//       <label
//         className={`absolute left-0 border-b-2 border-transparent text-lg transition  ${
//           isTouched && '-translate-y-5'
//         } `}
//         htmlFor={name}
//         {...att}>
//         {`${text}`}
//       </label>
//       {displayError && <p>{errors?.message}</p>}
//     </div>
//   );
// };
