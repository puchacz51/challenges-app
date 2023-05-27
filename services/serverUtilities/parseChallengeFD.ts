import IncomingForm from "formidable/Formidable";
import { NextApiRequest, NextApiResponse } from 'next';

export const parseChallengeFD = (req: NextApiRequest) =>
  new Promise((resolve, reject) => {
    const fd = new IncomingForm({ multiples: true });
    try {
      fd.parse(req, (err, fields, files) => {
        console.log(files);

        const images = Array.isArray(files['images[]'])
          ? files['images[]']
          : [files['images[]']];

        resolve(222);

        if (err) {
          reject(err);
        }
      });
    } catch (err) {
      console.log(err);

      reject('err');
    }
  });
