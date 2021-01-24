import Vue from 'vue'
import {
    Button, Container, Col, Row, Header,
    Main, Footer, Menu, MenuItem, Submenu,
    Carousel, CarouselItem, Form, FormItem, 
    Input
} from 'element-ui'

const elements = {
    Button, Container, Col, Row, Header, 
    Main, Footer, Menu, MenuItem, Submenu,
    Carousel, Carousel, CarouselItem, Form, FormItem, 
    Input
};

Object.values(elements).forEach(elm => {
    Vue.use(elm)
})

