import { INotify } from "./types";

interface IObserver {
  run: (notify: INotify) => void;
  getName: () => string;
}

export class Subscriber {
  observers: IObserver[];

  constructor() {
    this.observers = [];
  }

  subscribe(observer: IObserver): void {
    this.observers.push(observer);
  }

  unsubscribe(observerToRemove: IObserver): void {
    this.observers = this.observers.filter((observer: IObserver): boolean => observer !== observerToRemove);
  }

  notifyAll(newNotify: INotify): void {
    this.observers.forEach((observer: IObserver) => {
      observer.run(newNotify);
    });
  }
}

export class Observer implements IObserver {
  name: string;
  callback: (notify: INotify) => void;
  type: "ws" | "sse";

  constructor(name: string, type: "ws" | "sse", callback: (notify: INotify) => void) {
    this.name = name;
    this.type = type;
    this.callback = callback;
  }

  getName() {
    return this.name + " - " + this.type;
  }
  run(newNotify: INotify): void {
    if (newNotify.users.some((user) => user.name === this.name)) {
      this.callback(newNotify);
    }
  }
}
