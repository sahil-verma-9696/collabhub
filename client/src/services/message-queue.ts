import type { Message } from "./get-messages";

class Queue<T> {
  private queue: T[] = [];
  private name: string;

  constructor(name: string) {
    this.name = name;
    const queue = localStorage.getItem(name);
    if (queue) this.queue = JSON.parse(queue);
    else localStorage.setItem(name, JSON.stringify(this.queue));
  }

  enqueue(item: T) {
    this.queue.push(item);
    this.sync();
  }

  dequeue(): T | undefined {
    const item = this.queue.shift();
    this.sync();
    return item;
  }

  peek(): T | undefined {
    return this.queue[0];
  }

  clear() {
    this.queue = [];
    this.sync();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  getMessages() {
    return this.queue;
  }

  private sync() {
    localStorage.setItem(this.name, JSON.stringify(this.queue));
    window.dispatchEvent(new Event("message-queue-change"));
  }
}

export const messageQueue = new Queue<Message>("messageQueue");
