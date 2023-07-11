function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6FNiGkwvleO":
        Script1();
        break;
      case "5XCHocoVvNZ":
        Script2();
        break;
  }
}

function Script1()
{
  /////SCRIPT 1 - Run @ top of slide to get most recent experienced statement for the user, then grab that statement's object ID and parent ID, and set two Storyline variables in the background. This should be placed on the xAPI_Initialize shape. Before this runs, there should be at least two variables populated: verbID and verbDisplay (we may also rest the xSlideID and xSlideDisplay values).

var tincan = new TinCan({
        url: window.location.href
    });
    var statementFound = false;
    var result = tincan.getStatements({
        sendActor: true,
        params: {
            verb: {
                id: "http://adlnet.gov/expapi/verbs/experienced"
            }
        },
        callback: function (err, result) {
            if (result.statements.length > 0) {

                //Grab the last slide that this user experienced
                var statementData = result.statements[0];
                var thisSlide = statementData.target;
                //Grab the slide-level ID for this value
                var thisSlideID = thisSlide.id;
                var thisSlideID = String(thisSlideID);
                var thisSlideDef = thisSlide.definition;
                var thisSlideDef = String(thisSlideDef);
                //Grab the context for this value
                var thisSlideContext = statementData.context.contextActivities.grouping;
                var thisSlideContext = String(thisSlideContext);

                //Make sure we found statements
                statementFound = true;

                //log statementssssssss
                //alert("STATEMENTS RETRIEVED!!!");
                //console.log(statementData);
                //console.log(thisSlide);
                //console.log("getData ID: " + thisSlideID);
                //console.log("getData Context: " + thisSlideContext);
                var player = GetPlayer();
                player.SetVar("xSlideID_xAPI", thisSlideID);
                player.SetVar("xCourseID_xAPI", thisSlideContext);
                player.SetVar("xSlideName_xAPI", thisSlideDef);


            }
        }
    });
    
}

function Script2()
{
  /////SCRIPT 2b - Run @ top of slide for mastered/failed/completed/results slides. Any instance where the object ID would be the same as the slide's (and the parent would be the course). This also includes a result element. Find the blocks at bottom for variations. If a passed/successful statement: the result element should include a true success result and potentially a score; if failed, it should include a false success result. If we're capturing an answer, it will live here too.


    //////GET AND SET AUTOMATIC VALUES
    //////Get last item touched ID value
    //var targetObject = "#" + event.target.id;
    //console.log("tincan targetObject: " + targetObject);

    //////Walk up the parents until we find the slide object div, then grab that aria label
    //var objectName = $(targetObject).parentsUntil(".slide-object").parent().attr("aria-label");
    // console.log("tincan objectName = " + objectName);

    //////Set the slide ID
    var player = GetPlayer();
    var slideID = player.GetVar("xSlideID_xAPI");
    // console.log("tincan slide id is: " + slideID)

    //////Set the activity ID
    var courseID = player.GetVar("xCourseID_xAPI");
    // console.log("tincan slide id is: " + courseID)

    /////Set the slide name
    var slideName = player.GetVar("xSlideName_xAPI");
    console.log(slideName);

    //////Set the objectID from the objectName value
    //var objectID = objectName.split(" ").join("-").toLowerCase();
    //console.log("tincan object ID: " + objectID);

    //var objectID = slideID + "/" + objectID;
    // console.log("tincan object ID expanded: " + objectID);

    //////Set the verb values
    var verbID = GetPlayer().GetVar("verbID_xAPI");
    //  console.log("tincan verbID: " + verbID);

    var verbDisplay = GetPlayer().GetVar("verbDisplay_xAPI");
    //  console.log("tincan verbDisplay: " + verbDisplay);

   /////Set the user response value
    var userMessage = GetPlayer().GetVar("userResponse_xAPI");
    


    //////CONSTRUCT AND SEND THE STATEMENT
    var tincan2 = new TinCan({
        url: window.location.href
    });

    tincan2.sendStatement({
        "verb": {
            "id": verbID,
            "display": {
                "en-US": verbDisplay,
            }
        },

"result": {
                  "response": userMessage,
                },
        "context": {
            "contextActivities": {
                "parent": [
                    {
                        "id": courseID,
        }
      ],
                "grouping": [
                    {
                        "id": courseID,
        }
      ]
            }
        },
        "object": {
            "id": slideID,
            "definition": {
                "name": {
                    "en-US": slideName,
                },
                "description": {
                    "en-US": slideName,
                }
            },
            "objectType": "Activity"
        }

    });
          
}

