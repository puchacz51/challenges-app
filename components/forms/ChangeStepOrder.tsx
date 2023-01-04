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
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormChallenge } from './AddChellenge';
import { ChallengeStepsForm } from './ChallengeSteps';
import { DraggableStep } from './DraggableStep';

export const ChangeStepOrder = () => {
  const context = useFormContext<FormChallenge>();
  const { setValue, formState, getValues } = context;
  const challengeSteps = getValues().challengeSteps;
  const errorsKey = Object.keys(formState?.errors.challengeSteps || {});
  const [activeStep, setActiveStep] = useState();
  const [challengeStepkeys, setChallengeStepkeys] = useState(
    Object.keys(challengeSteps || {})
  );
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
  const dragEndhandler = useCallback(() => {
    setActiveStep(null);
  }, []);
  const dragMoveHandler = useCallback(
    ({ active, over, delta }: DragMoveEvent) => {
      if (active.id != over?.id) {
        setChallengeStepkeys((images) => {
          const oldIndex = challengeStepkeys.indexOf(active.id);
          const newIndex = challengeStepkeys.indexOf(over?.id);
          return arrayMove(images, oldIndex, newIndex);
        });
      }
    },

    []
  );
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
      <div ref={setNodeRef}>
        {challengeStepkeys.map((stepKey, index) => {
          const step = challengeSteps[stepKey] as ValueOf<ChallengeStepsForm>;
          return (
            <DraggableStep
              key={step.challengeId}
              id={stepKey}
              title={step.title}
              number={index}
              draggable={!!step.time}
            />
          );
        })}
      </div>
      <DragOverlay>
        <div className='bg-green-400 h-3 w-4'></div>
      </DragOverlay>
    </DndContext>
  );
};