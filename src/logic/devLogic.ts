import { Request, Response } from 'express';
import {
  IDev,
  IDevInfos,
  TDevInfos,
  TDevReq,
} from '../interfaces/devInterface';
import format from 'pg-format';
import { QueryConfig, QueryResult } from 'pg';
import { client } from '../database';

const registerDev = async (req: Request, res: Response): Promise<Response> => {
  const devData: TDevReq = req.body;

  const queryString: string = format(
    `
    INSERT INTO 
      developers (%I)
    VALUES 
      (%L)
    RETURNING *;
    `,
    Object.keys(devData),
    Object.values(devData),
  );

  const queryRes: QueryResult<IDev> = await client.query(queryString);

  return res.status(201).json(queryRes.rows[0]);
};

const registerDevInfo = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const devInfoData: TDevInfos = req.body;
  devInfoData.developerId = Number(req.params.id);
  const id: number = (devInfoData.developerId = Number(req.params.id));
  const devOS: string[] = ['Windows', 'MacOS', 'Linux'];

  const { preferredOS }: TDevInfos = req.body;

  const queryDevfInfoExist = `
    SELECT * FROM
      developer_infos
    WHERE "developerId" = $1
  `;
  const queryDevfInfoExistConfig: QueryConfig = {
    text: queryDevfInfoExist,
    values: [id],
  };
  const DevfInfoExistRes: QueryResult<IDevInfos> = await client.query(
    queryDevfInfoExistConfig,
  );

  if (DevfInfoExistRes.rowCount > 0) {
    return res.status(409).json({ message: 'Developer infos already exists.' });
  }
  if (!devOS.includes(preferredOS)) {
    return res.status(400).json({
      message: `Invalid OS option.`,
      options: devOS,
    });
  }

  const queryString: string = format(
    `
    INSERT INTO 
      developer_infos (%I)
    VALUES 
      (%L)
    RETURNING *;
    `,
    Object.keys(devInfoData),
    Object.values(devInfoData),
  );

  const queryRes: QueryResult<IDevInfos> = await client.query(queryString);

  return res.status(201).json(queryRes.rows[0]);
};

const getDevById = async (req: Request, res: Response): Promise<Response> => {
  const dev: IDev = res.locals.developer;

  const queryString: string = `
  SELECT 
    d."id" "developerId",
    d."name" "developerName",
    d."email"  "developerEmail",
    di."developerSince" "developerInfoDeveloperSince",
    di."preferredOS" "developerInfoPreferredOS"
  FROM 
    developers d
  LEFT JOIN 
    developer_infos di ON di."developerId" = d."id"
  WHERE d."id" = $1; 
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [dev.id],
  };
  const queryRes: QueryResult<IDev> = await client.query(queryConfig);

  return res.json(queryRes.rows[0]);
};

const updateDev = async (req: Request, res: Response): Promise<Response> => {
  const devData: Partial<TDevReq> = req.body;
  const { id } = res.locals.developer;

  const queryString: string = format(
    `
    UPDATE
      developers d
    SET(%I) = ROW(%L)
      WHERE "id" = $1
    RETURNING *;
    `,
    Object.keys(devData),
    Object.values(devData),
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryRes: QueryResult<IDev> = await client.query(queryConfig);

  return res.json(queryRes.rows[0]);
};

const deleteDev = async (req: Request, res: Response): Promise<Response> => {
  const { id } = res.locals.developer;

  const queryString: string = `
  DELETE FROM developers d
  WHERE "id" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig);

  return res.status(204).send();
};

export { registerDev, registerDevInfo, getDevById, updateDev, deleteDev };
