// sets up my mapbox access token so they can track my usage of their basemap services
mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpdmFtOTk3IiwiYSI6ImNqdWQ5ZDBicDB3bmE0ZHJ2NzF0Zjd4MHAifQ.klvBSqkgGNt7aNjxU7x0Gg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-118.243103,34.068587],
    zoom: 9
});

var zoomThreshold = 4;

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {

    $.getJSON('data/ghg-data.geojson', function(data) {

      map.addSource('ghg-data', {
          'type': 'geojson',
          'data': data,
      });
      // adding layer of total GHG - base layer
      map.addLayer({
        id: 'total-ghg-fill',
        type: 'fill',
        source: 'ghg-data',
        paint: {
          'fill-opacity': 0.7,
          'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'Total_GHG'],
              0, '#f1eef6',
              5000000, '#bdc9e1',
              10000000, '#74a9cf',
              25000000, '#2b8cbe',
              39065890, '#2b8cbe'
          ],
        },
      });
      // adding all other Sector layers
      map.addLayer({
        id: 's-energy-fill',
        type: 'fill',
        source: 'ghg-data',
        paint: {
          'fill-opacity': 0.7,
          'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'Stationary Energy'],
              0, '#f1eef6',
              5000000, '#bdc9e1',
              10000000, '#74a9cf',
              25000000, '#2b8cbe',
              39065890, '#2b8cbe'
          ],
        },
        'layout': {
          'visibility': 'none'
        }
      });

      map.addLayer({
        id: 'trans-fill',
        type: 'fill',
        source: 'ghg-data',
        paint: {
          'fill-opacity': 0.7,
          'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'Transportation'],
              0, '#f1eef6',
              5000000, '#bdc9e1',
              10000000, '#74a9cf',
              25000000, '#2b8cbe',
              39065890, '#2b8cbe'
          ],
        },
        'layout': {
          'visibility': 'none'
        }
      });

      map.addLayer({
        id: 'waste-fill',
        type: 'fill',
        source: 'ghg-data',
        paint: {
          'fill-opacity': 0.7,
          'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'Waste'],
              0, '#f1eef6',
              5000000, '#bdc9e1',
              10000000, '#74a9cf',
              25000000, '#2b8cbe',
              39065890, '#2b8cbe'
          ],
        },
        'layout': {
          'visibility': 'none'
        }
      });

      map.addLayer({
        id: 'industry-fill',
        type: 'fill',
        source: 'ghg-data',
        paint: {
          'fill-opacity': 0.7,
          'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'Industrial Processes and Product Use'],
              0, '#f1eef6',
              5000000, '#bdc9e1',
              10000000, '#74a9cf',
              25000000, '#2b8cbe',
              39065890, '#2b8cbe'
          ],
        },
        'layout': {
          'visibility': 'none'
        }
      });

      map.addLayer({
        id: 'ag-fill',
        type: 'fill',
        source: 'ghg-data',
        paint: {
          'fill-opacity': 0.7,
          'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'Agriculture, Forestry and Other Land Use'],
              0, '#f1eef6',
              5000000, '#bdc9e1',
              10000000, '#74a9cf',
              25000000, '#2b8cbe',
              39065890, '#2b8cbe'
          ],
        },
        'layout': {
          'visibility': 'none'
        }
      });

      map.addLayer({
        id: 'city-boundary',
        type: 'line',
        source: 'ghg-data',
        paint: {
          'line-opacity': 0.8,
          'line-color': 'gray',
          'line-opacity': {
            stops: [[8, 0], [9.4, 1]], // zoom-dependent opacity, the lines will fade in between zoom level 14 and 14.8
          }
        }
      });

      // add an empty data source, which we will use to highlight the lot the user is hovering over
      map.addSource('highlight-feature', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })

      // add a layer for the highlighted lot
      map.addLayer({
        id: 'highlight-line',
        type: 'line',
        source: 'highlight-feature',
        paint: {
          'line-width': 1.5,
          'line-opacity': 0.9,
          'line-color': 'black',
        }
      });

      // when the mouse moves, do stuff!
      map.on('mousemove', function (e) {
        // query for the features under the mouse, but only in the lots layer
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['total-ghg-fill'],
        });

        // get the first feature from the array of returned features.
        var lot = features[0]

        if (lot) {  // if there's a lot under the mouse, do stuff
          map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

          // use jquery to display the address and land use description to the sidebar

          var ghg_value = numeral(lot.properties['Total_GHG']).format('0,0');
          var pop_value = numeral(lot.properties['Population']).format('0,0');
          var se_value = numeral(lot.properties['Stationary Energy']).format('0,0');
          var trans_value = numeral(lot.properties['Transportation']).format('0,0');
          var was_value = numeral(lot.properties['Waste']).format('0,0');
          var ind_value = numeral(lot.properties['Industrial Processes and Product Use']).format('0,0');
          var ag_value = numeral(lot.properties['Agriculture, Forestry and Other Land Use']).format('0,0');

          $('#line1').text("City: " + lot.properties.city_name);
          $('#line2').text("Total GHG " + ghg_value);
          $('#line3').text("Population " + pop_value);
          $('#line4').text("Stationary Energy " + se_value);
          $('#line5').text("Transportation " + trans_value);
          $('#line6').text("Waste " + was_value);
          $('#line7').text("Industrial Processes and Product Use " + ind_value);
          $('#line8').text("Agriculture, Forestry and Other Land Use " + ag_value);

          // set this lot's polygon feature as the data for the highlight source
          map.getSource('highlight-feature').setData(lot.geometry);
        } else {
          map.getCanvas().style.cursor = 'default'; // make the cursor default

          // reset the highlight source to an empty featurecollection
          map.getSource('highlight-feature').setData({
            type: 'FeatureCollection',
            features: []
          });
        }
      })

      $('.overview').on('click', function() {
        map.setLayoutProperty('s-energy-fill', 'visibility', 'none')
        map.setLayoutProperty('total-ghg-fill', 'visibility', 'visible')
        map.setLayoutProperty('trans-fill', 'visibility', 'none')
        map.setLayoutProperty('waste-fill', 'visibility', 'none')
        map.setLayoutProperty('industry-fill', 'visibility', 'none')
        map.setLayoutProperty('ag-fill', 'visibility', 'none')
      })

      $('.s-energy').on('click', function() {
        map.setLayoutProperty('s-energy-fill', 'visibility', 'visible')
        map.setLayoutProperty('total-ghg-fill', 'visibility', 'none')
        map.setLayoutProperty('trans-fill', 'visibility', 'none')
        map.setLayoutProperty('waste-fill', 'visibility', 'none')
        map.setLayoutProperty('industry-fill', 'visibility', 'none')
        map.setLayoutProperty('ag-fill', 'visibility', 'none')
      })

      $('.trans').on('click', function() {
        map.setLayoutProperty('s-energy-fill', 'visibility', 'none')
        map.setLayoutProperty('total-ghg-fill', 'visibility', 'none')
        map.setLayoutProperty('trans-fill', 'visibility', 'visible')
        map.setLayoutProperty('waste-fill', 'visibility', 'none')
        map.setLayoutProperty('industry-fill', 'visibility', 'none')
        map.setLayoutProperty('ag-fill', 'visibility', 'none')
      })

      $('.waste').on('click', function() {
        map.setLayoutProperty('s-energy-fill', 'visibility', 'none')
        map.setLayoutProperty('total-ghg-fill', 'visibility', 'none')
        map.setLayoutProperty('trans-fill', 'visibility', 'none')
        map.setLayoutProperty('waste-fill', 'visibility', 'visible')
        map.setLayoutProperty('industry-fill', 'visibility', 'none')
        map.setLayoutProperty('ag-fill', 'visibility', 'none')
      })

      $('.industry').on('click', function() {
        map.setLayoutProperty('s-energy-fill', 'visibility', 'none')
        map.setLayoutProperty('total-ghg-fill', 'visibility', 'none')
        map.setLayoutProperty('trans-fill', 'visibility', 'none')
        map.setLayoutProperty('waste-fill', 'visibility', 'none')
        map.setLayoutProperty('industry-fill', 'visibility', 'visible')
        map.setLayoutProperty('ag-fill', 'visibility', 'none')
      })

      $('.ag').on('click', function() {
        map.setLayoutProperty('s-energy-fill', 'visibility', 'none')
        map.setLayoutProperty('total-ghg-fill', 'visibility', 'none')
        map.setLayoutProperty('trans-fill', 'visibility', 'none')
        map.setLayoutProperty('waste-fill', 'visibility', 'none')
        map.setLayoutProperty('industry-fill', 'visibility', 'none')
        map.setLayoutProperty('ag-fill', 'visibility', 'visible')
      })

    });



});
