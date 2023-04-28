// Creating class for users

class User {
    constructor(owner, movements, interestRate, pin) {
        this.owner = owner
        this.movements = movements
        this.interestRate = interestRate
        this.pin = pin
    }
    getUserName() {
        return this.owner.split(' ')
            .reduce((acc, val) => acc + val.slice(0, 1), '')
            .toLocaleLowerCase()
    }
}
// Creating users
const account1 = new User('John Smitt', [200, 450, -400, 3000, -650, -130, 70, 1300], 1.2, 1111)
const account2 = new User('Jessica Davis', [5000, 3400, -150, -790, -3210, -1000, 8500, -30], 1.5, 2222)
const account3 = new User('Steven Thomas Williams', [200, -200, 340, -300, -20, 50, 400, -460], 0.7, 3333)
const account4 = new User('Sarah Smith', [430, 1000, 700, 50, 90], 1, 4444)
const accounts = [account1, account2, account3, account4];
// Creating global veriables
let user
let isLoggedIn = false
let sorted = false
let interval
// Selecting DOM elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


//  Creating timer function for logout

const setTimer = function () {
    let time = 300
    interval = setInterval(() => {
        const minutes = String(Math.trunc(time / 60)).padStart(2, 0)
        const seconds = String(time % 60).padStart(2, 0)
        labelTimer.innerHTML = `${minutes} : ${seconds}`
        time--
    }, 1000);
}


// Creating function for updating DOM

const update = function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal'

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${index} deposit</div>
    <div class="movements__value">${movement}$</div>
</div>`
    containerMovements.insertAdjacentHTML('afterbegin', html)
}


//  Adding event listener to Login button

btnLogin.addEventListener('click', function (event) {
    event.preventDefault()
    accounts.forEach(el => {

        if (!isLoggedIn && el.getUserName() === inputLoginUsername.value && el.pin === +inputLoginPin.value) {
            el.movements.forEach((mov, index) => {
                isLoggedIn = true
                update(mov, index + 1)
            })

            if (isLoggedIn) {
                setTimer()
                containerApp.style.opacity = 1
                user = el
                labelWelcome.innerHTML = `Welcome back ${user.owner}`
                labelBalance.innerHTML = user.movements.reduce((acc, mov) => acc + mov, 0)
                labelSumIn.innerHTML = user.movements.reduce((acc, val) => val > 0 ? acc + val : acc, 0)
                labelSumOut.innerHTML = -user.movements.reduce((acc, val) => val < 0 ? acc + val : acc, 0)
                labelSumInterest.innerHTML = user.movements.reduce((acc, val) => val > 0 ? acc + val : acc, 0) * el.interestRate / 100
            }
        }
    })
    inputLoginUsername.value = ''
    inputLoginPin.value = ''
})


//  Adding event listener to Transfer button

btnTransfer.addEventListener('click', function (event) {
    event.preventDefault()
    for (const account of accounts) {
        if (account.getUserName() === inputTransferTo.value) {
            account.movements.push(+inputTransferAmount.value)
            user.movements.push(-(+inputTransferAmount.value))
            update(-inputTransferAmount.value, user.movements.length)
            inputTransferTo.value = ''
            inputTransferAmount.value = ''

        }
    }
})


//  Adding event listener to Loan button

btnLoan.addEventListener('click', function (event) {
    event.preventDefault()
    const loanAmount = inputLoanAmount.value
    if (loanAmount && user.movements.some(mov => mov >= loanAmount * 0.1)) {
        user.movements.push(loanAmount)
        update(loanAmount, user.movements.length)
    }
    inputLoanAmount.value = ''
})


//  Adding event listener to Close button

btnClose.addEventListener('click', function (event) {
    event.preventDefault()
    if (inputCloseUsername.value === user.owner.split(' ')
        .reduce((acc, val) => acc + val.slice(0, 1), '')
        .toLocaleLowerCase() && +inputClosePin.value === user.pin) {
        containerApp.style.opacity = '0'
        containerMovements.innerHTML = ''
        isLoggedIn = false
        labelWelcome.innerHTML = 'Log in to get started'
        labelTimer.innerHTML = ''
        clearInterval(interval)
    }
    inputCloseUsername.value = ''
    inputClosePin.value = ''
})

//  Adding event listener to Sort button

btnSort.addEventListener('click', function () {
    if (!sorted) {
        const sortedMovements = user.movements.slice().sort((a, b) => a - b)
        containerMovements.innerHTML = ''

        sortedMovements.forEach((mov, index) => {

            update(mov, index + 1)
        })
        sorted = true
    } else {
        containerMovements.innerHTML = ''
        user.movements.forEach((mov, index) => {
            update(mov, index + 1)
        })
        sorted = false
    }
})
