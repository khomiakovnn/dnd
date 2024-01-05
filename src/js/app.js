document.addEventListener('DOMContentLoaded', function () {
    restoreCards();

    var draggingElement = null;
    var draggingProection = null;
    var shiftX = null;
    var shiftY = null;
       
    const onMouseDown = (evt) => {
        const target = evt.target;
        evt.preventDefault();
        delElement.style.display = 'none'

		if (target.classList.contains('card')) {
			shiftX = evt.offsetX;
			shiftY = evt.offsetY;
            const { width, height } = window.getComputedStyle(target);
			draggingElement = target.cloneNode(true);
            document.body.appendChild(draggingElement);
			draggingElement.style = `
		 		left: ${evt.pageX - shiftX - 1}px;
		 		top: ${evt.pageY - shiftY - 1}px;
                position: absolute;
                width: ${width};
                height: ${height};
			`
            const proection = elementProection(target);
            target.replaceWith(proection);
		}
	}

	const onMouseUp = () => {
		if (draggingElement) {
			draggingProection.replaceWith(draggingElement);
            draggingElement.style = {};
            document.querySelector('.proection').remove();
            draggingElement = null;
            draggingProection = null;
            saveCards();
		}
	}

    const onMouseMove = (evt) => {
		if (draggingElement) {
			const { pageX, pageY } = evt;
			const { width, height } = window.getComputedStyle(draggingElement);
			draggingElement.style = `
				position: absolute;
		 		left: ${pageX - shiftX - 1}px;
		 		top: ${pageY - shiftY - 1}px;
		 		pointer-events: none;
				width: ${width};
				height: ${height};
                display: block;
			`
            proectionAct(evt);
		}
	}
    
    function elementProection (element) {
        const proection = document.createElement('div');
        proection.classList = 'proection';
        const { width, height } = window.getComputedStyle(element);
        proection.style.cssText = `
        width: ${width};
        height: ${height};
        margin: 10px 0;
        `
        return proection
    }

    function proectionAct (evt) {
		const target = evt.target;
		const proection = draggingProection;
		if (
			target.classList.contains("card") &&
			!target.classList.contains("proection")
		) {
			const { y, height } = target.getBoundingClientRect();
			const appendPosition = y + height / 2 > evt.clientY
				? "beforebegin"
				: "afterend";

			if (!proection) {
				draggingProection = elementProection(target);
			} else {
				proection.remove();
				target.insertAdjacentElement(appendPosition, proection);
			}
		}
	}

    document.body.addEventListener('mousedown', onMouseDown);
    document.body.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mousemove', onMouseMove);



    // Создает крестик для удаления
    const delElement = document.createElement('div');
    delElement.textContent = '✖';
    delElement.className = 'cross';
    document.body.appendChild(delElement);

    // Функционал удаления карточки при нажатии на крестик
    delElement.addEventListener('click', function (event) {
        var x = event.clientX;
        var y = event.clientY;
        delElement.style.display = 'none';
        var clickedElement = document.elementFromPoint(x, y);
        clickedElement.remove();
        saveCards();
    });

    // Функционал кнопок ADD
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
        setupCardEditEvents(card);
        setupCardDelElement(card);
    }
    
    function setupCardDelElement(card) {
        card.addEventListener('mouseover', () => {
            if (draggingElement == null) {
                const crossRect = card.getBoundingClientRect();
                delElement.style.top = crossRect.top + 2 + 'px';
                delElement.style.left = crossRect.x + crossRect.width - 25 + 'px';
                delElement.style.display = 'block';    
            }
        });
    
        card.addEventListener('mouseout', () => {
            delElement.style.display = 'none';
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
});
