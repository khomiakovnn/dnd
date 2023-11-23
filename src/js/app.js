document.addEventListener('DOMContentLoaded', function () {
    const delElement = document.createElement('div');
    delElement.textContent = '✖';
    delElement.className = 'cross';
    this.body.appendChild(delElement);

    var cards = document.querySelectorAll('.card');
    cards.forEach(function (card) {

        // delElement.addEventListener('click', () => {
        //     console.log('click');
        })
        card.addEventListener('mouseover', () => {
            const crossRect = card.getBoundingClientRect();
            delElement.style.top = crossRect.top + 2 + 'px';
            delElement.style.left = crossRect.x + crossRect.width - 25 + 'px';
            delElement.style.display = 'block';
        });
        card.addEventListener('mouseout', () => {
            delElement.style.display = 'none';
        });
    });  

    var addCardButtons = document.querySelectorAll('.add-card-btn');
    addCardButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var column = this.closest('.column');
            if (column) {
                var columnId = column.id;
                showAddCardForm(columnId);
            }
        });
    });

    function showAddCardForm(columnId) {
        var columnContainer = document.getElementById(columnId);

        if (columnContainer) {
            var cardsContainer = columnContainer.querySelector('.cards-container');
            const newCard = document.createElement('div');
            newCard.className = 'card'
            newCard.textContent = 'NEW EMPTY CARD';
            cardsContainer.appendChild(newCard);
            newCard.addEventListener('mouseover', () => {
                const crossRect = newCard.getBoundingClientRect();
                delElement.style.top = crossRect.top + 2 + 'px';
                delElement.style.left = crossRect.x + crossRect.width - 25 + 'px';
                delElement.style.display = 'block';
            })
            newCard.addEventListener('mouseout', () => {
                delElement.style.display = 'none';
            })
        }
    }

    
});
