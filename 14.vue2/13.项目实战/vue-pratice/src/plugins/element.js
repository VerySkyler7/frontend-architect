import Vue from 'vue'
import {
    Button, Container, Col, Row, Header,
    Main, Footer, Menu, MenuItem, Submenu
} from 'element-ui'

const elements = {
    Button, Container, Col, Row,
     Header, Main, Footer, Menu, MenuItem, Submenu
};

Object.values(elements).forEach(elm => {
    Vue.use(elm)
})

