interface IProject {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate?: Date | null;
  developerId: number;
}

type TProjectReq = Omit<IProject, 'id'>;

interface IProjectList {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate?: Date | null;
  projectDeveloperId: number;
  technologyId?: number | null;
  technologyName?: string | null;
}

interface IProjectTech {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate?: Date | null;
  projectDeveloperId: number;
  technologyId: number;
  technologyName: string;
}

interface ITech {
  name: string;
  id: number;
}

export { IProject, TProjectReq, IProjectList, ITech, IProjectTech };
