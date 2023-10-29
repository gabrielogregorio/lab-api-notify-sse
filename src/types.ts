export interface IUsers {
  name: string;
}

export type INotify = {
  id: string;
  title: string;
  content: string;
  users: IUsers[];
};
