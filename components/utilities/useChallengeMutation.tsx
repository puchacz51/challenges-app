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
          setUploadProgress(uploadPercentage);
        },
      })
      .then((res) => {
        setUploadProgress(null);
        return res;
      })
      .catch((err) => {
        setUploadProgress;
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
