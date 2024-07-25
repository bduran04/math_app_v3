import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest } from 'next/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly`);
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', `${name}=; Path=/; HttpOnly; Max-Age=0`);
        },
      },
    }
  );

  if (req.method === 'POST') {
    const { user_id, equation } = req.body;

    const { data, error } = await supabase
      .from('study_guide')
      .insert([{ user_id, equation }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
