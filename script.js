import {EXISTS, WAITING, RUNNING, BLOCKED} from "./process_states.js"
import { SJFOutput, processes } from "./data_sample.js";
import { getGeneralStats, getProcessStats } from "./statistics.js";
import FCFS from "./algorithms/FCFS.js"
import SJF from "./algorithms/SJF.js";
import SRTF from "./algorithms/SRTF.js";
import RR from "./algorithms/RR.js";

var timeline = SJFOutput
var tableData = processes


/* ---------------------------- Agregar, Editar y Eliminar de Tabla de Procesos ------------------------------------- */

$(document).ready(function(){   
    $('[data-toggle="tooltip"]').tooltip();

    var actions = '<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>' +
                  '<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
                  '<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>';

    $(".add-new").click(function(){
        $(this).attr("disabled", "disabled");
        var index = $("#process-table tbody tr:last-child").index();
        var row = '<tr>' +
                  '<td><input type="text" class="form-control" name="name" id="name"></td>' +
                  '<td><input type="text" class="form-control" name="arrival" id="arrival"></td>' +
                  '<td><input type="text" class="form-control" name="executionTime" id="executionTime"></td>' +
                  '<td><input type="text" class="form-control" name="block1Start" id="block1Start"></td>' +
                  '<td><input type="text" class="form-control" name="block1Duration" id="block1Duration"></td>' +
                  '<td><input type="text" class="form-control" name="block2Start" id="block2Start"></td>' +
                  '<td><input type="text" class="form-control" name="block2Duration" id="block2Duration"></td>' +
                  '<td>' + actions + '</td>' +
                  '</tr>';
        $("#process-table").append(row);
        $("#process-table tbody tr").eq(index + 1).find(".add, .edit").toggle();
        $('[data-toggle="tooltip"]').tooltip();
    });

    $(document).on("click", ".add", function(){
        var empty = false;
        var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
            if(!$(this).val()){
                $(this).addClass("error");
                empty = true;
            } else {
                $(this).removeClass("error");
            }
        });
        $(this).parents("tr").find(".error").first().focus();
        if(!empty){
            input.each(function(){
                $(this).parent("td").html($(this).val());
            });
            $(this).parents("tr").find(".add, .edit").toggle();
            $(".add-new").removeAttr("disabled");
            updateTableData();
        }
    });

    $(document).on("click", ".edit", function(){
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
            $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
        });
        $(this).parents("tr").find(".add, .edit").toggle();
        $(".add-new").attr("disabled", "disabled");
    });

    $(document).on("click", ".delete", function(){
        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
        updateTableData();
    });

    function loadTableData() {
        for (var i = 0; i < tableData.length; i++) {
            var row = '<tr>' +
                      '<td>' + tableData[i].name + '</td>' +
                      '<td>' + tableData[i].arrival + '</td>' +
                      '<td>' + tableData[i].executionTime + '</td>' +
                      '<td>' + tableData[i].block1Start + '</td>' +
                      '<td>' + tableData[i].block1Duration + '</td>' +
                      '<td>' + tableData[i].block2Start + '</td>' +
                      '<td>' + tableData[i].block2Duration + '</td>' +
                      '<td>' + actions + '</td>' +
                      '</tr>';
            $("#process-table tbody").append(row);
        }
    }

    function updateTableData() {
        tableData = [];
        $("#process-table tbody tr").each(function() {
            var rowData = {
                name: $(this).find("td:eq(0)").text(),
                arrival: +$(this).find("td:eq(1)").text(),
                executionTime: +$(this).find("td:eq(2)").text(),
                block1Start: +$(this).find("td:eq(3)").text(),
                block1Duration: +$(this).find("td:eq(4)").text(),
                block2Start: +$(this).find("td:eq(5)").text(),
                block2Duration: +$(this).find("td:eq(6)").text()
            };
            tableData.push(rowData);
            console.log(tableData);
        });
    }

    loadTableData();
});

/* ------------------------------------------------------------------------------------------------------------------ */


/* -------------------------------------------- Seleccion de algoritmo y funcion iniciar ------------------------------*/

const selectAlgorithm = document.getElementById("select-algorithm")
const btnStart = document.getElementById("btn-start")

selectAlgorithm.addEventListener('change', () => {
    document.getElementById('quantum-container').style.display = 
        selectAlgorithm.value === 'RR' ? 'block' : 'none';
});

