
import { createNamespacedHelpers } from 'vuex'

const { mapState: userState } = createNamespacedHelpers('user')

export default {

    data() {
        return {
            list: []
        }
    },

    computed: {
        ...userState(['userInfo'])
    },

    methods: {
        getMenuList(authList) {
            const menu = []; // 用于存储菜单
            const map = {}; // 映射表，相当于扁平化authList，便于快速查找对应的元素

            authList.forEach(m => {
                m.children = [];
                map[m.id] = m;
                if (m.pid == -1) {
                    menu.push(m)
                } else {
                    map[m.pid] && map[m.pid].children.push(m)
                }
            })

            this.list = menu;
        }
    },

    mounted() {
        this.getMenuList(this.userInfo.authList);
    },

    render() {

        let renderChildren = (list) => {
            return list.map(item => {
                return item.children.length ?
                    <el-submenu index={item.id+""}>
                        <div slot="title">{item.name}</div>
                        {renderChildren(item.children)}
                    </el-submenu> :
                    <el-menu-item index={item.auth}>
                        {item.name}
                    </el-menu-item>
            })
        }

        return <el-menu
            class="menu"
            background-color="#333"
            text-color="#fff"
            active-text-color="fff"
            router={true}
        >
            {renderChildren(this.list)}
        </el-menu>
    }
}