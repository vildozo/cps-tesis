angular.module('starter.services').factory('AdultConcernFactory', function($cordovaSQLite) {

  function getAdultsConcerns(unsolvedProblemId,callback){
    var adultConcerns = [];
    var query ="SELECT * FROM adults_concerns WHERE unsolved_problem_id = ?";
    $cordovaSQLite.execute(db,query,[unsolvedProblemId]).then(function(result) {
      var rows = result.rows;
      if(rows.length) {
        for(var i=0; i < rows.length; i++){
          adultConcerns.push(rows.item(i));
        }
      }
      callback(adultConcerns);
      },function(err){
        console.log(err.message);
      });
  }

  function insertAdultsConcern(adultsConcern){
    var query ="INSERT INTO adults_concerns(description,unsolved_problem_id) VALUES (?,?)";
    $cordovaSQLite.execute(db,query,[adultsConcern.description,adultsConcern.unsolvedProblemId]);
  }

  function updateAdultsConcern(adultsConcern){
    var query = "";
    query = "UPDATE adults_concerns SET description = ? where id = ?";
    return $cordovaSQLite.execute(db, query, [adultsConcern.description, adultsConcern.id]);
  }

  function deleteAdultsConcern(adultsConcern, callback) {
    var query = "DELETE FROM adults_concerns where id = ?";
    $cordovaSQLite.execute(db, query, [adultsConcern.id]).then(function(res) {
        callback();
    }, function (err) {
        console.error(err);
    });
  }

  return {
    all: function(unsolvedProblemId,callback) {
      getAdultsConcerns(unsolvedProblemId,callback);
    },
    insert: function(adultsConcern) {
      insertAdultsConcern(adultsConcern);
    },
    update: function(adultsConcern) {
      updateAdultsConcern(adultsConcern);
    },
    delete: function(adultsConcern, callback) {
      deleteAdultsConcern(adultsConcern, callback);
    }
  };
});
