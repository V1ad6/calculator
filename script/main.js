"use strict";
//функція, що замість числа від 0 до 16 повертає його представлення в шітнадцятковій системі
//тобто від 0 до 9 або від A до F, якщо число быльше 9
const to16 = (d) => {
    switch (d) {
        case '10': return 'A';
        case '11': return 'B';
        case '12': return 'C';
        case '13': return 'D';
        case '14': return 'E';
        case '15': return 'F';
        default: return d;
    }
};
//функція, що замість представлення числа в шістнадцятковій системі повертає його ж
//в десятковій
const to10 = (d) => {
    switch (d) {
        case 'A': return 10;
        case 'B': return 11;
        case 'C': return 12;
        case 'D': return 13;
        case 'E': return 14;
        case 'F': return 15;
        default: return +d;
    }
};
//функція, що перекладає ціле число/частину з десяткової системи в будь-яку іншу.
//Функція в аргументи приймає саме число, систему числення та останній залишок,
//який потім записується в результат
//за допомогою рекурсії та ділення останній рядок розкладається
//на суму залишків від ділення та результату останнього ділення, яку функція і повертає
const convertIntFrom10 = (num, system, acc = '') => {
    if (num < system) {
        return to16(String(num)) + to16(acc);
    }
    return convertIntFrom10(Math.floor(num / system), system, String(num % system)) + to16(acc);
};
//функція, що перекладає дробову частину числа з десяткової системи
//функція містить у собі цикл, на кожній ітерації якого до кінця рядка з результатом
//додається ціла частина від результату множення дробової системи числення на 
//дробову частину, передану в першому аргументі або від попереднього множення 
const convertFracFrom10 = (frac, system, accuracy) => {
    let curr = frac;
    let result = '';
    for (let i = 0; i < accuracy; i++) {
        let int = Math.floor(curr * system);
        result += to16(String(int));
        let currFrac = curr * system - Math.trunc(curr * system);
        if (currFrac === 0)
            break;
        curr = currFrac;
    }
    return result;
};
//основна функція перекладу з десяткової системи, що повертає результат, використовуючи 2 
//попередні функції
const convertFrom10 = (num, system, accuracy) => {
    if (num === Math.trunc(num)) {
        return convertIntFrom10(num, system);
    }
    else {
        const intP = Math.trunc(num);
        return convertIntFrom10(intP, system) + '.' + convertFracFrom10(num - intP, system, +accuracy);
    }
};
//функція, що перекладає ціле число/частину з будь якої системи в десяткову. В аргументи приймає 
//саме число та систему числення. У функції міститься єдиний цикл, який проходить по кожному символу числа.
//Кожної ітерації символ помножується на систему числення, яка піднесена до степеня, що дорівнює
//індексу символа у числі з кінця. Цей добуток додається до результату, який потім і повертає функція.
const convertIntTo10 = (input, system) => {
    let result = 0;
    for (let i = 0; i < input.length; i++) {
        result += to10(input[i]) * Math.pow(system, input.length - 1 - i);
    }
    return result;
};
//функція, що перекладає дробову частину з будь-якої системи у десяткову
//У функції міститься цикл, у якому кожної ітерації до змінної з результатом додається 
//цифра з дробової частини, помножена на системи, піднесену до степеня, який дорівнює
//індексу самої цифри. Під індексом мається на увазі "відстань" від точки, помножена на -1
const convertFracTo10 = (input, system) => {
    let result = 0;
    for (let i = 2; i < input.length; i++) {
        result += to10(input[i]) * Math.pow(system, -i + 1);
    }
    return result;
};
//основна функція перекладу в десяткову систему числення, яка для обчислення результату
//викоритовує 2 попередні функції
const convertTo10 = (input, system) => {
    if (input.includes('.')) {
        const intP = input.slice(0, input.indexOf('.'));
        const fracP = input.slice(input.indexOf('.') + 1);
        return convertIntTo10(intP, system) + convertFracTo10('0.' + fracP, system);
    }
    else {
        return convertIntTo10(input, system);
    }
};
document.addEventListener('dblclick', (e) => { e.preventDefault(); });
const resultDefault = '<p>Тут буде результат</p> <p>(натисніть Enter або Обчислити)</p>';
const systemNaction = document.querySelectorAll('.operand-parameters > div, .result-system');
const systemNactionLists = document.querySelectorAll('.operand-parameters ul, .result-system ul');
systemNaction.forEach((btn, index) => {
    btn.onclick = () => {
        systemNactionLists[index].classList.toggle('opened');
    };
});
const [numInput1, numInput2] = document.querySelectorAll('.num-input'), resultBlock = document.querySelector('.result'), systemList = document.querySelector('.system-list'), actionList = document.querySelector('.action-list'), systemBtnTxt = document.querySelector('.system-button p'), actionBtnTxt = document.querySelector('.action-button p'), resultBtnTxt = document.querySelector('.result-system p'), calculate = document.querySelector('.calculate'), cont = document.querySelector('.continue');
let operand1 = numInput1.value, operand2 = numInput2.value;
systemList.addEventListener('mousedown', (e) => { e.preventDefault(); });
actionList.addEventListener('mousedown', (e) => { e.preventDefault(); });
let inputSystem = null, inputAction = '', outputSystem = null, allowed = '+-.';
systemList.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI')
        return;
    inputSystem = +e.target.innerHTML;
    systemBtnTxt.textContent = String(inputSystem);
    allowed = '+-.';
    for (let i = 0; i < inputSystem; i++) {
        allowed += to16(String(i));
    }
});
actionList.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI')
        return;
    inputAction = e.target.innerHTML;
    actionBtnTxt.textContent = String(inputAction);
});
systemNactionLists[2].addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI')
        return;
    outputSystem = +e.target.innerHTML;
    resultBtnTxt.textContent = String(outputSystem);
});
const errAlert = (symbol) => {
    if (!allowed.includes(symbol)) {
        resultBlock.innerHTML = '<p>Некоректно введені дані!</p>';
        resultBlock.classList.add('result_error');
        err = true;
    }
    else {
        err = false;
        resultBlock.innerHTML = resultDefault;
        resultBlock.classList.remove('result_error');
    }
};
let err = false;
numInput1.oninput = numInput2.oninput = (e) => {
    if (!inputSystem || !outputSystem || !inputAction) {
        resultBlock.innerHTML = '<p>Ви не обрали СЧ або арифметичну дію!</p>';
        resultBlock.classList.add('result_error');
        return;
    }
    resultBlock.innerHTML = resultDefault;
    resultBlock.classList.remove('result_error');
    operand1 = numInput1.value;
    operand2 = numInput2.value;
    for (let i = 0; i < operand1.length; i++) {
        errAlert(operand1[i]);
        if (err)
            return;
    }
    for (let i = 0; i < operand2.length; i++) {
        errAlert(operand2[i]);
        if (err)
            return;
    }
};
let result = 0;
function calcResult(e) {
    if (!inputSystem || !outputSystem || !inputAction) {
        resultBlock.innerHTML = '<p>Ви не обрали СЧ або арифметичну дію!</p>';
        resultBlock.classList.add('result_error');
        return;
    }
    operand1 = numInput1.value;
    operand2 = numInput2.value;
    for (let i = 0; i < operand1.length; i++) {
        errAlert(operand1[i]);
        if (err)
            return;
    }
    for (let i = 0; i < operand2.length; i++) {
        errAlert(operand2[i]);
        if (err)
            return;
    }
    resultBlock.innerHTML = resultDefault;
    resultBlock.classList.remove('result_error');
    let [sign1, sign2] = [1, 1];
    (numInput1.value[0] === '-') ? sign1 = -1 : sign1 = 1;
    (numInput2.value[0] === '-') ? sign2 = -1 : sign2 = 1;
    let [op1, op2] = ['', ''];
    '+-'.includes(operand1[0]) ? op1 = operand1.slice(1) : op1 = operand1;
    '+-'.includes(operand2[0]) ? op2 = operand2.slice(1) : op2 = operand2;
    const num1 = convertTo10(op1, inputSystem);
    const num2 = convertTo10(op2, inputSystem);
    switch (inputAction) {
        case '+': {
            result = (num1 * sign1) + (num2 * sign2);
            break;
        }
        case '-': {
            result = (num1 * sign1) - (num2 * sign2);
            break;
        }
        case '*': {
            result = (num1 * sign1) * (num2 * sign2);
            break;
        }
        case '/': {
            result = (num1 * sign1) / (num2 * sign2);
            break;
        }
    }
    let sign = '', res = 0;
    if (result >= 0) {
        sign = '+';
        res = result;
    }
    else {
        sign = '-';
        res = result * (-1);
    }
    resultBlock.textContent =
        result >= 0 ? convertFrom10(res, outputSystem, '10') : sign + convertFrom10(res, outputSystem, '10');
}
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter')
        return;
    calcResult(e);
});
calculate.addEventListener('click', (e) => { calcResult(e); });
cont.onclick = () => {
    if (!outputSystem)
        return;
    inputSystem = outputSystem;
    systemBtnTxt.textContent = String(inputSystem);
    allowed = '+-.';
    for (let i = 0; i < inputSystem; i++) {
        allowed += to16(String(i));
    }
    let sign = '', res = 0;
    if (result >= 0) {
        sign = '+';
        res = result;
    }
    else {
        sign = '-';
        res = result * (-1);
    }
    numInput1.value = result >= 0 ? convertFrom10(res, outputSystem, '10') : sign + convertFrom10(res, outputSystem, '10');
    numInput2.value = '';
};
