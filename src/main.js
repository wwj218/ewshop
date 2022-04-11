import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';

import {Uploader,PullRefresh ,List, Grid, GridItem,Popup,ContactCard,Dialog,Area,AddressList,AddressEdit,Icon,SubmitBar,Stepper,SwipeCell,CheckboxGroup ,Checkbox,CellGroup ,Field,Tag, Button,Image as VanImage,Card , Swipe, SwipeItem,Lazyload,Badge, Sidebar, SidebarItem,Collapse, CollapseItem,Tab, Tabs,Form} from 'vant';

createApp(App)
.use(Swipe).use(SwipeItem).use(Lazyload,{
  loading:require('./assets/images/default.png')
}).use(Badge).use(Sidebar).use(SidebarItem).use(Collapse).use(CollapseItem).use(Icon)
.use(Tab).use(Tabs).use(Card).use(VanImage).use(Tag).use(Button).use(SwipeCell).use(SubmitBar)
.use(Form).use(Field).use(CellGroup).use(CheckboxGroup).use(Checkbox).use(Stepper)
.use(AddressEdit).use(AddressList).use(Area).use(Dialog).use(ContactCard)
.use(Popup).use(Grid).use(GridItem).use(List).use(PullRefresh).use(Uploader)
.use(store).use(router).mount('#app')
