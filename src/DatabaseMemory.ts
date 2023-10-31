import { INotify } from "./types";

export class DatabaseMemory {
  notify: INotify[];

  constructor() {
    this.notify = [];
  }
  push(newNotify: INotify) {
    this.notify.push(newNotify);
  }

  findNotifyByUserName(name: string) {
    return this.notify.filter((notifyItem) => {
      return notifyItem.users.some((user) => {
        return user.name.includes(name);
      });
    });
  }

  reset() {
    this.notify = [];
  }
}
