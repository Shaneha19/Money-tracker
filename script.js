let currentUser = "proUser";
let chart;

if (!localStorage.getItem(currentUser)) {
  localStorage.setItem(currentUser, JSON.stringify({ transactions: [] }));
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function addTransaction() {
  let desc = document.getElementById('desc').value;
  let amount = parseInt(document.getElementById('amount').value);
  let type = document.getElementById('type').value;
  let category = document.getElementById('category').value;

  if (!desc || !amount) return alert('Fill all fields');

  let data = JSON.parse(localStorage.getItem(currentUser));
  data.transactions.push({ desc, amount, type, category });

  localStorage.setItem(currentUser, JSON.stringify(data));

  loadData();
}

function loadData() {
  let data = JSON.parse(localStorage.getItem(currentUser));

  let income = 0, expense = 0;
  let list = document.getElementById('list');
  list.innerHTML = '';

  data.transactions.forEach((t, i) => {
    let li = document.createElement('li');
    li.innerHTML = `${t.desc} (₹${t.amount}) - ${t.category}
      <button class="delete" onclick="deleteItem(${i})">X</button>`;

       list.appendChild(li);

    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  });

  let balance = income - expense;

  document.getElementById('income').innerText = income;
  document.getElementById('expense').innerText = expense;
  document.getElementById('balance').innerText = balance;

  updateChart(income, expense);
}

function updateChart(income, expense) {
  const ctx = document.getElementById('chart');

    if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{ data: [income, expense] }]
    }
  });
}

function deleteItem(index) {
  let data = JSON.parse(localStorage.getItem(currentUser));
  data.transactions.splice(index, 1);
  localStorage.setItem(currentUser, JSON.stringify(data));
  loadData();
}

loadData();
