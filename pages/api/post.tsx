import next, { NextApiHandler } from 'next';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};
const handler: NextApiHandler = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    console.log(err, fields, files);
  });
  res.status(300).json('jd');
};

export default handler;
