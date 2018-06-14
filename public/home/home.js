angular.module('app').component('home', {
  templateUrl: '/home/home.html',
  bindings: {
    flashcards: '=',
    categories: '='
  },
  controller: function() {
    var ctrl = this;
    
    this.createFlashcard = function(flashcardData) {
      this.flashcards.$add(flashcardData);
      var categoryToUpdate = this.categories[this.categories.$indexFor(flashcardData.category.id)];
      categoryToUpdate.count += 1;
      this.categories.$save(categoryToUpdate);
    };
    
    this.editFlashcard = function(flashcard) {
      this.editedFlashcard = flashcard;
    };
    
    this.updateFlashcard = function() {
      this.flashcards.$save(this.editedFlashcard);
    };
    
    this.removeFlashcard = function(flashcard) {
      var category = this.categories[this.categories.$indexFor(flashcard.category.id)];
      this.flashcards.$remove(flashcard);
      category.count -= 1;
      this.categories.$save(category);
    };
    
    var translateInputFlashcards = function(flashcards) {
      return flashcards.map(function(flashcard) {
        return {front: flashcard.name, back: flashcard.description, category: flashcard.type};
      });
    };
    
    var getCategoryCounts = function(flashcards) {
      var categoryCounts = {};
      angular.forEach(flashcards, function(flashcard) {
        if (!categoryCounts[flashcard.category]) {
          categoryCounts[flashcard.category] = 1;
        } else {
          categoryCounts[flashcard.category] += 1;
        }
      });
      return categoryCounts;
    };
    
    var getCategoryNameToKeyMap = function() {
      var categoryNameToKey = {};
      angular.forEach(ctrl.categories, function(category) {
        if (!categoryNameToKey[category.name]) {
          categoryNameToKey[category.name] = category.$id;
        }
      });
      return categoryNameToKey;
    }
    
    var addNewCategories = function(newFlashcards) {
      // get number of flashcards per category
      var categoryCounts = getCategoryCounts(newFlashcards);
      
      // Get set of categories
      var newFlashcardCategories = new Set(newFlashcards.map(function(flashcard) {
        return flashcard.category;
      }));
      
      // Array of promises to be returned
      var promises = new Array();
      var categoryNameToKeyMap = getCategoryNameToKeyMap();
      angular.forEach(newFlashcardCategories, function(category) {
        // Check to see if category is already in the database
        if (!categoryNameToKeyMap[category]) {
          // Category not yet in database
          // push the promise to check for resolution later
          promises.push(ctrl.categories.$add({name: category, count: categoryCounts[category]}));
        } else {
          // Category already in database
          // just update count
          var count = categoryCounts[category];
          var categoryToUpdate = ctrl.categories[ctrl.categories.$indexFor(categoryNameToKeyMap[category])];
          categoryToUpdate.count += count;
          ctrl.categories.$save(categoryToUpdate);
        }
      });
      return promises;
    };
    
    var addNewFlashcards = function(newFlashcards) {
      angular.forEach(newFlashcards, function(flashcard) {
        var category = ctrl.categories[ctrl.categories.$indexFor(getCategoryNameToKeyMap()[flashcard.category])];
        var flashcardToSave = {
          front: flashcard.front,
          back: flashcard.back,
          category: {name: category.name, id: category.$id}
        };
        // Save the flashcard
        ctrl.flashcards.$add(flashcardToSave);
      });
    };
    
    var onJsonLoaded = function(evt) {
      var fileString = evt.target.result;
      var newFlashcards = JSON.parse(fileString);
      newFlashcards = translateInputFlashcards(newFlashcards);
      // Add all categories first
      var categoryPromises = addNewCategories(newFlashcards);
      // Wait for all the promises from adding the categories
      Promise.all(categoryPromises).then(function() {
        // Then add flashcards
        addNewFlashcards(newFlashcards);
      });
    };
    
    var onFileReadError = function(evt) {
      if (evt.target.error.name === "NotReadableError") {
        ctrl.errorMessage = "Could not read file!";
      }
    }
    
    this.getAsText = function(file) {
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = onJsonLoaded;
      reader.onerror = onFileReadError;
    };
    
    this.uploadFile = function(file) {
      if (file) {
        this.getAsText(file);
      }
    };
  }
});