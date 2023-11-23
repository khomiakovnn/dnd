function showAddCardForm(columnId) {
    var column = document.getElementById(columnId);
    var form = document.createElement('div');
    form.className = 'add-card-form';
    form.innerHTML = `
        <input type="text" id="newCardInput" placeholder="Enter card title">
        <button onclick="addCard('${columnId}')">Add Card</button>
    `;
    column.appendChild(form);
    document.getElementById('newCardInput').focus();
}

function addCard(columnId) {
    var column = document.getElementById(columnId);
    var cardTitle = document.getElementById('newCardInput').value;
    if (cardTitle.trim() !== '') {
        var card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = cardTitle;
        column.insertBefore(card, column.lastChild);
        document.getElementById('newCardInput').value = '';
        column.removeChild(column.lastChild); // Remove the add card form
    }
}
