import { NextFunction, Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { IProject, ITech } from '../interfaces/projectsInterface';
import { client } from '../database';

const ensureProjectExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const id: number = Number(req.params.id);

  const queryString: string = `
  SELECT * FROM
    projects
  WHERE "id" = $1;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryRes: QueryResult<IProject> = await client.query(queryConfig);

  if (queryRes.rowCount === 0) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  res.locals.project = queryRes.rows[0];
  return next();
};

const ensureTechExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const { name } = req.body;

  const queryString: string = `
  SELECT * FROM technologies WHERE "name" = $1
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };
  const queryRes: QueryResult<ITech> = await client.query(queryConfig);

  if (queryRes.rowCount === 0) {
    return res.status(400).json({
      message: 'Technology not supported.',
      options: [
        'JavaScript',
        'Python',
        'React',
        'Express.js',
        'HTML',
        'CSS',
        'Django',
        'PostgreSQL',
        'MongoDB',
      ],
    });
  }
  res.locals.technologie = queryRes.rows[0].id;
  return next();
};

export { ensureProjectExist, ensureTechExists };
