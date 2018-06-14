angular.module('app').component('categoryList', {
  templateUrl: '/categories/categoryList.html',
  bindings: {
    categories: '='
  },
  controller: function() {
    this.createNewCategory = function() {
      this.categories.$add({name: this.newCategoryName, count: 0});
      this.newCategoryName = '';
    };
  }
})