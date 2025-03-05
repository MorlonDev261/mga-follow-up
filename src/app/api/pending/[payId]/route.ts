import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { payId } = req.query
  res.end(`Post: ${payId}`)
}
