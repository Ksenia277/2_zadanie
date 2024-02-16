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
        saveKanbanData() {
            const data = {
                todoColumn: this.todoColumn,
                inProgressColumn: this.inProgressColumn,
                doneColumn: this.doneColumn
            };
            localStorage.setItem(kanbanStorageKey, JSON.stringify(data));
        },
        updateCardProgress(card) {
            const checkedCount = card.items.filter(item => item.checked).length;
            const progress = (checkedCount / card.items.length) * 100;
            card.isComplete = progress === 100;

            if (card.isComplete) {
                card.lastChecked = new Date().toLocaleString();
            }

            if (progress >= 50 && !card.isComplete) {

                this.moveCardBetweenColumns(card, this.firstColumn, this.secondColumn);
            } else if (card.isComplete && this.secondColumn.includes(card)) {

                this.moveCardBetweenColumns(card, this.secondColumn, this.thirdColumn);
            }

            if (progress === 0 && this.secondColumn.length < 5) {

                this.moveCardBetweenColumns(card, this.firstColumn, this.secondColumn);
            }
        },
        deleteCard(index) {
            this.thirdColumn.splice(index, 1);
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

        disableCheckboxes(card) {

            card.items.forEach(item => {
                item.checked = true;
            });
        },

        createCard() {
            if (this.validateForm()) {
                const newGroup = {
                    id: Date.now(),
                    groupName: this.groupName,
                    items: [
                        { text: this.inputOne, checked: false },
                        { text: this.inputTwo, checked: false },
                        { text: this.inputThr, checked: false },
                        { text: this.inputFor, checked: false },
                        { text: this.inputFiv, checked: false },
                    ],
                    lastChecked: new Date().toLocaleString(),
                    isDisabled: false
                };

                const cardsWithZeroProgress = this.firstColumn.filter(card => {
                    const checkedCount = card.items.filter(item => item.checked).length;
                    const progress = (checkedCount / card.items.length) * 100;
                    return progress === 0;
                });

                const cardsWithFiftyProgress = this.secondColumn.filter(card => {
                    const checkedCount = card.items.filter(item => item.checked).length;
                    const progress = (checkedCount / card.items.length) * 100;
                    return progress === 50;
                });

                if (cardsWithZeroProgress.length < 3 && this.firstColumn.length < 3) {
                    this.firstColumn.push(newGroup);
                    this.clearForm();
                } else if (cardsWithFiftyProgress.length >= 5) {

                    this.firstColumn.forEach(card => {
                        card.isDisabled = true;
                    });
                    this.errors.push('Во втором столбце не может быть больше 5 карточек с прогрессом 50%.');
                } else {
                    this.errors.push('В первом столбце не может быть больше 3 карточек.');
                }
            }
        },
        validateForm() {
            this.errors = [];
            if (!this.groupName) {
                this.errors.push('Пожалуйста, введите название карточки.');
            }
            if (!this.inputOne || !this.inputTwo || !this.inputThr || !this.inputFor) {
                this.errors.push('Пожалуйста, заполните все заметки.');
            }
            if (!this.inputFiv) {
                this.errors.push('Пожалуйста, заполните все заметки.');
            }
            return this.errors.length === 0;
        },
        clearForm() {
            this.groupName = null;
            this.inputOne = null;
            this.inputTwo = null;
            this.inputThr = null;
            this.inputFor = null;
        }
    },
    mounted() {
        // this.checkBlockColumn();
    }
});