
//Entrada: Array de objetos cada uno representa un proceso con sus atributos

export const processes = [
    { name: "A", arrival: 0, executionTime: 6, block1Start: 3, block1Duration: 2, block2Start: 40, block2Duration: 0 },
    { name: "B", arrival: 1, executionTime: 8, block1Start: 1, block1Duration: 3, block2Start: 40, block2Duration: 0 },
    { name: "C", arrival: 2, executionTime: 7, block1Start: 5, block1Duration: 1, block2Start: 40, block2Duration: 0 },
    { name: "D", arrival: 4, executionTime: 3, block1Start: 0, block1Duration: 0, block2Start: 40, block2Duration: 0 },
    { name: "E", arrival: 6, executionTime: 9, block1Start: 2, block1Duration: 4, block2Start: 40, block2Duration: 0 },
    { name: "F", arrival: 6, executionTime: 2, block1Start: 0, block1Duration: 0, block2Start: 40, block2Duration: 0 },
];


//Salida: Array de objetos que representa la linea de tiempo.
//Cada elemento del array es un instante de tiempo representado por un objeto que contiene todos los procesos y sus estados en ese instante

import {EXISTS, WAITING, RUNNING, BLOCKED} from "./process_states.js"

export const SJFOutput = [
    {"A": RUNNING, "B": EXISTS, "C": EXISTS, "D": EXISTS, "E": EXISTS, "F": EXISTS},
    {"A": RUNNING, "B": WAITING, "C": EXISTS, "D": EXISTS, "E": EXISTS, "F": EXISTS},
    {"A": RUNNING, "B": WAITING, "C": WAITING, "D": EXISTS, "E": EXISTS, "F": EXISTS},
    {"A": BLOCKED, "B": WAITING, "C": RUNNING, "D": EXISTS, "E": EXISTS, "F": EXISTS},
    {"A": BLOCKED, "B": WAITING, "C": RUNNING, "D": WAITING, "E": EXISTS, "F": EXISTS},
    {"A": WAITING, "B": WAITING, "C": RUNNING, "D": WAITING, "E": EXISTS, "F": EXISTS},
    {"A": WAITING, "B": WAITING, "C": RUNNING, "D": WAITING, "E": WAITING, "F": WAITING},
    {"A": WAITING, "B": WAITING, "C": RUNNING, "D": WAITING, "E": WAITING, "F": WAITING},
    {"A": WAITING, "B": WAITING, "C": BLOCKED, "D": WAITING, "E": WAITING, "F": RUNNING},
    {"A": WAITING, "B": WAITING, "C": WAITING, "D": WAITING, "E": WAITING, "F": RUNNING},
    {"A": WAITING, "B": WAITING, "C": WAITING, "D": RUNNING, "E": WAITING, "F": EXISTS},
    {"A": WAITING, "B": WAITING, "C": WAITING, "D": RUNNING, "E": WAITING, "F": EXISTS},
    {"A": WAITING, "B": WAITING, "C": WAITING, "D": RUNNING, "E": WAITING, "F": EXISTS},
    {"A": RUNNING, "B": WAITING, "C": WAITING, "D": EXISTS, "E": WAITING, "F": EXISTS},
    {"A": RUNNING, "B": WAITING, "C": WAITING, "D": EXISTS, "E": WAITING, "F": EXISTS},
    {"A": RUNNING, "B": WAITING, "C": WAITING, "D": EXISTS, "E": WAITING, "F": EXISTS},
    {"A": EXISTS, "B": WAITING, "C": RUNNING, "D": EXISTS, "E": WAITING, "F": EXISTS},
    {"A": EXISTS, "B": WAITING, "C": RUNNING, "D": EXISTS, "E": WAITING, "F": EXISTS},
    {"A": EXISTS, "B": RUNNING, "C": EXISTS, "D": EXISTS, "E": WAITING, "F": EXISTS},
    {"A": EXISTS, "B": BLOCKED, "C": EXISTS, "D": EXISTS, "E": RUNNING, "F": EXISTS},
    {"A": EXISTS, "B": BLOCKED, "C": EXISTS, "D": EXISTS, "E": RUNNING, "F": EXISTS},
    {"A": EXISTS, "B": BLOCKED, "C": EXISTS, "D": EXISTS, "E": BLOCKED, "F": EXISTS},
    {"A": EXISTS, "B": RUNNING, "C": EXISTS, "D": EXISTS, "E": BLOCKED, "F": EXISTS},
    {"A": EXISTS, "B": RUNNING, "C": EXISTS, "D": EXISTS, "E": BLOCKED, "F": EXISTS},
    {"A": EXISTS, "B": RUNNING, "C": EXISTS, "D": EXISTS, "E": BLOCKED, "F": EXISTS},
    {"A": EXISTS, "B": RUNNING, "C": EXISTS, "D": EXISTS, "E": WAITING, "F": EXISTS},
    {"A": EXISTS, "B": RUNNING, "C": EXISTS, "D": EXISTS, "E": WAITING, "F": EXISTS},
    {"A": EXISTS, "B": RUNNING, "C": EXISTS, "D": EXISTS, "E": WAITING, "F": EXISTS},
    {"A": EXISTS, "B": RUNNING, "C": EXISTS, "D": EXISTS, "E": WAITING, "F": EXISTS},
    {"A": EXISTS, "B": EXISTS, "C": EXISTS, "D": EXISTS, "E": RUNNING, "F": EXISTS},
    {"A": EXISTS, "B": EXISTS, "C": EXISTS, "D": EXISTS, "E": RUNNING, "F": EXISTS},
    {"A": EXISTS, "B": EXISTS, "C": EXISTS, "D": EXISTS, "E": RUNNING, "F": EXISTS},
    {"A": EXISTS, "B": EXISTS, "C": EXISTS, "D": EXISTS, "E": RUNNING, "F": EXISTS},
    {"A": EXISTS, "B": EXISTS, "C": EXISTS, "D": EXISTS, "E": RUNNING, "F": EXISTS},
    {"A": EXISTS, "B": EXISTS, "C": EXISTS, "D": EXISTS, "E": RUNNING, "F": EXISTS},
    {"A": EXISTS, "B": EXISTS, "C": EXISTS, "D": EXISTS, "E": RUNNING, "F": EXISTS},
]