import { WorkListItem } from './workListItem.mjs';

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  addOnHead(val) {
    this.size++;
    const listItem = new ListItem(val);
    if (!this.head) {
      this.head = listItem;
      this.tail = listItem;
      return;
    }
    listItem.setNext(this.head);
    this.head = listItem;
  }

  addOnTail(val) {
    this.size++;
    const listItem = new ListItem(val);
    if (!this.head) {
      this.head = listItem;
      this.tail = listItem;
      return;
    }
    this.tail.setNext(listItem);
    this.tail = listItem;
  }

  pop() {
    if (this.isEmpty())
      return null;

    const listItem = this.head;
    this.head = listItem.next;
    if (!this.head)
      this.tail = null;

    this.size--;

    return listItem.val;
  }

  clear() {
    this.size = 0;
    this.tail = null;
    this.head = null;
  }

  isEmpty() {
    return this.head === null;
  }

  length() {
    return this.size;
  }

  toObject() {
    const list = [];
    let act = this.head;
    while (act) {
      list.push(act.val.toObject());
      act = act.next;
    }
    return list;
  }

  static fromObject(list) {
    const workList = new LinkedList();
    for (const listElement of list) {
      workList.addOnTail(WorkListItem.fromObject(listElement));
    }
    return workList;
  }
}

class ListItem {
  constructor(val) {
    this.next = null;
    this.val = val;
  }

  setNext(listItem) {
    this.next = listItem;
  }
}

export { LinkedList };