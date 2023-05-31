import { blob } from 'stream/consumers';
import {
  ChallengeStepsForm,
  FormChallenge,
} from '../../types/challengeFormTypes';
import { ChallengeStepInsert } from '../../types/challengeTypes';

export const readFileAsText = (file: File) => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result as ArrayBuffer;
      resolve(content); // Przekazanie wczytanej zawartości jako wynik promisy
    };

    reader.onerror = (event) => {
      reader.abort();
      reject(new Error('Błąd wczytywania pliku.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const createChallengeFormData = async (challengeData: FormChallenge) => {
  const challengeFormData = new FormData();

  const {
    category,
    description,
    challengStepOrder,
    images,
    isPublic,
    title,
    userId,
    challengeSteps,
    endTime,
    startTime,
  } = challengeData;
  challengeFormData.append('title', title);
  challengeFormData.append('description', description);
  challengeFormData.append('category', category);
  challengeFormData.append('userId', userId);
  challengeFormData.append('isPublic', isPublic + '');
  challengeFormData.append('endTime', endTime);
  challengeFormData.append('startTime', startTime);

  const imagesArray = Array.from(images);
  let imageIdx = 0;

  for (let img of imagesArray) {
    try {
      const imgText = await readFileAsText(img);
      const imageFile = new Blob([imgText], { type: img.type });
      challengeFormData.append('images[]', imageFile, 'image.jpg');
    } catch (e) {}
  }
  if (challengeSteps && Object.keys(challengeSteps).length) {
    const orderedChallengeSteps = challengStepOrder.map((stepIndex, i) => {
      const { time, title, completed, description } = challengeSteps[stepIndex];
      return {
        completed,
        description,
        stepId: i,
        time,
        title,
      } as Omit<ChallengeStepInsert, 'challengeId'>;
    });
    challengeFormData.append(
      'challengeSteps',
      JSON.stringify(orderedChallengeSteps)
    );
  }
  return challengeFormData;
};
