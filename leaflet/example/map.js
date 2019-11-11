var testLayer = myJSONmaps['targets'][8]["webmap"][0];
var mapDiv = document.getElementById("map");
var lat;
var lng;
var normalLongitude = true;
var postiveEast = true;


console.log(testLayer);

    // Create new projection with Proj4Leaflet
    var northStere = new L.Proj.CRS('EPSG:32661', '+proj=stere +lat_0=90 +lon_0=0' +
        '+k=1 +x_0=0 +y_0=0 +a=3396190 +b=3376200 +units=m +no_defs', {
        // Copied from an example, could be causing problems
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],    
        origin: [0, 0]    // This could be causing problems?
    });

    var geodesic = new L.Proj.CRS('EPSG:4326', '+proj=longlat' +
      ' +a=3396190 +b=3376200 +no_defs', {
      // Copied from an example, could be causing problems
      resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],    
      origin: [0, 0]    // This could be causing problems?
    });


    var map = L.map('map', { 
        center: [90, 0],     //Leaflet uses lat lon order
        zoom: 2,
        crs: L.CRS.EPSG4326
    });




    var layers = {
      'base': [],
      'overlays': [],
      'wfs': []
    };

    var targets = myJSONmaps['targets'];
    for(var i = 0; i < targets.length; i++) {
      var currentTarget = targets[i];

      if (currentTarget['name'].toLowerCase() == 'mars') {

        var jsonLayers = currentTarget['webmap'];
        for(var j = 0; j < jsonLayers.length; j++) {
          var currentLayer = jsonLayers[j];

          if(currentLayer['type'] == 'WMS') {
            // Base layer check
            if(currentLayer['transparent'] == 'false') {
              layers['base'].push(currentLayer);
            }
            else {
              layers['overlays'].push(currentLayer);
            }
          }  
          else { 
            layers['wfs'].push(currentLayer);
          }  
        }
      }  
    }

    var baseMaps = {};
    for(var i = 0; i < layers['base'].length; i++) {
        var layer = layers['base'][i];
        if(layer['projection'] == 'cylindrical') {
            var baseLayer = L.tileLayer.wms(String(layer['url']) + 
                    '?map=' + String(layer['map']), 
                {
                    layers: String(layer["layer"]),
                });
            var name = String(layer["displayname"]);
            baseMaps[name] = baseLayer;
            if(layer['primary'] == "true") {
              baseLayer.addTo(map);
            }
        }   
    }

    var overlays = {};
    for(var i = 0; i < layers['overlays'].length; i++) {
        layer = layers['overlays'][i];
        if(layer['projection'] == 'cylindrical') {
            var overlay = L.tileLayer.wms(String(layer['url']) + 
                    '?map=' + String(layer['map']), 
                {
                    layers: String(layer["layer"])
                });
            var name = String(layer["displayname"]);
            overlays[name] = overlay;
        }   
    }

    L.control.layers(baseMaps, overlays).addTo(map);

    // L.control.coordinates({
    //     // position:"bottomleft", //optional default "bootomright"
    //     decimals: 2, //optional default 4
    //     decimalSeperator:".", //optional default "."
    //     labelTemplateLat:"Latitude: {y}", //optional default "Lat: {y}"
    //     labelTemplateLng:"Longitude: {x}", //optional default "Lng: {x}"
    //     enableUserInput: false, //optional default true
    //     // useDMS:false, //optional default false
    //     useLatLngOrder: true, //ordering of labels, default false-> lng-lat
    // }).addTo(map);


    L.control.scale({
        imperial: false
    }).addTo(map);

   /* L.control.mousePosition({
        position: "bottomright",
        numDigits: 2

    }).addTo(map);*/

    
    




    // button functions!

    var northPoleProjection =  document.getElementById("projectionNorthPole");
    northPoleProjection.onclick = function(){projectionSwitcher(northPoleProjection.title)};

    var southPoleProjection =  document.getElementById("projectionSouthPole");
    southPoleProjection.onclick = function(){projectionSwitcher(southPoleProjection.title)};

    var cylindricalProjection =  document.getElementById("projectionCylindrical");
    cylindricalProjection.onclick = function(){projectionSwitcher(cylindricalProjection.title)};

    function projectionSwitcher( titleName)
    {
        if(titleName == northPoleProjection.title)
        {
            northPoleProjection.src = "./images/north-pole-hot.png"
            southPoleProjection.src = "./images/south-pole.png"
            cylindricalProjection.src = "./images/cylindrical.png"
        }
        else if (titleName == southPoleProjection.title)
        {
            northPoleProjection.src = "./images/north-pole.png"
            southPoleProjection.src = "./images/south-pole-hot.png"
            cylindricalProjection.src = "./images/cylindrical.png"
        }
        else if (titleName == cylindricalProjection.title)
        {
            northPoleProjection.src = "./images/north-pole.png"
            southPoleProjection.src = "./images/south-pole.png"
            cylindricalProjection.src = "./images/cylindrical-hot.png"
        }
    }

    // Postive East and Postive West Lon Lat switchers
    var directionForm =  document.getElementById("consoleLonDirSelect");
    directionForm.onchange = function(){latitudeSwithcer( directionForm.value)};

    function latitudeSwithcer( formValue)
    {
        if (formValue == "PositiveWest")
        {
            postiveEast = false;
        }
        else if (formValue == "PositiveEast")
        {
            postiveEast = true;
        }
    }

    // Longitude Degree swithcers 0 to 360, -180 to 180
    var longitudeForm =  document.getElementById("consoleLonDomSelect");
    longitudeForm.onchange = function(){longitudeSwitcher( longitudeForm.value)};

    // changes normalLongitude from true to false. If its 0 to 360 it will be true.
    function longitudeSwitcher (formValue)
    {
        if( formValue == "180")
        {
            normalLongitude = false;
            console.log("Not Implemented 180");
        }
        else if (formValue == "360")
        {
            normalLongitude = true;
        }
    }


    
    // Console Lat Type Switchers. AKA planetocentric and PlanetOgrpahic
    var latitudeTypeForm =  document.getElementById("consoleLatTypeSelect");
    latitudeTypeForm.onchange = function(){latitudeTypeSwitcher( latitudeTypeForm.value)};

    function latitudeTypeSwitcher (formValue)
    {
        if( formValue == "Planetographic")
        {
            console.log("Not Implemented Planetographic");
        }
        else if (formValue == "Planetocentric")
        {
            console.log("Not Implemented Planetocentric");
        }
    }

var latitudeTypeForm =  document.getElementById("latLng");
var cords;

map.addEventListener('mousemove', function(e)
{
  lat = e.latlng.lat;
  lng = e.latlng.lng;

  if (normalLongitude)
  {
      lng = Math.abs(lng) % 360;
  }
  else
  {
    if (lng < 0)
    {
        if (Math.floor(lng/180)%2 == 0)
        {
            lng = lng % 180
        }
        else
        {
            lng = Math.abs(lng) % 180;
        }
    }
    else 
    {
        if (Math.floor(lng/180)%2 == 0)
        {
            lng = lng % 180
        }
        else
        {
            lng = (Math.abs(lng) % 180) * -1;
        }
    }
  }
  
  if(!postiveEast)
  {
      if(normalLongitude)
      {
        lng = Math.abs(lng - 360);
      }
      else
      {
          lng *= -1;
      }
  }

  latitudeTypeForm.innerHTML = "Lat Lon: "+ 
            lat.toFixed(2) +", " + lng.toFixed(2);
});

