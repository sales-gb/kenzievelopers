interface IDev {
  id: number;
  name: string;
  email: string;
}
type TDevReq = Omit<IDev, 'id'>;

interface IDevList {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
}

interface IDevInfos {
  id: number;
  developerSince: Date;
  preferredOS: string;
  developerId: number;
}

type TDevInfos = Omit<IDevInfos, 'id'>;

export { IDev, TDevReq, IDevList, IDevInfos, TDevInfos };
