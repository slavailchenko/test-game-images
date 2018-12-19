'use strict';

const title = document.querySelector('h1');
const playFields = document.querySelector('.play-fields');
const reload = document.querySelector('.btn-reload');
const message = document.querySelector('.message');
const timer = document.querySelector('.timer');

const jsonGet = () => {
    let x = new XMLHttpRequest();   
    x.onerror = () => console.log (new Error('Get failed'))
    x.open('GET', 'https://kde.link/test/get_field_size.php');
    x.send(null);            
    x.onreadystatechange = () => {
        if (x.readyState === XMLHttpRequest.DONE && x.status === 200) {
            let data = JSON.parse(x.responseText);
            console.log (x.responseText);
            createTable (data.width, data.height);
            getImages (data.width, data.height);
            hiddenCell ();
            title.innerHTML = 'Find similar images';
            message.innerHTML = '';
            counterSec(document.getElementById('inputNum').value);
        }
        else if (x.status !== 200){
            console.log(new Error('Status is not 200'))
        }
    }
};

jsonGet();

reload.addEventListener('click', jsonGet);

const hiddenCell = () => {
    [].slice.call(document.querySelectorAll('.td-cell'))
    .forEach(el => el.classList.add('hidden-cell'));
}

const createTable = (width, height) => { 

    let tr_rows = [].slice.call(document.querySelectorAll('.tr-row'));
    let rows = ((tr_rows.length) ? tr_rows.forEach(el => el.remove()) : []) || [];

    let cells = [];

    for(let i = 0; i < width; i++) {

        rows[i] = document.createElement('tr');
        rows[i].classList.add('tr-row');
        playFields.appendChild(rows[i]);

        for(let j = 0; j < height; j++) {
            cells[j] = document.createElement('td');
            cells[j].classList.add('td-cell');
            cells[j].index = `${i},${j}`;
            rows[i].appendChild(cells[j]);
        }
    }
};

const getImages = (width, height) => {

    let url = 'http://kde.link/test/';
    let cells = [].slice.call(document.querySelectorAll('.td-cell'));

    let images = cells.map((el, i) => {
        if (i <(width*height)/2) {
            el = `${url}${i.toString().slice(-1)}.png`;
            return el;
        }
    })
    .filter(el => {
        if (el !== 'undefined')
            return el;
    });

    images = ([...images, ...images])
    .sort(() => {
        return .5 - Math.random ()
    });

    cells.forEach((el, i) => {
        el.style.backgroundImage = `url(${images[i]})`;
    });

};

const counterSec = (t) => {
    let i = 1;
    let timerId = setInterval(() => {
        timer.innerHTML = `${i} sec`;
        reload.addEventListener('click', () => {
            clearInterval(timerId);
        });
        if (i == t) {
            clearInterval(timerId);
            title.innerHTML = 'Game over';
            setTimeout(hiddenCell, 2000);
        }
        i++;
    }, 1000);
};

const gameResult = () => {
    let victory = [].slice.call(document.querySelectorAll('.active-two'));
    let allCells = [].slice.call(document.querySelectorAll('.td-cell'));

    if (victory.length === allCells.length) {
        title.innerHTML = 'You are winner!';
    }
};

playFields.addEventListener('click', ((e) => {

    if (e.target.index && !e.target.classList.contains('active-two')) {
        e.target.classList.remove('hidden-cell');
        e.target.classList.add('active');
    };

    let activeFields = [].slice.call(document.querySelectorAll('.active'));
    if (activeFields.length === 2 && 
        activeFields[0].getAttribute('style') === activeFields[1].getAttribute('style')) {

        activeFields.forEach(el => {
            el.classList.remove('active');
            el.classList.add('active-two');
        });

        message.innerHTML = 'Yes!!!';
        message.style.color = 'green';

    } else if (activeFields.length === 2) {

        setTimeout (() => {
            activeFields.forEach(el => {
                el.classList.remove('active');
                el.classList.add('hidden-cell');
            })
        }, 1000);

        message.innerHTML = 'Ooops!!!((((';
        message.style.color = 'red';
    };
    gameResult ();
}));