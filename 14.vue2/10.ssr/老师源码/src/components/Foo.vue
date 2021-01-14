<template>
    <div @click="show">foo <div>{{test1}}</div></div>
</template>
<script>
export default {
    data(){
            return {
                a: 1, 
                b: 2
            }
        },
        computed: {
            test1(){
                return this.a + this.b
            }
        },
    methods:{
        
        show(){
            this.a = 2;
        }
    }
}
</script>
