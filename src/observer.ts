import { INotify } from "./types";

interface IObserver {
  run: (notify: INotify) => void;
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
    this.observers.forEach((observer: IObserver) => observer.run(newNotify));
  }
}

export class Observer implements IObserver {
  name: string;
  callback: (notify: INotify) => void;

  constructor(name: string, callback: (notify: INotify) => void) {
    this.name = name;
    this.callback = callback;
  }

  run(newNotify: INotify): void {
    console.log(newNotify, this.name);
    if (newNotify.users.some((user) => user.name === this.name)) {
      console.log(`subscriber ${this.name}`);
      this.callback(newNotify);
    }
  }
}
