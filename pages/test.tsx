import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { array } from 'yup';
const LiczbaElement = ({ liczba }) => {
  const { transform, isDragging, listeners, setNodeRef, attributes } =
    useSortable({
      id: liczba,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <>
      <div
        style={style}
        {...listeners}
        {...attributes}
        className={`bg-green-600 h-[150px] w-[80px] flex items-center justify-center  ${
          isDragging && 'bg-red-600'
        } `}
        ref={setNodeRef}>
        {liczba}
      </div>
    </>
  );
};

const Test = () => {
  const [activeId, setActiveId] = useState();
  const { setNodeRef } = useDraggable({ id: 'kon' });
  const [liczby, setLiczby] = useState([1, 2, 3, 4, 5, 6, 7]);
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);
  const dragStartHandler = ({ active }) => {
    setActiveId(active.id);
  };
  const dragEndhandler = ({ active, over }) => {
    console.log(over, active);

    if (active.id != over?.id) {
      setLiczby((liczby) => {
        const oldIndex = liczby.indexOf(active.id);
        const newIndex = liczby.indexOf(over?.id);

        return arrayMove(liczby, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  return (
    <>
      <h2>testowa</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={dragStartHandler}
        onDragEnd={dragEndhandler}>
        <SortableContext items={liczby} strategy={rectSortingStrategy}>
          <div ref={setNodeRef} className='m-5 bg-slate-400 p-4'>
            {liczby.map((liczba) => (
              <LiczbaElement key={liczba} liczba={liczba} />
            ))}
          </div>
          <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
            {activeId ? <div className='w-10 h-10 bg-black'>{activeId}</div>:null}
          </DragOverlay>
        </SortableContext>
      </DndContext>
      <div></div>
    </>
  );
};

export default Test;
