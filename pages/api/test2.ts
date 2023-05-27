import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: 2000000,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    let requestBodySize = 0;
    req.on('data', (chunk) => {
      console.log(1);

      requestBodySize += chunk.length;
    });

    req.on('end', () => {
      console.log('Rozmiar danych żądania:', requestBodySize);
      res.end('Rozmiar danych żądania obliczony');
    });
  } else {
    res.end('Obsługiwane są tylko żądania POST');
  }
  //   res.end('unsupported method' + req.method);
};

export default handler;
