document.addEventListener('DOMContentLoaded', function () {
    const delElement = document.createElement('div');
    delElement.textContent = '✖';
    delElement.className = 'cross';
    document.body.appendChild(delElement);
    delElement.addEventListener('click', function (event) {
        var x = event.clientX;
        var y = event.clientY;
        delElement.style.display = 'none';
        var clickedElement = document.elementFromPoint(x, y);
        clickedElement.remove();
    });

    var draggedElement = null;

    var cards = document.querySelectorAll('.card');
    cards.forEach(function (card) {
        card.draggable = true;

        card.addEventListener('dragstart', function (event) {
            draggedElement = event.target;
            event.dataTransfer.setData('text/plain', '');
            card.style.cursor = 'grabbing';
        });

        card.addEventListener('dragenter', function (event) {
            event.preventDefault();
            delElement.style.display = 'none';
        });

        card.addEventListener('dragover', function (event) {
            event.preventDefault();
        });

        card.addEventListener('dragleave', function () {
            delElement.style.display = 'block';
        });

        card.addEventListener('drop', function () {
            if (draggedElement) {
                var column = this.closest('.column');
                if (column) {
                    var cardsContainer = column.querySelector('.cards-container');
                    cardsContainer.insertBefore(draggedElement, this);
                }
            }
            delElement.style.display = 'none';
            draggedElement = null;
        });

        card.addEventListener('dragend', function () {
            card.style.cursor = 'grab';
            setTimeout(() => {
                card.style.cursor = '';
            }, 0);
        });

        card.addEventListener('mouseover', function () {
            const crossRect = card.getBoundingClientRect();
            delElement.style.top = crossRect.top + 2 + 'px';
            delElement.style.left = crossRect.x + crossRect.width - 25 + 'px';
            delElement.style.display = 'block';
        });

        card.addEventListener('mouseout', function () {
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
            newCard.className = 'card';
            newCard.textContent = 'NEW EMPTY CARD';
            cardsContainer.appendChild(newCard);

            newCard.addEventListener('mouseover', () => {
                const crossRect = newCard.getBoundingClientRect();
                delElement.style.top = crossRect.top + 2 + 'px';
                delElement.style.left = crossRect.x + crossRect.width - 25 + 'px';
                delElement.style.display = 'block';
            });

            newCard.addEventListener('mouseout', () => {
                delElement.style.display = 'none';
            });
        }
    }
});
