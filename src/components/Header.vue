<template>
    <div>
        <v-app-bar color="#43a047" dense>
            <template v-slot:img="{ props }">
                <v-img
                    v-bind="props"
                    gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
                ></v-img>
            </template>
            <v-app-bar-nav-icon
                @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <a href="/">
                <v-img
                    max-width="80"
                    src="http://127.0.0.1:8000/storage/logo.png"
                ></v-img>
            </a>
            <v-spacer></v-spacer>

            <v-menu v-if="userObj" offset-y>
                <slot>
                </slot>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" plain>
                        <v-icon left>mdi-account-circle</v-icon>
                        {{ userObj.name ? userObj.name : "Usuario" }}
                    </v-btn>
                </template>
                <v-list>
                    <template v-for="(userOpt, index) in userMenu">
                        <v-list-item :key="index" @click="(userOpt) => {}">
                            <v-list-item-title
                                @click="userAction(userOpt.action)"
                            >
                                <v-icon left>{{ `mdi-${userOpt.icon}` }}</v-icon>
                                {{ userOpt.label }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                </v-list>
            </v-menu>
            <v-menu v-else offset-y>
                <slot>
                </slot>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" plain>
                        <v-icon>mdi-account-circle</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <template v-for="(userOpt, index) in guestMenu">
                        <v-list-item :key="index" @click="(userOpt) => {}">
                            <v-list-item-title
                                @click="userAction(userOpt.route)"
                            >
                                <v-icon left>{{ `mdi-${userOpt.icon}` }}</v-icon>
                                {{ userOpt.label }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                </v-list>
            </v-menu>
        </v-app-bar>
        
        <v-navigation-drawer v-model="drawer" absolute top temporary>
            <v-list nav dense>
                <v-list-item-group
                    v-model="group"
                    active-class="deep-purple--text text--accent-4"
                >
                    <v-list-item
                        v-for="(item, index) in menuItems"
                        :key="index"
                        @click="navigate(item.route)"
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
// import axios from "axios";
export default {
    data: () => ({
        menuItems: [
            { title: 'Peliculas', route: "movies" },
        ],
        menuItemsAdmin: [],
        userObj: null,
        userMenu: [
            { label: "Perfil", icon: "account-edit", action: "profile" },
            { label: "Cerrar sesion", icon: "logout", action: "logout" },
        ],
        guestMenu: [
            { label: "Ingresar", icon: "login", route: "signin" },
            { label: "Crear cuenta", icon: "account-plus", route: "signup" },
        ],
        drawer: false,
        group: null,
        user: null
    }),
    watch: {
        group() {
            this.drawer = false;
        },
    },
    computed: {
    },
    mounted() {
        this.userObj = JSON.parse(localStorage.getItem('user'));
    },
    methods: {
        userAction(route) {
            switch (route) {
                // case "profile":
                //     console.log("profile")
                //     window.location.href = "/users/" + this.userObj.id + "/edit";
                //     break;
                case "signin":
                    // window.location.href = "/login";
                    this.$router.push('/signin')
                    break;
                case "signup":
                    // window.location.href = "/register";
                     this.$router.push('/signup')
                    break;
                case "logout":
                    localStorage.removeItem('user');
                    this.$router.push('/signin')
                    location.reload();
                    break;
                default:
                    break;
            }
        },
        navigate(route) {
            switch (route) {
                case "movies":
                    this.$router.push('/movies')
                    break;
                default:
                    
                    break;
            }
        }
    },
};
</script>
