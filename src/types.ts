export interface IUsers {
  name: string;
}

export type INotify = {
  title: string;
  content: string;
  users: IUsers[];
};
