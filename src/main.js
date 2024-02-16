const kanbanStorageKey = 'kanbanData';

const storageData = localStorage.getItem(kanbanStorageKey);

const initialKanbanData = storageData ? JSON.parse(storageData) : {
    todoColumn: [],
    inProgressColumn: [],
    doneColumn: []
};

let app = new Vue({
    el: '#kanbanBoard',
    data: {
        todoColumn: initialKanbanData.todoColumn,
        inProgressColumn: initialKanbanData.inProgressColumn,
        doneColumn: initialKanbanData.doneColumn,
        cardTitle: null,
        itemOne: null,
        itemTwo: null,
        itemThree: null,
        itemFour: null,
        itemFive: null,
        errors: []
    },
    watch: {
        todoColumn: {
            handler(newTodoColumn) {
                this.saveKanbanData();
            },
            deep: true
        },
        inProgressColumn: {
            handler(newInProgressColumn) {
                this.saveKanbanData();
            },
            deep: true
        },
        doneColumn: {
            handler(newDoneColumn) {
                this.saveKanbanData();
            },
            deep: true
        }
    },
    methods: {

        updateCardProgress(card) {
            const checkedCount = card.items.filter(item => item.checked).length;
            const progress = (checkedCount / card.items.length) * 100;
            card.isComplete = progress === 100;

            if (progress >= 50 && !card.isComplete) {
                this.moveCardBetweenColumns(card, this.firstColumn, this.secondColumn);
            } else if (card.isComplete && this.secondColumn.includes(card)) {
                this.moveCardBetweenColumns(card, this.secondColumn, this.thirdColumn);
            }
            if (progress === 0 && this.secondColumn.length < 5) {
                this.moveCardBetweenColumns(card, this.firstColumn, this.secondColumn);
            }
        },
        moveCardBetweenColumns(card, fromColumn, toColumn) {
            const index = fromColumn.findIndex(c => c.id === card.id);
            if (index !== -1) {
                if (toColumn === this.secondColumn && this.secondColumn.length >= 5) {
                    alert('Во втором столбце не может быть больше 5 карточек.');
                    return;
                }

                fromColumn.splice(index, 1);
                toColumn.push(card);

                if (fromColumn === this.firstColumn && toColumn === this.secondColumn) {
                    this.disableCheckboxes(card);
                }
            }
        },

    },
});