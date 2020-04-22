const locations=JSON.parse(document.getElementById("map").dataset.locations);


  mapboxgl.accessToken = 'pk.eyJ1Ijoic2F2YW5pNzgiLCJhIjoiY2s5Yms0YjV1MDEyNDNscTk0YmE0aXcwaiJ9.1Yqpe6MqoaISnEBs368ZBA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/savani78/ck9bkaxds04441irr3ci5paw4',
    scrollZoom:false
  });

  const bounds=new mapboxgl.LngLatBounds();
  locations.forEach(loc=>{
      const el=document.createElement('div');
      el.className='marker';

      new mapboxgl.Marker({
          element:el,
          anchor:'bottom'
      })
      .setLngLat(loc.coordinates)
      .addTo(map)

      new mapboxgl.Popup({
        offset:30
      })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
      .addTo(map)

     bounds.extend(loc.coordinates) 
  })
  map.fitBounds(bounds,{
    padding:{
        top:200,
        bottom:150,
        right:200,
        left:200
    }
  })
