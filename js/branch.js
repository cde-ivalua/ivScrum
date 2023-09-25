const apiUrl = 'https://iv-scrum-api.herokuapp.com';
const statusEnum = {locked: 'locked', opened: 'opened'}
const changeBranchStatus = (id, status) => {
    const branch = document.getElementById(id);
    const branchCode = branch.getAttribute('data-branch-code');
    const action = status === statusEnum.locked ? 'lock=1' : 'unlock=1';    
    fetch(`https://project.ivalua.com/page/chg/branch_manage?branch_code=${branchCode}&${action}`, {
        "headers": {              
          "content-type": "application/x-www-form-urlencoded",              
        },                        
        "body": `old_branch_code=${branchCode}&task_id=133&branch_auto_upgrade=N`,
        "method": "POST",
        "mode": "no-cors",
        "credentials": "include"
      }) 
      .then(e => {
        const data = new FormData();
        data.append('status', status);
        fetch(`${apiUrl}/Branch/${id}/updateStatus`,
        {
            method: 'POST',
            body: data,
            headers: {
                // 'Content-Type':  'multipart/form-data',
                'Accept': 'application/json'},
            // mode: 'no-cors'
        });             
        branch.setAttribute('data-status', status)
    });
}
const changeBranchStatusClick = (e) => {
    const target = e.target;
    const branch = target.closest('.branch');
    const status = branch.getAttribute('data-status'); 
    const newStatus = status === statusEnum.locked ? statusEnum.opened : statusEnum.locked;      
    const id = branch.id;
    changeBranchStatus(id, newStatus);
}
const unchainCauchyBranches = (event) => {
    document.querySelectorAll('.branch').forEach(b => {
        const status = b.getAttribute('data-status');
        if (status === statusEnum.locked){
            changeBranchStatus(b.id, statusEnum.opened);
        }
    })
}
const lockCauchyBranches = (event) => {
    document.querySelectorAll('.branch').forEach(b => {
        const status = b.getAttribute('data-status');
        if (status === statusEnum.opened){
            changeBranchStatus(b.id, statusEnum.locked);
        }
    })
}
const getBranches = () => {
    const myHeaders = new Headers();
    myHeaders.set('Accept', 'application/json'); 
    fetch(`${apiUrl}/Branch`,
        {
            method: 'GET',
            header: myHeaders
        })
        .then(e => {
            console.log(e)
            return e.json()
        })
        .then(data => {
            data.sort((a, b) => {
                const x = parseInt(a.version),
                y = parseInt(b.version);
                if (x > y)
                    return 1;
                else return -1
            });
            data.forEach(b => {
                const branchesElement = document.getElementById('branches');
                const branch = document.createElement('li');
                branch.setAttribute('data-status', b.status);
                branch.setAttribute('id', b.id);
                branch.setAttribute('data-branch-code', `buyer_V8_${b.version}_D351364_branch`);
                const version = document.createElement('a');
                version.setAttribute('href', `https://project.ivalua.com/page/chg/branch_manage?branch_code=buyer_V8_${b.version}_D351364_branch`)
                version.classList.add('version')
                version.setAttribute('target', 'blank')
                branch.append(version);
                version.innerText = b.version;
                branch.classList.add('branch', 'flex', 'row', );  
                const button = document.createElement('button');
                button.setAttribute('type', 'button')
                button.classList.add('status-button');
                const icon = document.createElement('i');
                icon.classList.add('fa-solid', 'status')
                if (b.status === statusEnum.locked){
                    icon.classList.add('fa-lock');    
                }
                else{
                    icon.classList.add('fa-lock-open');
                }
                button.onclick = changeBranchStatusClick;
                button.append(icon);
                branch.append(button);
                branchesElement.append(branch)                
            });           
        })
}
getBranches();
document.querySelector('.unchain').addEventListener('click', unchainCauchyBranches);
document.querySelector('.lockdemall').addEventListener('click', lockCauchyBranches)