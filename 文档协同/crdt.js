//实现一个基于操作的 CRDT
// 基于操作的 CRDT 实现，前提条件是要定义操作(op)
/**
 * {
 *   op: 'insert',
 *   pos: 0,
 *   value: 'a'
 * }
 *
 * {
 *   op: 'delete',
 *   pos: 0,
 * }
 *
 * {
 *   op: 'update',
 *   pos: 0,
 *   value: 'b'
 * }
 */

//"" -> "a" -> "" -> "b"

const ops = [];
ops.push({
  op: "insert",
  pos: 0,
  value: "a",
});
ops.push({
  op: "delete",
  pos: 0,
});
ops.push({
  op: "update",
  pos: 0,
  value: "b",
});

class OpBasedORSet {
  constructor() {
    this.state = new Set(); //内部状态
    this.history = new Set(); //用于记录已应用的操作，避免重复
  }

  //state_zero: 内部状态的初始值
  static state_zero() {
    return new Set();
  }

  //添加操作的原子操作
  add(element) {
    const op = { type: "add", element };
    if (this.check_state(this.state, op)) {
      this.apply_op(op);
    }
  }

  //删除操作的原子操作
  remove(element) {
    const op = { type: "remove", element };
    if (this.check_state(this.state, op)) {
      this.apply_op(op);
    }
  }

  //apply_op(state,op)：在state上应用op的函数
  apply_op(op) {
    const key = JSON.stringify(op);
    if (!this.history.has(key)) {
      if (op.type === "add") {
        this.state.add(op.element);
      } else if (op.type === "remove") {
        this.state.delete(op.element);
      }
      this.history.add(key); //记录操作历史
    }
  }

  //check_state(state,op)：检查操作的前置条件
  check_state(state, op) {
    if (op.type === "remove") {
      return state.has(op.element); // 只有当元素存在时才允许修改
    }
    return true; //添加操作始终允许
  }

  //获取集合当前内容
  getElements() {
    return Array.from(this.state);
  }
}

const orsetA = new OpBasedORSet();
const orsetB = new OpBasedORSet();

orsetA.add("apple");
orsetB.add("apple");

orsetA.remove("apple");

console.log(orsetA.getElements()); //[""]
console.log(orsetB.getElements()); //["apple"]

orsetB.apply_op({ type: "remove", element: "apple" });
console.log(orsetB.getElements()); //[]

console.log(orsetA.history);
console.log(orsetB.history);
