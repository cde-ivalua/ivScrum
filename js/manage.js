const apiUrl = 'https://iv-scrum-api.herokuapp.com';
const trelloApiUrl = 'https://api.trello.com/1'
const trelloApiQuerystring = 'key=dd24b369a1b776a4c82bb7250d62c889&token=ATTA88b4f3cc0d8b223e23f83cb6a60758b2a128d1ed97fda341a6bd62a00c74ddd1DCEEAF6E';

fetch(`${apiUrl}/team`, 
{
    method: 'GET',
    headers: {
        'Accept': 'application/json'        
    }
})
.then(r => r.json())
.then(teams => {    
    init(teams);
});

const plusButtonClickHandler = (e) => {
    const target = e.target,
    btn = target.closest('button'),
    container = btn.closest('.team'),
    table = container.querySelector('table'),
    row = table.querySelector('tr:last-child'),
    newRow = row.cloneNode(true);
    newRow.removeAttribute('data-dev-id');
    newRow.querySelectorAll('input').forEach(input => {
        input.value = null;        
        input.addEventListener('change', fieldChangeHandler)
    });
    table.append(newRow);
}

const fieldChangeHandler = (e) => {
    const headers = new Headers();        
    headers.append('mode', 'cors');
    headers.append('Accept', '*/*');    
    const teamContainer = e.target.closest('.team');
    const data = new FormData();  
    data.append('teamId', teamContainer.getAttribute('data-team'));
    const id = e.target.closest('tr').getAttribute('data-dev-id');
    if (id !== 'null'){
        data.append('id',id);
    }
    const row = e.target.closest('tr');
    const fields = row.querySelectorAll('input, select');
    fields.forEach(f => {
        let value;
        if (f.getAttribute('type') === 'checkbox'){
            value = f.checked;
        }
        else{
            value = f.value;
        }
        data.append(f.getAttribute('data-property'), value);
    })
    fetch(`${apiUrl}/user`, 
    {
        method: 'POST',
        headers: headers,
        body: data
    })
    .then(res => res.json())
    .then(data => {
        row.setAttribute('data-dev-id', data.id);
    });
}

const getTrelloMembers = async (teamId) => {
    const myHeaders = new Headers();
    myHeaders.set('Accept', 'application/json');    
    return await fetch(`${trelloApiUrl}/boards/${teamId}/members?${trelloApiQuerystring}`, 
        {method: 'GET', headers: myHeaders})
        .then(res => res.json())        
}

const buildSelect = (members) => {
    const select = document.createElement('select');
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.fullName;
        select.append(option);
    });
    return select;
}

const init = async (teams) => {
    const hiddenColumns = ['id', 'team', 'teamId'];
    teams.forEach(async team => {
        const trelloMembers = await getTrelloMembers(team.trelloId);
        const selectInput  = buildSelect(trelloMembers);
        const container = document.querySelector('.teams');
        const teamContainer = document.createElement('div');
        teamContainer.setAttribute('data-team', team.id);
        teamContainer.classList.add('team')
        container.append(teamContainer);
        const table = document.createElement('table');
        const titleContainer = document.createElement('div');
        const title = document.createElement('span');
        const addBtn = document.createElement('button');
        addBtn.classList.add('add')
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-user-plus');
        addBtn.setAttribute('type', 'button');        
        addBtn.append(icon)    
        addBtn.onclick = plusButtonClickHandler;
        title.classList.add('title')
        title.textContent = team.name;
        teamContainer.append(titleContainer);
        titleContainer.append(title);
        titleContainer.append(addBtn);
        teamContainer.append(table);
        let first = true;
        const header = document.createElement('tr');
            table.append(header);
            team.devs.forEach(dev => {
                const row = document.createElement('tr');
                row.setAttribute('data-dev-id', dev.id);                
                table.append(row);
                const keys = Object.keys(dev);
                keys.forEach(key => {
                    if (!hiddenColumns.includes(key)){
                        const cell = document.createElement('td');                        
                        if (first){                    
                            const headerCell = document.createElement('th');
                            header.append(headerCell)                    
                            headerCell.innerHTML = key;
                        }
                        row.append(cell);
                        let field = document.createElement('input');    
                        if (key === 'trello'){                        
                            field = selectInput.cloneNode(true)
                        }
                        else if (typeof dev[key] === 'boolean'){                                                    
                            field.setAttribute('type', 'checkbox');     
                            field.checked = dev[key];  
                        }
                        else{                            
                            field.setAttribute('type', 'text');            
                            if (key !== 'name')
                                field.setAttribute('size', field.value.length + 5);
                        }                        
                        field.setAttribute('data-property', key);
                        cell.append(field);                        
                        field.value = dev[key];                        
                        field.addEventListener('change', fieldChangeHandler)
                    }
                });               
                first = false;
                const cell = document.createElement('td');
                const deleteButton = document.createElement('button');
                const icon = document.createElement('i');
                icon.classList.add('fa-solid', 'fa-trash-can');
                deleteButton.append(icon);                
                deleteButton.addEventListener('click', () => {
                    if (confirm('Dracarys ?')){
                        const headers = new Headers();        
                        headers.append('mode', 'cors');
                        headers.append('Accept', '*/*');    
                        fetch(`${apiUrl}/user/${dev.id}/delete`, 
                        {
                            method: 'GET',
                            headers: headers
                        }).then(() => {
                            row.remove();
                        })
                    }                    
                })
                row.append(cell);
                cell.append(deleteButton);
            })
        });
    const boards = await getTrelloBoards();
    const select = buildBoardSelect(boards, teams);
    const addTeamButton = document.querySelector('.add-team');
    document.querySelector('.new-team').prepend(select);
    addTeamButton.addEventListener('click', (e) => {
        const selectedTeam = select.value;
        const data = new FormData();
        data.append('trelloId', selectedTeam);
        data.append('name', boards.find(t => t.id === selectedTeam).name);
        const headers = new Headers();        
        headers.append('mode', 'cors');
        headers.append('Accept', '*/*'); 
        fetch(`${apiUrl}/team`, 
        {
            method: 'POST',
            headers: headers,
            body: data
        })
    })
}

const getTrelloBoards = async () => {
    const myHeaders = new Headers();
    myHeaders.set('Accept', 'application/json');    
    return await fetch(`${trelloApiUrl}/organizations/6131db27b441b81ed59e364e/boards?${trelloApiQuerystring}`, 
        {method: 'GET', headers: myHeaders})
        .then(res => res.json())        
}

const buildBoardSelect = (boards, teams) => {
    const select = document.createElement('select');
    boards.forEach(board => {
        if (teams.find(t => t.trelloId === board.id))
            return;
        const option = document.createElement('option');
        option.value = board.id;
        option.textContent = board.name;
        select.append(option);
    });
    return select;
}
