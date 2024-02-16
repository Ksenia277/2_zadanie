const storageKey = 'new';

const storageData = localStorage.getItem(storageKey);

const initialData = storageData ? JSON.parse(storageData) : {
    firstColumn: [],
    secondColumn: [],
    thirdColumn: []
};

let app = new Vue({
    el: '#new',
    data: {
        firstColumn: initialData.firstColumn,
        secondColumn: initialData.secondColumn,
    },
    watch: {
        secondColumn: {
        },
        thirdColumn: {
        }
    },
    methods: {
    },
    mounted() {
    }
});