import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const DraggableStep = ({ id, number, title }) => {
  const { active, listeners, transform, attributes } = useSortable({ id });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button
      className={`p-4 border-4 border-black ${active && 'bg-slate-400'}`}
      {...listeners}
      {...attributes}
      style={style}>
      {title}
    </button>
  );
};
