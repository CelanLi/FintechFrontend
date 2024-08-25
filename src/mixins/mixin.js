// mixin.js
export default {
    methods: {
        goLink(url, params){
            console.log(url, params)
            this.$router.push({
                path: url,
                query: params
            })
        },
    }
}