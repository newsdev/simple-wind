console.clear()
var times = '2018091418 2018091500 2018091506 2018091512 2018091518'
  .split(' ')

d3.loadData(`../raw-data/${times[0]}.json`, 'earth.json', (err, res) => {
  [grib, earth] = res

  var sel = d3.select('#graph').html('')

  var c = d3.conventions({
    sel, 
    margin: {top: 0, bottom: 0, left: 0, right: 0},
    layers: 'scc'
  })

  ;[svg, ctx0, ctx1] = c.layers

  // projection
  !(function(){
    // var extent = [[-83.028,32.2],[-75.59,36.2]]
    extent = [[360 -83.028,32.2],[360 -75.59,46.2]]
    proj = d3.geoTransverseMercator().rotate([-84, 0, -170])
      .fitSize([c.width, c.height], {type: "MultiPoint", coordinates: extent})    

    extent = [[360 -124.848974, 24.396308],[360 -63.885444, 49.384358]]
    proj = d3.geoAlbers()
      .fitSize([c.width, c.height], {type: "MultiPoint", coordinates: extent})    

    // extent = [[0, -90],[360, 90]]
    // proj = d3.geoEquirectangular()
    //   .fitSize([c.width, c.height], {type: "MultiPoint", coordinates: extent})

    console.log(extent[0])  
    extent = [[0, c.height], [c.width, 0]].map(proj.invert)
    extent[0][0] += 360    
    extent[1][0] += 360  
    console.log(extent[0])  
  })()

  var path = d3.geoPath().context(ctx0).projection(proj)
  path(topojson.mesh(earth, earth.objects.coastline_50m))
  ctx0.stroke()

  // rounded extent
  ;[[x0, y0], [x1, y1]] = extent
    .map((d, i) => d.map(i ? Math.ceil : Math.floor).map(d => i ? d + 1 : d - 1))

  var nex = x1 - x0
  var ney = y1 - y0
  points = d3.range(0, nex*ney).map(i => {
    var lng = x0 + (i % nex)
    var lat = y0 + Math.floor(i / nex)

    // var index = (lng + 180) + (lat + 90)*360
    var index = lng + (90 - lat)*360

    var u = grib[0].data[index]
    var v = grib[1].data[index]

    var pos = proj([lng, lat])

    return {lng, lat, u, v, pos}
  })


  svg.appendMany('g', points)
    .translate(d => proj([d.lng, d.lat]))
    .append('circle')
    .at({
      r: 2,
      fill: 'none',
      strokeWidth: .5,
      stroke: '#ccc',
    })
    .parent()
    .append('path')
    .at({
      d: d => 'M 0 0 L' + [d.u*.5, d.v*.5],
      stroke: '#000'
    })

  // ctx1.beginPath()
  // points.forEach(d => {
  //   ctx1.moveTo(d.pos[0], d.pos[1])
  //   ctx1.lineTo(d.pos[0] + d.u, d.pos[1] + d.v)
  // })
  // ctx1.strokeStyle = 'rgba(255,0,255,.5)'
  // ctx1.strokeStyle = '#000'
  // ctx1.stroke()



})