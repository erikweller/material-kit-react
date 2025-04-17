import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const start = Date.now();
  // Simulate CPU work for ~2 seconds
  while (Date.now() - start < 2000) {
    Math.sqrt(Math.random() * 9999999);
  }
  res.status(200).send('Stressed!');
}
