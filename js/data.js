// const apiUrl = 'https://localhost:5001';
const apiUrl = 'https://iv-scrum-api.herokuapp.com';
const myHeaders = new Headers();
    myHeaders.set('Accept', 'application/json'); 
    fetch(`${apiUrl}/backlog/2b139375-8dda-40ae-94d9-c4d58713ac91`,
        {
            method: 'GET',
            header: myHeaders
        })
        .then(e => {
            console.log(e)
            return e.json()
        })
        .then(data => {            
           initChart(data);
        });
const initChart = (records) => {
    const filtered =records.reduce((prev, cur) => {
        const date = new Date(cur.date).toLocaleString().split(',')[0];
        if (!prev.filter(b => new Date(b.date).toLocaleString().split(',')[0] === new Date(cur.date).toLocaleString().split(',')[0]).length)
        {
            prev.push(cur);
        }
        else{
            prev[prev.length -1] = cur;
        }
        return prev;
    }, []);
    const labels = filtered.reduce((prev, cur) => {
        const date = new Date(cur.date).toLocaleString().split(',')[0];    
        prev.push(date);
        return prev;
    }, []);
    const blockings = filtered.reduce((prev, cur) => {        
        prev.push(cur.blocking);
        return prev;
    }, []);
    const majors = filtered.reduce((prev, cur) => {        
        prev.push(cur.major);
        return prev;
    }, []);
    const minors = filtered.reduce((prev, cur) => {        
        prev.push(cur.minor);
        return prev;
    }, []);
    
      const data = {
        labels: labels,        
        datasets: [{
            label: 'Blockings',
            backgroundColor: 'red',
            borderColor: 'red',
            data: blockings
          },
          {
            label: 'Majors',
            backgroundColor: 'purple',
            borderColor: 'purple',
            data: majors
          },
          {
            label: 'Minors',
            backgroundColor: 'orange',
            borderColor: 'orange',
            data: minors
          }]
      };
      const plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
          const {ctx} = chart;
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = 'rgba(255, 255, 255, .8)';
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      };
      const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,            
        },
        plugins: [plugin]
      };
      
      const myChart = new Chart(
        document.getElementById('backlogChart'),
        config
      );
}
const initCauchyStatus = () => {
    fetch(`${apiUrl}/branch/status`, 
    {
    method: 'GET',
    headers: {
        'Accept': 'application/json'        
    }
    })
    .then(r => r.json())
    .then(s => {   
        const img = document.getElementById('cauchyStatusImg');
        let icon = 'locked'
        if (s === true){
            icon = 'opened'
        }
        img.setAttribute('src', `./images/icons/${icon}.png`);
        img.classList.remove('hidden')
    })
}
const init = () => {
    initCauchyStatus();
}
init();