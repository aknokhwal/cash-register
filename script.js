const cash = document.getElementById("cash");
const changeDueDiv = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const priceScreen = document.getElementById("price-screen");
const cashInDrawer = document.getElementById("cash-in-drawer");

let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

const formateResultDiv = (result) => {
    changeDueDiv.innerHTML = `<p><strong>Status: ${result.status}</strong></p>
    ${result.change.map(
        (money) => `<p>${money[0]}: $${money[1]}`).join("")}`
}
const checkCashRegister = (amount) => {
    if(Number(amount) < price){
        alert('Customer does not have enough money to purchase the item');
        cash.value = '';
        return;
    }

    if(Number(amount) === price){
        changeDueDiv.innerHTML =
        '<p>No change due - customer paid with exact cash</p>';
      cash.value = '';
      return;
    }

    let result = {
        status: 'OPEN',
        change: []
    }
    let changeDue = Number(amount) - price;
    const reversedCid = [...cid].reverse();
    const currencyValue = [100, 20, 10, 5, 1, 0.25, 0.10, 0.05, 0.01]
    const totalCid = parseFloat(cid.map(money => money[1]).reduce((total, el) => el + total, 0).toFixed(2));

    if(totalCid < changeDue){
        return (changeDueDiv.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');
    }

    if(totalCid == changeDue){
        result.status = "CLOSED";
    }

    for(let i = 0; i < reversedCid.length; i++)
    {
        if(currencyValue[i] <= changeDue && changeDue > 0){
            let j = 0;
            let calculateCurrency = currencyValue[i]*j
            let total = reversedCid[i][1];
            while(changeDue >= currencyValue[i] && total > 0)
            {
                total -= currencyValue[i]
                changeDue = parseFloat((changeDue -= currencyValue[i]).toFixed(2));
                j++;
            }
            result.change.push([reversedCid[i][0], j * currencyValue[i]]);
        }
    }

    if(changeDue > 0)
    {
        return (changeDueDiv.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');
    }

    formateResultDiv(result);
    updateUI(result.change)
}

const updateUI = change => {
    const currencyNameMap = {
        PENNY: 'Pennies',
        NICKEL: 'Nickels',
        DIME: 'Dimes',
        QUARTER: 'Quarters',
        ONE: 'Ones',
        FIVE: 'Fives',
        TEN: 'Tens',
        TWENTY: 'Twenties',
        'ONE HUNDRED': 'Hundreds'
      };
      // Update cid if change is passed in
      if (change) {
        change.forEach(changeArr => {
          const targetArr = cid.find(cidArr => cidArr[0] === changeArr[0]);
          targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
        });
      }
    priceScreen.textContent = `Total: $${price}`;
    cashInDrawer.innerHTML = `
        <p><strong>Change in Drawer:</strong></p>
        ${cid.map( money => `<p>${currencyNameMap[money[0]]}: ${money[1]}</p>`).join('')}
    `
}

purchaseBtn.addEventListener('click', () => {
    const amount = cash.value;
    if(!amount){
        return;
    }
    checkCashRegister(amount)
})

updateUI();