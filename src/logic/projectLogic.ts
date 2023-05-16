import { Request, Response } from 'express';
import {
  IProject,
  IProjectList,
  IProjectTech,
  TProjectReq,
} from '../interfaces/projectsInterface';
import format from 'pg-format';
import { QueryConfig, QueryResult } from 'pg';
import { client } from '../database';

const createProject = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const projectData: TProjectReq = req.body;

  const queryString: string = format(
    `
    INSERT INTO 
      projects (%I)
    VALUES 
      (%L)
    RETURNING *; 
    `,
    Object.keys(projectData),
    Object.values(projectData),
  );
  const queryRes: QueryResult<IProject> = await client.query(queryString);

  return res.status(201).json(queryRes.rows[0]);
};

const getProjectById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id: number = Number(req.params.id);

  const queryString: string = `
    SELECT 
    p."id" "projectId", 
    p."name" "projectName",
    p."description" "projectDescription",
    p."estimatedTime" "projectEstimatedTime",
    p."repository" "projectRepository",
    p."startDate" "projectStartDate",
    p."endDate" "projectEndDate",
    p."developerId" "projectDeveloperId",
    t."id" "technologyId",
    t."name" "technologyName"
    FROM 
      projects p
    LEFT JOIN projects_technologies pt
      ON p.id = pt."projectId"
    LEFT JOIN technologies t
      ON pt."technologyId" = t.id
    WHERE 
      "developerId" = $1;  
      `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryRes: QueryResult<IProjectList> = await client.query(queryConfig);

  return res.json(queryRes.rows);
};

const updateProject = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const projectData: Partial<TProjectReq> = req.body;
  const id: number = Number(req.params.id);

  if ('developerId' in projectData) {
    const devId = projectData.developerId;
    const devQueryRes = await client.query(
      'SELECT * FROM developers WHERE id = $1',
      [devId],
    );
    if (devQueryRes.rowCount === 0) {
      return res.status(404).json({ message: 'Developer not found.' });
    }
  }

  const queryString: string = format(
    `
    UPDATE
      projects p
    SET(%I) = ROW(%L)
    WHERE 
    "id" =  $1
    RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData),
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryRes: QueryResult<IProject> = await client.query(queryConfig);

  return res.json(queryRes.rows[0]);
};

const deleteProject = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id: number = Number(req.params.id);

  const queryString: string = `
  DELETE FROM projects d
  WHERE "id" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig);

  return res.status(204).send();
};

const createTech = async (req: Request, res: Response): Promise<Response> => {
  const techId: number = res.locals.technologie;
  const projectId: number = Number(req.params.id);

  const projectTechStr: string = `
  SELECT 
      *
    FROM 
      projects p
    JOIN projects_technologies pt
      ON p.id = pt."projectId"
    JOIN technologies t
      ON pt."technologyId" = t.id
    WHERE 
      p."id" = $1
      AND t."id" = $2;
  `;

  const projectTechConfig: QueryConfig = {
    text: projectTechStr,
    values: [projectId, techId],
  };

  const projectTechRes: QueryResult<IProjectTech> = await client.query(
    projectTechConfig,
  );

  if (projectTechRes.rowCount > 0) {
    res.status(409).json({
      message: 'This technology is already associated with the project',
    });
  }

  const queryString: string = `
    INSERT INTO	
      projects_technologies ("addedIn", "technologyId", "projectId")
    VALUES 
      ($1, $2, $3)
      RETURNING * ;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [new Date(), techId, projectId],
  };
  const queryRes: QueryResult<IProjectTech> = await client.query(queryConfig);

  const resQueryStr: string = `
    SELECT 
      t.id "technologyId",
      t."name" "technologyName",
      p.id "projectId",
      p."name" "projectName",
      p."description" "projectDescription",
      p."estimatedTime" "projectEstimatedTime",
      p."repository" "projectRepository",
      p."startDate" "projectStartDate",
      p."endDate" "projectStartDate"
    FROM 
      projects p  
    LEFT JOIN developers d ON p."developerId"  = d."id" 
    LEFT JOIN projects_technologies pt ON p.id = pt.id  
    LEFT JOIN technologies t ON pt."technologyId"  = t.id
    WHERE p.id = $1;
  `;
  const resQueryConfig: QueryConfig = {
    text: resQueryStr,
    values: [projectId],
  };
  const resResult: QueryResult<IProjectTech> = await client.query(
    resQueryConfig,
  );

  return res.status(201).json(resResult.rows[0]);
};

const deleteTech = async (req: Request, res: Response): Promise<Response> => {
  const { id, name } = res.locals.tech;

  const queryString: string = `
    DELETE FROM projects_technologies
    WHERE project_id = $1 AND technology_name = $2;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, name],
  };
  await client.query(queryConfig);

  return res.status(204).send();
};

export {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  createTech,
  deleteTech,
};
