//получилась такая очень странная константа с методом, но такие были исходники
const VECTOR_NAME = {
    0: 'left',
    1: 'down',
    2: 'up',
    3: 'right',
    indexOf: function (index) {
        return this.hasOwnProperty(index) ? 1 : -1;
    },
};
const getVector = ({ x, y }) => {
    if (x > y) {
        if (Math.abs(x / y) < THRESHOLD) return;
        return x > 0 ? 3 : 1;
    } else {
        if (Math.abs(y / x) < THRESHOLD) return;
        return y > 0 ? 2 : 0;
    }
};

let v = getVector({ x: _x, y: _y });
// если функция вернет 0, то код не выполниться
if (v && VECTOR_NAME.indexOf(v) !== -1) {
    ev.emit('event.' + VECTOR_NAME[v]);
}

// судя по этой строчке имена эвентов должны быть event.up, event.down etc
ev.on('event.up', () => {
    console.log('Восхитительно, что-то движется вверх!');
});
