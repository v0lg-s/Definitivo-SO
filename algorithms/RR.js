import { RUNNING, WAITING, BLOCKED, EXISTS } from "../process_states.js";

const RR = (processes, quantum) => {
    const timeline = [];
    const queue = processes.map(process => ({ 
        ...process, 
        executedTime: 0, 
        state: EXISTS, 
        executed: false, 
        remainingBlock: 0,
    })).sort((a, b) => a.arrival - b.arrival);
    
    const waiting = [];
    const blocked = [];
    let onCPU = null;
    let instant = 0;
    let timesUsedCPU = 0;
    

    function arrival() {
        for (let i = 0; i < queue.length; i++) {
            const process = queue[i];
            if (process.arrival === instant) {
                process.state = WAITING;
                waiting.push(process);
            }
        }
    }

    function inWaiting() {
        if (onCPU === null && waiting.length > 0) {
            const process = waiting.shift();
            process.remainingQuantum = quantum; // Reset quantum
            process.state = RUNNING;
            onCPU = process;
            inCPU();
        }
    }

    function inCPU() {
        if (onCPU !== null) {
            const process = onCPU;
            if (process.executedTime === process.executionTime) {
                // Process finishes
                process.executed = true;
                process.state = EXISTS;
                onCPU = null;
                inWaiting();
            } else if (process.block1Start === process.executedTime) {
                // Process blocks
                onCPU = null;
                process.state = BLOCKED;
                process.remainingBlock = process.block1Duration;
                blocked.push(process);
                inWaiting();
            } else if (timesUsedCPU === 0) {
                timesUsedCPU++;
                process.executedTime++;
                process.remainingQuantum--;

                if (process.remainingQuantum === 0) {
                    // Quantum expired - reinsert at END of queue
                    onCPU = null;
                    process.state = WAITING;
                    waiting.push(process); // Critical change: Add to end
                    inWaiting();
                }
            }
        }
    }
    function inBlock() {
        for (let i = blocked.length - 1; i >= 0; i--) {
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
        arrival();
        inWaiting();
        inCPU();
        inBlock();

        timeline.push(Object.fromEntries(queue.map(process => [process.name, process.state])));
        instant++;

        if (queue.every(process => process.executed) || instant === 50) break;
    }

    return timeline;
};

export default RR;