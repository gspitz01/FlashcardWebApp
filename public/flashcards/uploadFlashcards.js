angular.module('app').component('uploadFlashcards', {
  templateUrl: '/flashcards/uploadFlashcards.html',
  bindings: {
    uploadFile: '&'
  },
  controller: function() {
    this.upload = function() {
      var file = document.getElementById('file').files[0];
      if (file) {
        this.uploadFile({file: file});
      }
    };
  }
});