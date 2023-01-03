import {
  DndContext,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ValueOf } from 'next/dist/shared/lib/constants';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormChallenge } from './AddChellenge';
import { ChallengeStepsForm } from './ChallengeSteps';
import { DraggableStep } from './DraggableStep';

export const ChangeStepOrder = () => {
  const context = useFormContext<FormChallenge>();
  const challengeSteps = context.getValues().challengeSteps;
  const errorsKey = Object.keys(context.formState?.errors.challengeSteps || {});
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
  return (
    <DndContext
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
