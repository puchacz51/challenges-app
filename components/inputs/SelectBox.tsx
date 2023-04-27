import { HTMLAttributes } from 'react';

interface SelectBoxProps extends HTMLAttributes<HTMLSelectElement> {
  name: string;
  values: string[];
  wrapperClass?: string;
}

export const SelectBox = ({
  name,
  values,
  className = '',
  wrapperClass = '',
  ...props
}: SelectBoxProps) => {
  return (
    <div className={'border-2 border-black uppercase ' + wrapperClass}>
      <span>{name}: </span>
      <select name={name} className={'' + className} {...props}>
        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};
