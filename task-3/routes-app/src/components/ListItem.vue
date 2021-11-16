<template>
    <v-container>
        <v-row>
            <v-col cols="2" class="price"
                ><div class="circle">${{ route.totalAmount }}</div></v-col
            >
            <v-col cols="10">
                <span>
                    <span>{{ generateHTML(route.path) }}</span>
                </span>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'ListItem',
    data() {
        return {
            key: 54654,
        };
    },
    props: ['route'],
    methods: {
        generateHTML() {
            const item = this.route.path;
            if (this.route.path.length == 1) {
                return `${item[0].src} ${item[0].company}(${item[0].price}$) => ${item[0].des}`;
            }
            if (this.route.path.length == 2) {
                return `${item[0].src} ${item[0].company}(${item[0].price}$) => 
                ${item[0].des} ${item[1].company}(${item[1].price}$) => ${item[1].des}`;
            }
            if (this.route.path.length == 3) {
                return `${item[0].src} ${item[0].company}(${item[0].price}$) => 
                ${item[0].des} ${item[1].company}(${item[1].price}$) => 
                ${item[2].src} ${item[2].company}(${item[2].price}$) => ${item[2].des}`;
            }
        },
    },
};
</script>

<style scoped>
.circle {
    background-color: orange;
    border-radius: 50%;
    width: 36px;
    line-height: 36px;
    height: 36px;
    font-size: 0.9rem;
    display: inline-block;
}
</style>
