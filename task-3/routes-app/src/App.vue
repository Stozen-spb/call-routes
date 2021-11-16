<template>
    <v-app>
        <v-main>
            <v-container>
                <v-row justify="center">
                    <v-col col="12" lg="8">
                        <MainComponent
                            :paths="pathsArray"
                            :countries="countriesArray"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import MainComponent from './components/MainComponent';
import * as callPaths from '../../call-paths.json';
const paths = callPaths.data;
export default {
    name: 'App',

    components: {
        MainComponent,
    },
    methods: {
        modifyData(data) {
            const result = [];
            for (const company in data) {
                for (const route in data[company]) {
                    result.push({ ...data[company][route], company: company });
                }
            }
            return result;
        },
        createCountries(obj) {
            const result = [];
            for (const country in obj) {
                result.push({
                    text: obj[country] + ` (${country})`,
                    value: country == 'us' ? 'usa' : country,
                });
            }
            console.log(result);
            return result;
        },
    },

    data: () => ({
        pathsArray: [],
        countriesArray: [],
    }),
    created() {
        const arr = this.modifyData(paths.company);
        arr.forEach((element) => {
            this.pathsArray.push(element);
        });
        const countries = this.createCountries(paths.country);
        countries.forEach((element) => {
            this.countriesArray.push(element);
        });
    },
};
</script>
