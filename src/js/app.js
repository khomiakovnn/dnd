document.addEventListener('DOMContentLoaded', function () {
    restoreCards();

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
        saveCards();
    });

    var draggedElement = null;

    var columns = document.querySelectorAll('.column');
    columns.forEach(function (column) {
        column.addEventListener('dragenter', function (event) {
            event.preventDefault();
            delElement.style.display = 'none';
        });

        column.addEventListener('dragover', function (event) {
            event.preventDefault();
        });

        column.addEventListener('dragleave', function () {
            delElement.style.display = 'block';
        });

        column.addEventListener('drop', function () {
            if (draggedElement) {
                var cardsContainer = column.querySelector('.cards-container');
                cardsContainer.appendChild(draggedElement);
                delElement.style.display = 'none';
                saveCards();
                draggedElement = null;
            }
        });
    });

    var addCardButtons = document.querySelectorAll('.add-card-btn');
    addCardButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var column = this.closest('.column');
            if (column) {
                var columnId = column.id;
                showAddCardForm(columnId);
                saveCards();
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
    
            setupCard(newCard);
        }
    }
    
    function setupCard(card) {
        setupCardDragEvents(card);
        setupCardEditEvents(card);
        setupCardDelElement(card);
    }
    
    function setupCardDelElement(card) {
        card.addEventListener('mouseover', () => {
            const crossRect = card.getBoundingClientRect();
            delElement.style.top = crossRect.top + 2 + 'px';
            delElement.style.left = crossRect.x + crossRect.width - 25 + 'px';
            delElement.style.display = 'block';
        });
    
        card.addEventListener('mouseout', () => {
            delElement.style.display = 'none';
        });
    }
    
    function setupCardDragEvents(card) {
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
            const previousSibling = card.previousElementSibling;
            if (previousSibling == null || !previousSibling.classList.contains("empty-placeholder")) {
                addPlaceholder(card);
            }
        });
    
        card.addEventListener('dragleave', function () {
            delElement.style.display = 'block';
            const placeholder = document.querySelector('.empty-placeholder');
            placeholder.remove();
        });
    
        card.addEventListener('drop', function () {
            if (draggedElement) {
                var column = this.closest('.column');
                if (column) {
                    var cardsContainer = column.querySelector('.cards-container');
                    cardsContainer.insertBefore(draggedElement, this);
                }
            }
            const placeholder = document.querySelector('.empty-placeholder');
            placeholder.remove();
            delElement.style.display = 'none';
            saveCards();
            draggedElement = null;
        });
    
        card.addEventListener('dragend', function () {
            card.style.cursor = 'grab';
            setTimeout(() => {
                card.style.cursor = '';
            }, 0);
        });
    }
    
    function setupCardEditEvents(card) {
        card.addEventListener('click', function () {
            if (card.textContent == 'NEW EMPTY CARD') {
               card.textContent = ''; 
            }
            card.contentEditable = 'true';
            card.focus();
        });
    
        card.addEventListener('blur', function () {
            card.contentEditable = 'false';
            saveCards();
        });
    }
    
    function saveCards() {
        var columns = document.querySelectorAll('.column');
        var savedData = {};
    
        columns.forEach(function (column) {
            var columnId = column.id;
            var cards = column.querySelectorAll('.card');
            var cardData = [];
    
            cards.forEach(function (card) {
                cardData.push(card.textContent);
            });
    
            savedData[columnId] = cardData;
        });
    
        localStorage.setItem('cardsData', JSON.stringify(savedData));
    }
    
    function restoreCards() {
        var cardsData = localStorage.getItem('cardsData');
    
        if (cardsData) {
            var parsedData = JSON.parse(cardsData);
    
            for (var columnId in parsedData) {
                var cardsContainer = document.getElementById(columnId).querySelector('.cards-container');
    
                parsedData[columnId].forEach(function (cardText) {
                    const newCard = document.createElement('div');
                    newCard.className = 'card';
                    newCard.textContent = cardText;
                    cardsContainer.appendChild(newCard);
    
                    setupCard(newCard);
                });
            }
        }
    }

    function addPlaceholder(card) {
        const emptyPlaceholder = document.createElement('div');
        emptyPlaceholder.className = 'empty-placeholder';
        const cardsContainer = card.parentElement;
        cardsContainer.insertBefore(emptyPlaceholder, card);
    }
});
