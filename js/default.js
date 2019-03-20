// initial lat lng
var centerLat = 35.681195;
var centerLng = 139.767021;

// map zoom level
var ymapZoomLevel = 15;

// map property
var ymap = new Y.Map("map",
{configure :
  {doubleClickZoom : false,
   scrollWheelZoom : true,
   singleClickPan : true,
   dragging : true}
});

// marker target
var contentData = "./content/content.json";

$(function () {
  // add zoom control
  var control = new Y.SliderZoomControlVertical();
  ymap.addControl(control);

  // add layer set
  control = new Y.LayerSetControl();
  ymap.addControl(control);

  // draw map
  ymap.drawMap(new Y.LatLng(centerLat, centerLng), ymapZoomLevel, Y.LayerSetId.NORMAL);

  // road marker contents
  $.ajax({
    type: 'GET',
    url: contentData,
    dataType: 'json'
  })
  .then(
    function(json) {
      for (var i = 0; i < json.list.length; i++) {
        // add marker
        var marker = new Y.Marker(new Y.LatLng(json.list[i].lat, json.list[i].lon), json.list[i].name);
        ymap.addFeature(marker);

        // add label
        var label = new Y.Label(new Y.LatLng(json.list[i].lat, json.list[i].lon), json.list[i].name);
        ymap.addFeature(label);
      } 
    }
  );

  // list
  var list = new Vue({
    el: "#list",
    data: {
      head:"List",
      items: []
    },
    beforeCreate: function () {
      axios.get(contentData)
          .then(function (response) {
            list.items = response.data;
          })
          .catch(function (error) {
              console.log(error);
          });
    },
    methods: {
      cardClick: function (lat,lon) {
        var pan = new Y.LatLng(lat,lon);
        ymap.setZoom(ymapZoomLevel, true, pan, true);
      }
    }
  })
});

