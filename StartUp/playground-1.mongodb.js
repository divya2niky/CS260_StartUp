

use('Covid');


db.getCollection('us-counties').aggregate([
   {
      $group: { _id: "$county", deaths: { $max: { '$toInt': '$deaths' } } } ,
     
   }
   ,
   { $sort: { deaths: -1 } }, { $limit: 1}
  ])
  

  db.getCollection('us-counties').aggregate([
   {
      $group: { _id: "$county", cases: { $max: { '$toInt': '$cases' } } } ,
     
   }
   ,
   { $sort: { cases: -1 } }, { $limit: 1}
  ])

  db.getCollection('us-counties').aggregate([
   { $match : { county : 'Utah' } },
   {
      $group: { _id: "$county", deaths: { $sum: 1 } } ,
     
   }
  ])
  
   db.getCollection('us-counties').aggregate([
    {
       $addFields: {
         deathrate: {
            $cond: [
                { $eq: [{ '$toInt': '$cases' },0] },
            0,
            { $divide: [{ '$toInt': '$deaths' },{ '$toInt': '$cases' }] }
            ]
       }
    }
    }
    ,
    {
        $group:{_id: "$state"}
    }
   ])

   db.getCollection('us-counties').aggregate([
     {
         $group: { 
            _id: "$state", 
            'totaldeaths': { '$sum' : {'$toInt': '$deaths'}},
            'totalcases': {'$sum':{'$toInt': '$cases'} },
           
               }
      },
      {
         $project: {
           deathrate : {
            $divide: [{ '$toDouble': '$totaldeaths' },{ '$toDouble': '$totalcases' }]
           }
         }
      }
           
            
   ])
             

  
//      "quality": {
//        $cond: [ 
//          { $eq: [ "$downvotes", 0 ] },
//           "N/A", 
//           {"$divide":["$upvotes", "$downvotes"]} 
//       ] 
//       }
       

//      'deathrate': {
               
//       $cond: [
//          { $eq: [{ '$toInt': '$totalcases' },0] },
//          0,
//          { $divide: [{ '$toInt': '$totaldeaths' },{ '$toInt': '$totalcases' }] }
//       ]
   
// }