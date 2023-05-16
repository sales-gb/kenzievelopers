import { NextFunction, Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { IDev } from '../interfaces/devInterface';
import { client } from '../database';

const ensureDevExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  let id: number = Number(req.params.id);

  if (req.route.path === '/projects' && req.method === 'POST') {
    id = req.body.developerId;
  }

  const queryString: string = `
    SELECT * FROM
      developers
    WHERE "id" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryRes: QueryResult<IDev> = await client.query(queryConfig);

  if (queryRes.rowCount === 0) {
    return res.status(404).json({ message: 'Developer not found.' });
  }
  res.locals.developer = queryRes.rows[0];

  return next();
};

const ensureEmailExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const email: string = req.body.email;

  const queryString: string = `
    SELECT * FROM
      developers
    WHERE "email" = $1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };
  const queryRes: QueryResult<IDev> = await client.query(queryConfig);

  if (queryRes.rowCount > 0) {
    return res.status(409).json({ message: 'Email already exists!' });
  }
  res.locals.devMail = queryRes.rows[0];

  return next();
};

export { ensureDevExists, ensureEmailExist };
