angular.module('app').component('editFlashcard', {
  templateUrl: '/flashcards/editFlashcard.html',
  bindings: {
    categories: '=',
    editedFlashcard: '=',
    createNewFlashcard: '&',
    updateFlashcard: '&'
  },
  controller: function($scope) {
    
    $scope.$watch('$ctrl.editedFlashcard', (function(newData) {
      if (!!newData) {
        this.editing = true;
        this.front = newData.front;
        this.back = newData.back;
        this.selectedCategory = this.categories[this.categories.$indexFor(newData.category.id)];
      }
    }).bind(this));
    
    this.setDefaults = function() {
      this.front = '';
      this.back = '';
      this.selectedCategory = this.categories[0];
    };
    this.setDefaults();
    
    this.create = function() {
      this.flashcardData = {
        front: this.front,
        back: this.back,
        category_name: this.selectedCategory.name,
        category_id: this.selectedCategory.$id
      };
      this.setDefaults();
      this.createNewFlashcard({flashcardData: this.flashcardData})
    };
    
    this.cancel = function() {
      this.setDefaults();
      this.editing = false;
      this.editedFlashcard = null;
    }
    
    this.save = function() {
      this.editedFlashcard.front = this.front;
      this.editedFlashcard.back = this.back;
      this.editedFlashcard.category_name = this.selectedCategory.name;
      this.editedFlashcard.category_id = this.selectedCategory.$id;
      this.updateFlashcard();
      this.cancel();
    }
  }
})