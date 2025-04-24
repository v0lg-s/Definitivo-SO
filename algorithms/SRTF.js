import { RUNNING, WAITING, BLOCKED, EXISTS } from "../process_states.js";

const SRTF = (processes) => {
  const timeline = [];
  const queue = processes.map(process => ({ ...process, executedTime: 0, state: EXISTS, executed: false, remainingBlock: 0 })).sort((a, b) => a.arrival - b.arrival);
  const waiting = [];
  const blocked = [];
  let onCPU = null;
  let instant = 0;
  let timesUsedCPU = 0;

  function arrival() {
    for (let i = 0; i < queue.length; i++) {
      const process = queue[i];
      if (process.arrival == instant) {
        process.state = WAITING;
        waiting.push(process);
      }
    }
  }

  function inWaiting() {
    waiting.sort((a, b) => (a.executionTime - a.executedTime) - (b.executionTime - b.executedTime));
    console.log(waiting[0]);
    for (let i = 0; i < waiting.length; i++) {
      const process = waiting[0];

      if (onCPU == null) {
        process.state = RUNNING;
        waiting.splice(i, 1);
        onCPU = process;
        inCPU();
        break; // Salimos del bucle después de encontrar el primer proceso para evitar ejecutar múltiples procesos en un mismo instante
      }
    }
  }

  function inCPU() {
    if (onCPU != null) {
      const process = onCPU;
      if (process.executedTime === process.executionTime) {
        process.executed = true;
        process.state = EXISTS;
        onCPU = null;
        inWaiting();
      } else if (process.block1Start === process.executedTime) {
        onCPU = null;
        process.state = BLOCKED;
        process.remainingBlock = process.block1Duration;
        blocked.push(process);
        inWaiting();
      } else if (timesUsedCPU == 0) {
        process.executedTime++;
        timesUsedCPU++;
      }
    }
  }

  function inBlock() {
    for (let i = 0; i < blocked.length; i++) {
      const process = blocked[i];

      if (process.executedTime === process.executionTime) {
        process.executed = true;
        process.state = EXISTS;
        blocked.splice(i, 1);
      } else if (process.remainingBlock > 0) {
        process.remainingBlock--;
      } else if (process.remainingBlock === 0) {
        process.block1Start = null;
        process.state = WAITING;
        blocked.splice(i, 1);
        waiting.push(process);
      }
    }
  }

  while (true) {
    timesUsedCPU = 0;
    waiting.sort((a, b) => (a.executionTime - a.executedTime) - (b.executionTime - b.executedTime));

    arrival();

    inWaiting();

    inCPU();

    inBlock();

    timeline.push(Object.fromEntries(queue.map(process => [process.name, process.state])));
    instant++;

    if (queue.every(process => process.executed) || instant == 50) break;
  }

  return timeline;
}

export default SRTF;