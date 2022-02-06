import type { NextApiRequest, NextApiResponse } from 'next'
type Data = {}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>) {
        
    res.status(200).json({ data: 'future map api...' })
}