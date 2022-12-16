import { DndProvider, DragPreviewImage, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { string } from 'yup/lib/locale';
const LiczbaElement = ({ liczba }) => {
  const [collected, drag, dragPreview] = useDrag(() => ({
    type: 'element',
	collect: (monitor)=>({isDragging:monitor.isDragging()})

  }));
  const {isDragging}= collected

  return (
    <>
      {' '}
      <div
        className={`bg-green-600 h-[150px] w-[80px] ${isDragging} `}
        ref={drag}>
        {liczba}
      </div>
      <DragPreviewImage connect={dragPreview} src={<>oo</>} />
    </>
  );
};

const Test = () => {
  const liczby = [1, 2, 3, 4, 5, 6, 7];
  return (
    <>
      <h2>testowa</h2>
      <DndProvider backend={HTML5Backend}>
        <div className='m-5 bg-slate-400 p-4'>
          {liczby.map((liczba) => (
            <LiczbaElement key={liczba} liczba={liczba} />
          ))}
        </div>
      </DndProvider>

      <div></div>
    </>
  );
};

export default Test;
