import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const DraggableStep = ({ id, number, title }) => {
  const { isDragging, listeners, transform, attributes, setNodeRef } =
    useSortable({
      id,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      className={`p-2 border-4 border-black ${
        isDragging && 'bg-slate-400 text-red-600'
      }`}
      style={style}>
      {title || 'unknown'} {id}
    </div>
  );
};
