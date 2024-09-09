import { NextResponse } from 'next/server'

export function deleteCookie(res: NextResponse, cookieName: string, path: string = '/') {
  res.cookies.set(cookieName, '', { path, expires: new Date(0) })
}