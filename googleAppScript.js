class gAppScript{
    constructor(conf){
        this.apiUrl = 'https://script.google.com/macros/s/AKfycbwqcTVFAyKlPKezFSigytAYXNuHv1gio1k9oBivGTVGB1cnhUXSSMUBj93U2shpGY7P1Q/exec';
        this.id = conf.id;
        this.element = conf.element;
        this.option = conf.option? conf.option : {};
        this.running = false;
        this.fileName = "";
        this.sheetOpenNow = "";
    }
    async getData(){
        let response = await fetch(`${this.apiUrl}?id=${this.id}`);
        let json = await response.json();
        
        return json;
    }
    loadConteiner(){
        let div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <div class='card-header'>
            <div class="row">
                <div class="col-6" id="judul"></div>
                <div class="col-6 daftarSheet" style="text-align: right;"></div>
            </div>
        </div>
        <div class='card-body'>
            <table class="table table-hover"></table>
        </div>
         <div class='card-footer'></div>`;
        this.element.appendChild(div);
    }
    async connectSheet(){
        let response = await fetch(`${this.apiUrl}?id=${this.id}`);
        let json = await response.json();
        this.fileName = json['nameFile'];
        this.element.querySelector("#judul").innerHTML = `<h3>${this.fileName}</h3>`;
        let cardHeader = this.element.querySelector('.daftarSheet');
        cardHeader.innerHTML = `<div class="dropdown">
        <span class="status"></span>
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Open Sheet            
        </button>
        <ul class="dropdown-menu"></ul>
        </div>`
        json['sheetLists'].forEach(namaSheet => {
            let li = document.createElement('li');
            li.innerHTML = `<button class="dropdown-item">${namaSheet}</button>`;
            cardHeader.querySelector('.dropdown-menu').appendChild(li);
            li.addEventListener("click",()=>{
                if(!this.running){
                    this.element.querySelector(".status").innerHTML = `<button class="btn"><i class="fa-solid fa-spinner fa-spin" style="font-size:1.5rem;"></i></button>`;
                    this.running = true;
                    this.openSheet(namaSheet);
                }
            })
        });
    }
    async defaultDisplay(data){
        let dataTable = data.value
        let row = dataTable.length;
        let col = dataTable[0].length;
        let table = this.element.querySelector("table");
        table.setAttribute('id','myTabel');
        table.innerHTML = `
        <thead><tr class="table-header"></tr></thead>
        <tbody></tbody>`;
        for(let i = 0; i < col; i++){
            let th = document.createElement('th');
            th.innerHTML = `${dataTable[0][i]}`;
            table.querySelector(".table-header").appendChild(th);
        }
        for(let j = 1;j < row;j++){
            let tr = document.createElement("tr");
            for(let k = 0;k < col; k++){
                let td = document.createElement('td');
                td.innerHTML = `${dataTable[j][k]}`;
                tr.appendChild(td);
            }
            table.querySelector("tbody").appendChild(tr);
        }
        this.element.querySelector(".card-body").appendChild(table);
         return table;
       
    }
    async openSheet(sheetName){
        this.element.querySelector(".card-body").innerHTML = `<table class="table table-hover"></table>`;
        let response = await fetch(`${this.apiUrl}?id=${this.id}&type=2&name=${sheetName}`);
        let json = await response.json();        
        this.element.querySelector("#judul").innerHTML = `
        <h3>${this.fileName} - ${json.sheetName} 
        <button id="add-data" class="btn btn-sm btn-primary"><i class="fa-solid fa-plus"></i></button>
        <a class="btn btn-sm btn-secondary" href="https://docs.google.com/spreadsheets/d/${this.id}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </h3>`;

        let table = await this.defaultDisplay(json);
        this.element.querySelector(".status").innerHTML = ``;

        // console.log(json)
        new DataTable(table,{
            destroy: true,
            responsive: true
        })

        this.running = false;
    }
    // loadingTable(){
        
    // }
    async init(){
        this.loadConteiner();
        this.connectSheet();
    }
}
