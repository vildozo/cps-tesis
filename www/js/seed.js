angular.module('starter.seed', [])

.factory('DataSeed', function() {
  function seedLaggingSkills($cordovaSQLite){
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS lagging_skills (id integer primary key, description text)");
  }
  return {
    seed: function($cordovaSQLite, db) {
      seedLaggingSkills($cordovaSQLite);
      return;
    },
    deleteSeed: function($cordovaSQLite, db){
      $cordovaSQLite.execute(db, "DROP TABLE lagging_skills");
    }
  };
});
