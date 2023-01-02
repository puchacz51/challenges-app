import {
  DndContext,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormChallenge } from './AddChellenge';

export const ChangeStepOrder = () => {
  const context = useFormContext<FormChallenge>();
  const errorsKey = Object.keys(context.formState?.errors.challengeSteps || {});
  const [tempChallengeSteps, setTempChallengeSteps] = useState(
    context.getValues().challengeSteps.
  );

  const { setNodeRef } = useDroppable({ id: 'challengeSteps' });
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
      <div>{tempChallengeSteps?.map}</div>
    </DndContext>
  );
};
