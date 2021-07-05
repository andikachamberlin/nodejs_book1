let date = new Date();

let yearNow = date.getFullYear();
let monthNow = date.getMonth() + 1;
let todayNow = date.getDate();

let dateNow = todayNow + '-' + monthNow + '-' + yearNow;

module.exports = {
    yearNow,
    monthNow,
    todayNow,
    dateNow
};