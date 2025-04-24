import {RUNNING, WAITING, EXISTS, BLOCKED} from "./process_states.js"


export const getProcessStats = (timeline) => {
    const processStats = {}

    //Incializa el objeto que guarda las estadisticas de cada proceso
    Object.entries(timeline[0]).forEach(([process, state]) => {
        processStats[process] = {
            arrival: null,
            end: null,
            responseTime: null,
            runningTime: 0,
            blockingTime: 0,
            waitingTime: 0,
        }
    })

    timeline.forEach((snapshot, instant) => {
        Object.entries(snapshot).forEach(([process, state]) => {
            
            //Obtener tiempo inicio y fin
            if (state != EXISTS && processStats[process].arrival == null){
                processStats[process].arrival = instant
            } else if (state == EXISTS && processStats[process].arrival != null && processStats[process].end == null){
                processStats[process].end = instant
            }

            //Calcular tiempo de respuesta
            if (processStats[process].arrival != null && processStats[process].responseTime == null && state != WAITING){
                processStats[process].responseTime = instant - processStats[process].arrival
            }

            //Calcular tiempo de ejecucion, bloqueo y espera
            if (state == RUNNING) processStats[process].runningTime++
            else if (state == BLOCKED) processStats[process].blockingTime++
            else if (state == WAITING) processStats[process].waitingTime++            

        })
    })

    Object.entries(processStats).forEach(([name, process]) => {
        processStats[name].return = process.end - process.arrival
        processStats[name].lostTime = process.return - process.runningTime
        processStats[name].penalty = process.return / process.runningTime
    }) 

    return processStats
}


export const getGeneralStats = (timeline) => {
    const generalStats = {
        onCPU: timeline.length - 1,
        usedCPU: 0,
    }

    //Calcular tiempo de uso CPU
    timeline.forEach(snapshot => {
        const isCPUBusy = Object.values(snapshot).some(state => state === RUNNING);
        if (isCPUBusy) generalStats.usedCPU++;
    })

    //Calcular tiempo CPU desocupada
    generalStats.idleCPU = generalStats.onCPU - generalStats.usedCPU

    //Calcular promedios
    const processStats = getProcessStats(timeline);
    const statProperties = ['return', 'runningTime', 'waitingTime', 'lostTime'];

    const averages = statProperties.reduce((result, prop) => {
        result[prop + 'Avg'] = Object.values(processStats).reduce((sum, stats) => sum + stats[prop], 0) / Object.values(processStats).length;
        return result;
    }, {});
    Object.assign(generalStats, averages);

    return generalStats
}