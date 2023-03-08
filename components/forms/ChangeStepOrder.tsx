import {
  DndContext,
  DragMoveEvent,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ValueOf } from 'next/dist/shared/lib/constants';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormChallenge } from './AddChellenge';
import { ChallengeStepsForm } from './ChallengeSteps';
import { DraggableStep } from './DraggableStep';

export const ChangeStepOrder = ({ displayAddSteps }) => {
  const context = useFormContext<FormChallenge>();
  const { formState, getValues, setValue } = context;
  const { challengeSteps, challengStepOrder } = getValues();
  const [activeStep, setActiveStep] = useState<UniqueIdentifier>();
  const [challengeStepkeys, setChallengeStepkeys] =
    useState<UniqueIdentifier[]>(challengStepOrder);
  const { setNodeRef, active } = useDroppable({ id: 'challengeSteps' });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { delay: 1, tolerance: 1 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 1, tolerance: 1 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const dragStartHandler = ({ active }) => {
    setActiveStep(active.id);
  };
  const dragEndhandler = () => {
    setActiveStep(null);
    setValue('challengStepOrder', challengeStepkeys);
  };
  const dragMoveHandler = ({ active, over, delta }: DragMoveEvent) => {
    if (active.id != over?.id) {
      setChallengeStepkeys((images) => {
        const oldIndex = challengeStepkeys.indexOf(active.id);
        const newIndex = challengeStepkeys.indexOf(over.id);
        return arrayMove(images, oldIndex, newIndex);
      });
    }
  };
  const cancelDragHandler = useCallback(() => {
    setActiveStep(null);
  }, []);

  return (
    <DndContext
      onDragStart={dragStartHandler}
      onDragEnd={dragEndhandler}
      onDragOver={dragMoveHandler}
      onDragCancel={cancelDragHandler}
      id='challengeSteps'
      sensors={sensors}
      autoScroll={false}
      collisionDetection={rectIntersection}>
      <div
        ref={setNodeRef}
        className='flex flex-col gap-3 my-2 p-2 border-2 border-black'>
        {challengeStepkeys.map((stepKey, index) => {
          const step = challengeSteps[stepKey] as ValueOf<ChallengeStepsForm>;
          return (
            <DraggableStep
              key={index}
              id={stepKey}
              title={step.title}
              number={index}
              draggable={!!step.time}
            />
          );
        })}
      </div>

      {activeStep && (
        <DragOverlay>
          <div className='bg-red-400 py-2 border-2 px-2 border-black'>
            {challengeSteps[activeStep].title || 'UNKNOWN'}
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
};
