import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { AuthRequest } from '../types';

const COOKIE_NAME = 'antares_visitor';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const readCookie = (cookieHeader: string | undefined, name: string): string | undefined => {
  const value = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);

  return value && /^[a-f0-9-]{36}$/i.test(value) ? value : undefined;
};

export const getVisitorKey = (req: Request, res: Response): string => {
  const authRequest = req as AuthRequest;
  if (authRequest.user?.userId) {
    return `user:${authRequest.user.userId}`;
  }

  let visitorId = readCookie(req.headers.cookie, COOKIE_NAME);
  if (!visitorId) {
    visitorId = randomUUID();
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=${visitorId}; Max-Age=${COOKIE_MAX_AGE}; Path=/; HttpOnly; SameSite=Lax`
    );
  }

  return `visitor:${visitorId}`;
};
