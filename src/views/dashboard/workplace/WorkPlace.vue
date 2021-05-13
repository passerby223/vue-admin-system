<template>
  <page-layout v-if="currUser" :avatar="currUser.avatar">
    <detail-list size="small" :col="2" slot="headerContent">
      <detail-list-item term="用户名">{{ currUser.username }}</detail-list-item>
      <detail-list-item term="部门">{{ currUser.department === '' ? '未填写' : currUser.department }}</detail-list-item>
      <detail-list-item term="职位">{{ currUser.position === '' ? '未填写' : currUser.position }}</detail-list-item>
      <detail-list-item term="邮箱">{{ currUser.email }}</detail-list-item>
      <detail-list-item term="电话">{{ currUser.phone === '' ? '未填写' : currUser.phone }}</detail-list-item>
      <detail-list-item term="角色">{{ currUser.is_staff ? '管理员' : '普通用户' }}</detail-list-item>
    </detail-list>
    <template slot="extra">
      <head-info title="项目数量" content="3" />
      <head-info title="测试套件数量" content="19" />
      <head-info title="测试用例数量" content="2647" />
    </template>
    <template slot="action">
      <a-button type="primary" @click="showDrawer">修改个人信息</a-button>
      <a-drawer
        title="更新用户信息"
        :width="400"
        :visible="visible"
        :maskClosable="false"
        :body-style="{ paddingBottom: '80px' }"
        @close="onClose"
      >
        <a-form-model ref="updateUserRuleFormRef" :model="updateUserForm" :rules="updateUserFormRules">
          <a-form-model-item prop="username">
            <a-input allowClear size="large" placeholder="用户名" v-model="updateUserForm.username">
              <a-icon slot="prefix" type="user" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input-password
              allowClear
              size="large"
              placeholder="密码(可在此输入新密码以替换旧密码)"
              v-model="updateUserForm.password"
              type="password"
            >
              <a-icon slot="prefix" type="lock" />
            </a-input-password>
          </a-form-model-item>
          <a-form-model-item prop="email">
            <a-input allowClear size="large" placeholder="邮箱" v-model="updateUserForm.email">
              <a-icon slot="prefix" type="mail" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="department">
            <a-input allowClear size="large" placeholder="部门" v-model="updateUserForm.department">
              <a-icon slot="prefix" type="cluster" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="position">
            <a-input allowClear size="large" placeholder="职位" v-model="updateUserForm.position">
              <a-icon slot="prefix" type="idcard" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="phone">
            <a-input allowClear size="large" placeholder="电话" v-model="updateUserForm.phone">
              <a-icon slot="prefix" type="phone" />
            </a-input>
          </a-form-model-item>
          <a-button
            type="primary"
            style="width: 100%; margin-top: 24px"
            size="large"
            @click="submitUpdateUserForm('updateUserRuleFormRef')"
            >修改</a-button
          >
        </a-form-model>
      </a-drawer>
    </template>
  </page-layout>
  <page-layout v-else>
    <a-spin size="large" />
  </page-layout>
</template>

<script>
import { mapState } from 'vuex'
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
import DetailList from '@/components/tool/DetailList'
import { getUserProfile, logout, updateUserProfile } from '@/services/user'
import { getUserId } from '@/utils/auth'
import { mapMutations } from 'vuex'
const DetailListItem = DetailList.Item
export default {
  name: 'WorkPlace',
  components: { HeadInfo, DetailList, PageLayout, DetailListItem },
  computed: {
    ...mapState('account', { currUser: 'user' })
  },
  data() {
    let validateMail = (rule, value, callback) => {
      if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/g.test(value)) {
        callback(new Error('输入的邮箱格式不对'))
      } else {
        callback()
      }
    }
    return {
      updateUserForm: {
        username: '',
        password: '',
        email: '',
        department: '',
        position: '',
        phone: ''
      },
      visible: false,
      updateUserFormRules: {
        username: [{ min: 6, max: 150, message: '用户名长度不能小于6个字符或超过150个字符', trigger: 'change' }],
        password: [{ min: 6, max: 128, message: '密码长度不能小于6个字符或超过128个字符', trigger: 'change' }],
        email: [
          { min: 8, max: 254, message: '邮箱长度不能小于8个字符或超过254个字符', trigger: 'change' },
          { validator: validateMail, trigger: 'change' }
        ],
        department: [{ min: 1, max: 128, message: '邮箱长度不能小于1个字符或超过128个字符', trigger: 'change' }],
        position: [{ min: 1, max: 128, message: '职位长度不能小于1个字符或超过128个字符', trigger: 'change' }],
        phone: [{ min: 11, max: 11, message: '电话长度必须为11个字符', trigger: 'change' }]
      }
    }
  },
  methods: {
    ...mapMutations('account', ['removeUser', 'setUser']),
    // 获取当前登录用户的信息
    getUserInfo() {
      getUserProfile(getUserId()).then((res) => {
        this.updateUserForm.username = res.data.username
        this.updateUserForm.email = res.data.email
        this.updateUserForm.department = res.data.department
        this.updateUserForm.position = res.data.position
        this.updateUserForm.phone = res.data.phone
      })
    },
    // 显示抽屉
    showDrawer() {
      this.getUserInfo()
      this.visible = true
    },
    // 关闭抽屉
    onClose() {
      this.resetForm('updateUserRuleFormRef')
      this.visible = false
    },
    // 修改用户信息点击事件
    submitUpdateUserForm() {
      let updateUserInfoData = {}
      for (let val in this.updateUserForm) {
        if (this.updateUserForm[val] !== '') {
          updateUserInfoData[val] = this.updateUserForm[val]
        }
      }
      updateUserProfile(getUserId(), updateUserInfoData).then((res) => {
        this.$message.success(res.message)
        if (updateUserInfoData['password']) {
          this.$message.info('登录已失效,请重新登录')
          logout()
          this.removeUser()
          this.$router.push('/login')
        } else {
          // 获取当前登录用户的信息，更新store中的数据
          getUserProfile(getUserId()).then((res) => {
            this.setUser(res.data)
          })
          // 关闭抽屉
          this.onClose()
        }
      })
    },
    // 重置表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less">
@import 'index';
</style>
