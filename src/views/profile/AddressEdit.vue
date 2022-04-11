<template>
  <div class="address-box">
    <nav-bar class="nav-bar">
      <template v-slot:default>
        {{ title }}
      </template>
    </nav-bar>

    <van-address-edit class="addressEdit" :area-list="areaList" :address-info="addressInfo" :show-delete="type == 'edit'" show-set-default show-search-result :search-result="searchResult" :area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onSave" @delete="onDelete" />
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import { addAddress, editAddress, deleteAddress, getAddressDetail } from 'network/address'
import { Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref, reactive, toRefs, computed } from 'vue'
import { Dialog } from 'vant'
export default {
  name: 'AddressEdit',
  components: { NavBar },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const areaCode = ''
    const state = reactive({
      //在线  中国省市县信息
      areaList: are,
      searchResult: [],
      addressInfo: {},
      type: 'add',
      addressId: '',
    })

    onMounted(() => {
      const { type, addressId } = route.query
      state.type = type
      state.addressId = addressId

      if (type == 'edit') {
        getAddressDetail(addressId).then((res) => {
          const addressDetail = res

          state.addressInfo = {
            name: addressDetail.name,
            tel: addressDetail.phone,
            province: addressDetail.province,
            city: addressDetail.city,
            areaCode: areaCode,
            county: addressDetail.county,
            addressDetail: addressDetail.address,
            isDefault: !!addressDetail.is_default,
          }
        })
      }
    })

    const title = computed(() => {
      return state.type == 'add' ? '新增地址' : '编辑地址'
    })

    const onSave = (content) => {
      const params = {
        name: content.name,
        phone: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        address: content.addressDetail,
        is_default: content.isDefault ? 1 : 0,
      }
      if (state.type == 'edit') {
        //修改数据
        editAddress(state.addressId, params)
      } else if (state.type == 'add') {
        //调用接口添加
        addAddress(params)
      }

      Toast('保存成功')
      setTimeout(() => {
        router.back()
      }, 500)
    }
    const onDelete = () => {
      Dialog.confirm({
        message: '确定要删除吗？',
      })
        .then(() => {
          deleteAddress(state.addressId).then((res) => {
            Toast('删除成功')
            setTimeout(() => {
              router.back()
            }, 500)
          })
        })
        .catch(() => {
          Toast('取消成功')
        })
    }

    return {
      ...toRefs(state),
      onSave,
      onDelete,
      title,
    }
  },
}
</script>

<style lang="scss">
.addressEdit {
  margin-top: 60px;
}
</style>
