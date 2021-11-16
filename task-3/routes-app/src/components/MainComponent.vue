<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12"><h2>Рассчитать дешевый маршрут</h2></v-col>
        </v-row>
        <v-row class="text-center">
            <v-col cols="12" sm="4">
                <v-card class="pa-2" outlined tile>
                    <v-select
                        :items="countries"
                        label="Звонящая сторона(Caller)"
                        v-model="caller"
                    ></v-select>
                    <v-select
                        :items="countries"
                        label="Принимающая сторона(Callee)"
                        v-model="callee"
                    ></v-select>
                    <v-checkbox
                        v-model="formCheckBoxes.checkBoxAll"
                        label="Все"
                        @click="allCheckHandler"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="formCheckBoxes.checkBoxDirect"
                        label="Прямое"
                        @click="resetCheckboxHandler($event)"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="formCheckBoxes.checkBoxOneAdditional"
                        label="Один доп. узел"
                        @click="resetCheckboxHandler($event)"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="formCheckBoxes.checkBoxTwoAdditionals"
                        label="Два доп.узла"
                        @click="resetCheckboxHandler($event)"
                    ></v-checkbox>
                </v-card>
            </v-col>
            <v-col cols="12" sm="8">
                <v-card height="100%" class="pa-2" outlined tile>
                    <div class="d-flex flex-column fill-height">
                        <ul>
                            <ListItem
                                v-for="(item, index) in routes"
                                :key="index"
                                :route="item"
                                v-show="isShownRoute(index)"
                            />
                            <li v-if="!routes.length">Нет маршрутов</li>
                        </ul>
                        <v-pagination
                            v-if="routes.length"
                            v-model="page"
                            :length="Math.ceil(routes.length / pageLength)"
                            class="mt-auto"
                        ></v-pagination>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import ListItem from './ListItem';
export default {
    name: 'MainComponent',
    props: ['countries', 'paths'],
    data() {
        return {
            filteredRoutes: [],
            createdRoutes: [],
            caller: 'ru',
            callee: 'de',
            page: 1,
            pageLength: 6,
            formCheckBoxes: {
                checkBoxAll: true,
                checkBoxDirect: false,
                checkBoxOneAdditional: false,
                checkBoxTwoAdditionals: false,
            },
        };
    },
    components: {
        ListItem,
    },
    methods: {
        createDirectRoutes(params) {
            const { caller, callee, routes } = params;
            const filteredArr = routes.filter((item) => {
                return item.src == caller && item.des == callee;
            });
            return filteredArr.map((item) => {
                return { caller: caller, callee: callee, path: [item] };
            });
        },
        createOneBrokerRoutes(params) {
            const { caller, callee, routes } = params;
            const result = [];
            const arrSrc = routes.filter((item) => item.src == caller);
            const arrDestination = routes.filter((item) => item.des == callee);
            for (let i = 0; i < arrSrc.length; i++) {
                for (let j = 0; j < arrDestination.length; j++) {
                    if (arrSrc[i].des === arrDestination[j].src) {
                        const obj = {
                            caller: caller,
                            callee: callee,
                            path: [arrSrc[i], arrDestination[j]],
                        };
                        result.push(obj);
                    }
                }
            }
            return result;
        },
        createTwoBrokersRoutes(params) {
            const { caller, callee } = params;
            let { routes } = params;
            const arrSrc = routes.filter((item) => item.src == caller);
            const arrDestination = routes.filter((item) => item.des == callee);
            //отсеем заведомо неверные пути
            routes = routes.filter(
                (item) => item.src != caller || item.des != callee
            );
            const result = [];
            for (let i = 0; i < arrSrc.length; i++) {
                for (let j = 0; j < arrDestination.length; j++) {
                    const brokesrs = routes.filter((item) => {
                        return (
                            item.src === arrSrc[i].des &&
                            item.des === arrDestination[j].src
                        );
                    });
                    brokesrs.forEach((broker) => {
                        const obj = {
                            caller: caller,
                            callee: callee,
                            path: [arrSrc[i], broker, arrDestination[j]],
                        };
                        result.push(obj);
                    });
                }
            }
            return result;
        },
        addTotalAmount(routes) {
            routes.forEach((item) => {
                return (item.totalAmount = item.path.reduce((sum, current) => {
                    return (sum += current.price);
                }, 0));
            });
        },
        allCheckHandler() {
            if (this.formCheckBoxes.checkBoxAll) {
                for (const item in this.formCheckBoxes) {
                    this.formCheckBoxes[item] = true;
                }
                return;
            }
            for (const item in this.formCheckBoxes) {
                this.formCheckBoxes[item] = false;
            }
        },
        resetCheckboxHandler() {
            this.formCheckBoxes.checkBoxAll = false;
            this.page = 1;
        },
        isShownRoute(index) {
            const maxIndex = this.page * this.pageLength;
            const minIndex = (this.page - 1) * this.pageLength;
            return index >= minIndex && index < maxIndex;
        },
    },
    computed: {
        routes() {
            const params = {
                caller: this.caller,
                callee: this.callee,
                routes: this.paths,
            };
            const result = [];
            if (
                this.formCheckBoxes.checkBoxAll ||
                this.formCheckBoxes.checkBoxDirect
            ) {
                const directRoutes = this.createDirectRoutes(params);
                //console.log(directRoutes);
                directRoutes.forEach((item) => {
                    result.push(item);
                });
            }
            if (
                this.formCheckBoxes.checkBoxAll ||
                this.formCheckBoxes.checkBoxOneAdditional
            ) {
                const oneBrokerRoutes = this.createOneBrokerRoutes(params);
                oneBrokerRoutes.forEach((item) => {
                    result.push(item);
                });
                //console.log(oneBrokerRoutes);
            }
            if (
                this.formCheckBoxes.checkBoxAll ||
                this.formCheckBoxes.checkBoxTwoAdditionals
            ) {
                const twoBrokersRoutes = this.createTwoBrokersRoutes(params);
                twoBrokersRoutes.forEach((item) => {
                    result.push(item);
                });
            }

            this.addTotalAmount(result);
            return result.sort((a, b) => {
                return a.totalAmount > b.totalAmount ? 1 : -1;
            });
        },
    },
};
</script>
<style scoped>
.bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 20px;
}
</style>
