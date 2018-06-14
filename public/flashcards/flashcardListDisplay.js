angular.module('app').component('flashcardListDisplay', {
  templateUrl: '/flashcards/flashcardListDisplay.html',
  bindings: {
    flashcards: '=',
    removeFlashcard: '&',
    selectFlashcard: '&'
  },
  controller: function() {
    this.deleteFlashcard = function(flashcard) {
      this.removeFlashcard({flashcard: flashcard});
    };
    
    this.clickRow = function(flashcard) {
      this.selectFlashcard({flashcard: flashcard});
    }
  }
})