import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

export const usePostChallengeFormData = () => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const postFn = (challengeFormData: FormData) =>
    axios
      .post('/api/challenge', challengeFormData, {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const uploadedBytes = progressEvent.loaded;
          const totalBytes = progressEvent.total;
          const uploadPercentage = Math.round(
            (uploadedBytes / totalBytes) * 100
          );
          if (uploadPercentage === 100) {
            setUploadProgress(null);
          } else {
            setUploadProgress(uploadPercentage);
          }
        },
        transformRequest: (formData) => {
          for (let to of formData) {
            console.log(to);
          }

          return formData;
        },
      })
      .then((res) => {
        setUploadProgress(null);
        return res;
      })
      .catch((err) => {
        console.log(err);
        setUploadProgress(null);
      });

  return { postFn, uploadProgress };
};

export const useAddChallengeMutation = () => {
  const queryClient = useQueryClient();
  const { postFn, uploadProgress } = usePostChallengeFormData();

  const mutateParam = useMutation({
    mutationFn: postFn,
  });
  return { ...mutateParam, uploadProgress };
};

const deleteChallenge = (challengeId: string) =>
  axios.delete(`api/challenge/${challengeId}`);

export const useDeleteChallengeMutation = () => {
  return useMutation({ mutationFn: deleteChallenge });
};
