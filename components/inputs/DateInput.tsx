import {
  HTMLAttributes,
  HtmlHTMLAttributes,
  InputHTMLAttributes,
  useId,
} from 'react';
interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}
export const DateInput = ({ name, ...props }: DateInputProps) => {
  const id = useId();
  return (
    <div className='flex flex-row items-center space-y-1 justify-between'>
      <label
        htmlFor={`date${id}`}
        className='text-gray-600 text-sm font-medium mb-1'>
        {name}
      </label>
      <input
        {...props}
        type='datetime-local'
        name={`date${id}`}
        className='border-2 rounded-md px-4 py-2 focus:outline-none'
      />
    </div>
  );
};
