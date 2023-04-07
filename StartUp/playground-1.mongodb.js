

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
      },
      {
          $sort: { deathrate: -1 } 
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
       },
       {
           $sort: { deathrate: 1 } 
       }, 
       { $limit: 1}
            
             
    ])
             

  db.getCollection('covid_vaccination').aggregate([
      {
         $group: {
           _id: "$Entity",
           'totalvaccinatedpop': {'$max': {'$toInt' : '$people_fully_vaccinated'}}
         },
      },
      {
         $set:{
            '_id' : {
               '$cond': [
                  {$eq:['$_id','New York State']}, 
                  'New York',
                  '$_id'
               ]
            }
         }
      },
      {'$out':'vaccinated'}
       

  ])

  //Lowest 10 states w.r.t death rates of vulnerable pop

  db.getCollection('us-counties').aggregate([
   {
      $group: {
        _id: {'state':'$state','county':'$county'},
        'totaldeaths': { '$max' : {'$toInt': '$deaths'}},
          'totalcases': {'$max':{'$toInt': '$cases'} }
      }
         
   },
   {
       $group: { 
          _id: '$_id.state', 
          'totaldeaths': { '$sum' : '$totaldeaths'},
          'totalcases': {'$sum':'$totalcases' },
         
             }
    },
    {
      '$lookup' : {'from':'population', 'localField': '_id','foreignField':'STNAME','as':'pop' }
    },
    {
      '$unwind':'$pop'
    },
    {
      '$project': {'_id' : 1, 'totaldeaths' : 1, 'totalcases' : 1, 'population' : {'$sum' : {'$toInt': '$pop.POPESTIMATE2019'}}}
    },
    {
      $group:{ '_id':'$_id','totaldeaths':{'$max':'$totaldeaths'},'totalcases': {'$max':'$totalcases'},'population':{'$max':'$population'}}
    },
    {
      '$lookup':{'from':'vaccinated','localField':'_id','foreignField':'_id','as':'vaccinated'}
    },
    {
      '$unwind': '$vaccinated'
    },
    {
      '$project':{'_id': 1, 'totaldeaths' : 1,'totalcases': 1, 'population': 1, 'vaccinated': {'$max':{'$toInt': '$vaccinated.totalvaccinatedpop'}}}
    },
    {
      '$project' : {'_id': 1, 'totaldeaths' : 1,'totalcases': 1, 'population': 1,'vaccinated' : 1, 'vulnerablepop' : {'$subtract' : ['$population','$vaccinated']}}
    },
    {
      '$project' : {'_id' : 1,'totaldeaths': 1,'totalcases' : 1, 'population' : 1, 'vulnerablepop' : 1,'caserate' : {'$divide':['$totalcases','$vulnerablepop']},'deathrate':{'$divide':['$totaldeaths','$vulnerablepop']}}
    },
    {
        $sort: { deathrate: 1 } 
    }, 
    { $limit: 10}
          
 ])

 //Highest 10 states w.r.t death rates of vulnerable pop

 db.getCollection('us-counties').aggregate([
   {
      $group: {
        _id: {'state':'$state','county':'$county'},
        'totaldeaths': { '$max' : {'$toInt': '$deaths'}},
          'totalcases': {'$max':{'$toInt': '$cases'} }
      }
         
   },
   {
       $group: { 
          _id: '$_id.state', 
          'totaldeaths': { '$sum' : '$totaldeaths'},
          'totalcases': {'$sum':'$totalcases' },
         
             }
    },
    {
      '$lookup' : {'from':'population', 'localField': '_id','foreignField':'STNAME','as':'pop' }
    },
    {
      '$unwind':'$pop'
    },
    {
      '$project': {'_id' : 1, 'totaldeaths' : 1, 'totalcases' : 1, 'population' : {'$sum' : {'$toInt': '$pop.POPESTIMATE2019'}}}
    },
    {
      $group:{ '_id':'$_id','totaldeaths':{'$max':'$totaldeaths'},'totalcases': {'$max':'$totalcases'},'population':{'$max':'$population'}}
    },
    {
      '$lookup':{'from':'vaccinated','localField':'_id','foreignField':'_id','as':'vaccinated'}
    },
    {
      '$unwind': '$vaccinated'
    },
    {
      '$project':{'_id': 1, 'totaldeaths' : 1,'totalcases': 1, 'population': 1, 'vaccinated': {'$max':{'$toInt': '$vaccinated.totalvaccinatedpop'}}}
    },
    {
      '$project' : {'_id': 1, 'totaldeaths' : 1,'totalcases': 1, 'population': 1,'vaccinated' : 1, 'vulnerablepop' : {'$subtract' : ['$population','$vaccinated']}}
    },
    {
      '$project' : {'_id' : 1,'totaldeaths': 1,'totalcases' : 1, 'population' : 1, 'vulnerablepop' : 1,'caserate' : {'$divide':['$totalcases','$vulnerablepop']},'deathrate':{'$divide':['$totaldeaths','$vulnerablepop']}}
    },
    {
        $sort: { deathrate: -1 } 
    }, 
    { $limit: 10}
          
 ])
 //Lowest 10 states w.r.t case rates of vulnerable pop

 db.getCollection('us-counties').aggregate([
   {
      $group: {
        _id: {'state':'$state','county':'$county'},
        'totaldeaths': { '$max' : {'$toInt': '$deaths'}},
          'totalcases': {'$max':{'$toInt': '$cases'} }
      }
         
   },
   {
       $group: { 
          _id: '$_id.state', 
          'totaldeaths': { '$sum' : '$totaldeaths'},
          'totalcases': {'$sum':'$totalcases' },
         
             }
    },
    {
      '$lookup' : {'from':'population', 'localField': '_id','foreignField':'STNAME','as':'pop' }
    },
    {
      '$unwind':'$pop'
    },
    {
      '$project': {'_id' : 1, 'totaldeaths' : 1, 'totalcases' : 1, 'population' : {'$sum' : {'$toInt': '$pop.POPESTIMATE2019'}}}
    },
    {
      $group:{ '_id':'$_id','totaldeaths':{'$max':'$totaldeaths'},'totalcases': {'$max':'$totalcases'},'population':{'$max':'$population'}}
    },
    {
      '$lookup':{'from':'vaccinated','localField':'_id','foreignField':'_id','as':'vaccinated'}
    },
    {
      '$unwind': '$vaccinated'
    },
    {
      '$project':{'_id': 1, 'totaldeaths' : 1,'totalcases': 1, 'population': 1, 'vaccinated': {'$max':{'$toInt': '$vaccinated.totalvaccinatedpop'}}}
    },
    {
      '$project' : {'_id': 1, 'totaldeaths' : 1,'totalcases': 1, 'population': 1,'vaccinated' : 1, 'vulnerablepop' : {'$subtract' : ['$population','$vaccinated']}}
    },
    {
      '$project' : {'_id' : 1,'totaldeaths': 1,'totalcases' : 1, 'population' : 1, 'vulnerablepop' : 1,'caserate' : {'$divide':['$totalcases','$vulnerablepop']},'deathrate':{'$divide':['$totaldeaths','$vulnerablepop']}}
    },
    {
        $sort: { caserate: 1 } 
    }, 
    { $limit: 10}
          
 ])

 //Highest 10 states w.r.t death rates of vulnerable pop

 db.getCollection('us-counties').aggregate([
   {
      $group: {
        _id: {'state':'$state','county':'$county'},
        'totaldeaths': { '$max' : {'$toInt': '$deaths'}},
          'totalcases': {'$max':{'$toInt': '$cases'} }
      }
         
   },
   {
       $group: { 
          _id: '$_id.state', 
          'totaldeaths': { '$sum' : '$totaldeaths'},
          'totalcases': {'$sum':'$totalcases' },
         
             }
    },
    {
      '$lookup' : {'from':'population', 'localField': '_id','foreignField':'STNAME','as':'pop' }
    },
    {
      '$unwind':'$pop'
    },
    {
      '$project': {'_id' : 1, 'totaldeaths' : 1, 'totalcases' : 1, 'population' : {'$sum' : {'$toInt': '$pop.POPESTIMATE2019'}}}
    },
    {
      $group:{ '_id':'$_id','totaldeaths':{'$max':'$totaldeaths'},'totalcases': {'$max':'$totalcases'},'population':{'$max':'$population'}}
    },
    {
      '$lookup':{'from':'vaccinated','localField':'_id','foreignField':'_id','as':'vaccinated'}
    },
    {
      '$unwind': '$vaccinated'
    },
    {
      '$project':{'_id': 1, 'totaldeaths' : 1,'totalcases': 1, 'population': 1, 'vaccinated': {'$max':{'$toInt': '$vaccinated.totalvaccinatedpop'}}}
    },
    {
      '$project' : {'_id': 1, 'totaldeaths' : 1,'totalcases': 1, 'population': 1,'vaccinated' : 1, 'vulnerablepop' : {'$subtract' : ['$population','$vaccinated']}}
    },
    {
      '$project' : {'_id' : 1,'totaldeaths': 1,'totalcases' : 1, 'population' : 1, 'vulnerablepop' : 1,'caserate' : {'$divide':['$totalcases','$vulnerablepop']},'deathrate':{'$divide':['$totaldeaths','$vulnerablepop']}}
    },
    {
        $sort: { caserate: -1 } 
    }, 
    { $limit: 10}
          
 ])

 //Highest 10 states w.r.t death divided by cases

 db.getCollection('us-counties').aggregate([
   {
      $group: {
        _id: {'state':'$state','county':'$county'},
        'totaldeaths': { '$max' : {'$toInt': '$deaths'}},
          'totalcases': {'$max':{'$toInt': '$cases'} }
      }
         
   },
   {
       $group: { 
          _id: '$_id.state', 
          'totaldeaths': { '$sum' : '$totaldeaths'},
          'totalcases': {'$sum':'$totalcases' },
         
             }
    },
    {
      '$project' : {'_id' : 1,'totaldeaths': 1,'totalcases' : 1, 'deathsovercases' : {'$divide':['$totaldeaths','$totalcases']}}
    },
    {
        $sort: { caserate: -1 } 
    }, 
    { $limit: 10}
          
 ])

  //Lowest 10 states w.r.t death divided by cases

  db.getCollection('us-counties').aggregate([
   {
      $group: {
        _id: {'state':'$state','county':'$county'},
        'totaldeaths': { '$max' : {'$toInt': '$deaths'}},
          'totalcases': {'$max':{'$toInt': '$cases'} }
      }
         
   },
   {
       $group: { 
          _id: '$_id.state', 
          'totaldeaths': { '$sum' : '$totaldeaths'},
          'totalcases': {'$sum':'$totalcases' },
         
             }
    },
    {
      '$project' : {'_id' : 1,'totaldeaths': 1,'totalcases' : 1, 'deathsovercases' : {'$divide':['$totaldeaths','$totalcases']}}
    },
    {
        $sort: { caserate: 1 } 
    }, 
    { $limit: 10}
          
 ])


 use('Covid');


db.getCollection('us-counties').aggregate([
   {
      $group: { _id: "$county", deaths: { $max: { '$toInt': '$deaths' } } } ,
     
   }
   ,
   { $sort: { deaths: -1 } }, { $limit: 1}
  ])
