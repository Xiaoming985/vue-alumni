export const condition = {
  methods: {
    // 学校选项下拉菜单,获取当前有的所有学校
    async getSchool() {
      return await this.$http.getSchool("");
      // let res = await this.$http.getSchool("");
      // return res.data;
    },
    // 年级选项下拉菜单,获取当前学校包含的年级
    async getGradeBySchoolId(school) {
      return await this.$http.getGradeBySchoolId({schoolId: school});
    },
    // 班级选项下拉菜单,获取当前学校、年级下的班级
    async getClass(school, grade) {
      return await this.$http.getClass({
        shoolId: school,
        grade: grade
      })
    }
  }
}