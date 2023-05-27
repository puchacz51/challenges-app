import { error } from 'console';
import formidable, { IncomingForm } from 'formidable';
import { fstat, readFileSync, write, writeFile, writeFileSync } from 'fs';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
interface TestRequest extends NextApiRequest {
  body: {
    name: string;
  };
}
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: TestRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const data = await parseFD(req);

      writeFileSync(
        'C:/Users/jur-s/Downloads/Lab3_client/image.jpg',
        readFileSync(data[0].filepath)
      );
    } catch (err) {
      console.log('try errot', err);
    }
    res.statusCode = 200;
    res.end('ok');
  }
};
export default handler;

const parseFD = (req: NextApiRequest) =>
  new Promise<formidable.File[]>((resolve, reject) => {
    const fd = new IncomingForm({ multiples: true });
    try {
      fd.parse(req, (err, fields, files) => {
        console.log(files, fields);

        const images = Array.isArray(files['images[]'])
          ? files['images[]']
          : [files['images[]']];

        resolve(images);

        if (err) {
          reject(err);
        }
      });
    } catch (err) {
      console.log(err);

      reject('err');
    }
  });