btnStart.addEventListener("click", () => {
    const algorithm = selectAlgorithm.value;
    let quantum = 2;
    quantum = parseInt(document.getElementById('quantum').value) || 2;
        if (quantum < 1) {
            alert("Quantum debe ser mayor que 0");
            return;
        }
    
    switch(algorithm){
        case "FCFS":
            timeline = FCFS(tableData);
            break;
        case "SJF":
            timeline = SJF(tableData);
            break;
        case "SRTF":
            timeline = SRTF(tableData);
            break;
        case "RR": 
            timeline = RR(tableData, quantum);
            break;
    }

    //Agregar el instante de tiempo final
    timeline.push({})
    Object.entries(timeline[0]).forEach(([process, state]) => {
        timeline[timeline.length-1][process] = EXISTS
    })

    showGraph()
    showStats()
})

/* --------------------------------------------------------------------------------------------------------------------*/


/* --------------------------------------------------- Mostrar grafico algoritmo ----------------------------------------- */

const showGraph = () => {
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = `
    <div class="timeline" id="timeline">
        <div class="axis axis-x"></div>
        <div class="axis axis-y"></div>
        <h3>Tiempo</h3>
    </div>`
    const divTimeline = document.getElementById('timeline');

    //Agregar label proceso
    const processLabelsContainer = document.createElement("div")
    processLabelsContainer.classList.add('process-label-container');
    Object.entries(timeline[0]).forEach(([process, state]) => {
        const processLabel = document.createElement('div');
        processLabel.classList.add('process-label');
        processLabel.textContent = process;
        processLabelsContainer.appendChild(processLabel);
    })
    timelineContainer.insertBefore(processLabelsContainer, timelineContainer.firstChild)


    timeline.forEach((snapshot, timeIndex) => {
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('snapshot');

        // Agregar etiqueta de tiempo
        const timeLabel = document.createElement('div');
        timeLabel.classList.add('time-label');
        timeLabel.textContent = `${timeIndex}`;
        timeDiv.appendChild(timeLabel);

        //Agregar cuadro de isntante de tiempo por proceso con su color dependiendo del estado
        Object.entries(snapshot).forEach(([process, state]) => {
            const box = document.createElement('div');
            box.classList.add('box');

            switch (state) {
                case EXISTS:
                    box.classList.add('exists');
                    break;
                case BLOCKED:
                    box.classList.add('blocked');
                    break;
                case RUNNING:
                    box.classList.add('running');
                    break;
                case WAITING:
                    box.classList.add('waiting');
                    break;
            }

            timeDiv.appendChild(box);
        });

        divTimeline.appendChild(timeDiv);
    });
}
/* ------------------------------------------------------------------------------------------------------------------ */


/* ------------------------------------------------------- Mostrar estadisticas ------------------------------------------ */

const showStats = () => {
    //Mostrar estadisticas por proceso
    const processStats = getProcessStats(timeline)

    const processStatsTable = document.getElementById("tbody-process-stats")
    processStatsTable.innerHTML = ""
    Object.entries(processStats).forEach(([process, stats]) => {
        const tr = document.createElement("tr")

        tr.innerHTML = `
            <td>${process}</td>
            <td>${stats.runningTime}</td>
            <td>${stats.waitingTime}</td>
            <td>${stats.blockingTime}</td>
            <td>${stats.end}</td>
            <td>${stats.return}</td>
            <td>${stats.lostTime}</td>
            <td>${stats.penalty.toFixed(2)}</d>
            <td>${stats.responseTime}</td>`

        processStatsTable.appendChild(tr)
    })


    //Mostrar estadisticas generales
    const generalStats = getGeneralStats(timeline)

    const generalStatsTable = document.getElementById("tbody-general-stats")
    generalStatsTable.innerHTML = `
        <tr><th>Tiempo encendido</th> <td>${generalStats.onCPU}</td></tr>
        <tr><th>Uso total de CPU</th> <td>${generalStats.usedCPU}</td></tr>
        <tr><th>CPU desocupada</th> <td>${generalStats.idleCPU}</td></tr>
        <tr><th>Promedio retorno</th> <td>${generalStats.returnAvg.toFixed(2)}</td></tr>
        <tr><th>Promedio de ejecución</th> <td>${generalStats.runningTimeAvg.toFixed(2)}</td></tr>
        <tr><th>Promedio de espera</th> <td>${generalStats.waitingTimeAvg.toFixed(2)}</td></tr>
        <tr><th>Promedio de tiempo perdido</th> <td>${generalStats.lostTimeAvg.toFixed(2)}</td></tr>
    `
}
/* ------------------------------------------------------------------------------------------------------------------------*/