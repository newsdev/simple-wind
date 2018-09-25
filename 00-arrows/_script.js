console.clear()
var times = '2018091418 2018091500 2018091506 2018091512 2018091518'
  .split(' ')

d3.loadData(`../raw-data/${times[0]}.json`, 'earth.json', (err, res) => {
  [grib, earth] = res

  var sel = d3.select('#graph').html('')

  var c = d3.conventions({
    sel, 
    margin: {top: 0, bottom: 0, left: 0, right: 0},
    layers: 'sccc'
  })

  ;[svg, ctx0, ctx1, ctx2] = c.layers
  var {width, height} = c

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

    extent = [[0, c.height], [c.width, 0]].map(proj.invert)
    extent[0][0] += 360    
    extent[1][0] += 360  
  })()

  var path = d3.geoPath().context(ctx0).projection(proj)
  path(topojson.mesh(earth, earth.objects.coastline_50m))
  ctx0.stroke()

  // rounded extent
  ;[[x0, y0], [x1, y1]] = extent
    .map((d, i) => d.map(i ? Math.ceil : Math.floor).map(d => i ? d + 5 : d - 5))

  var nex = x1 - x0
  var ney = y1 - y0
  lnglat2uv = {}
  points = d3.range(0, nex*ney).map(i => {
    var lng = x0 + (i % nex)
    var lat = y0 + Math.floor(i/nex)

    // var index = (lng + 180) + (lat + 90)*360
    var index = lng + (90 - lat)*360

    var u = grib[0].data[index]
    var v = grib[1].data[index]

    var pos = proj([lng, lat])

    var rv = {lng, lat, u, v, pos}

    lnglat2uv[lng + '' + lat] = rv

    return rv
  })

  console.log(d3.extent(points, d => d.lng))
  console.log(d3.extent(points, d => d.lat))

  var s = 1
  grid = d3.range(width*height/s/s).map(i => {
    var px = i*s % width
    var py = Math.floor(i*s / width)*s

    var [lng, lat] = proj.invert([px, py])
    lng = lng + 360

    var rlng = Math.floor(lng)
    var rlat = Math.floor(lat)

    var x0y0 = lnglat2uv[(rlng + 0) + '' + (rlat + 0)]
    var x1y0 = lnglat2uv[(rlng + 1) + '' + (rlat + 0)]
    var x1y1 = lnglat2uv[(rlng + 1) + '' + (rlat + 1)]
    var x0y1 = lnglat2uv[(rlng + 0) + '' + (rlat + 1)]

    if (i == 1200){
      console.log({rlng, rlat})
      console.log(rlng +''+ rlat)
    }

    if (!x0y0 || !x1y0 || !x1y1 || !x0y1) return {px, py, lng, lat, u: 0, v: 0}

    var tx = lng - rlng
    var ty = lat - rlat
    var u = x0y0.u*(1 - tx)*(1 - ty)
          + x1y0.u*(tx - 0)*(1 - ty) 
          + x1y1.u*(tx - 0)*(ty - 0) 
          + x0y1.u*(1 - tx)*(ty - 0) 

    var v = x0y0.v*(1 - tx)*(1 - ty)
          + x1y0.v*(tx - 0)*(1 - ty) 
          + x1y1.v*(tx - 0)*(ty - 0) 
          + x0y1.v*(1 - tx)*(ty - 0) 

    return {px, py, lng, lat, u, v}
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
  // grid.forEach(d => {
  //   ctx1.moveTo(d.px, d.py)
  //   ctx1.lineTo(d.px + d.u*.5, d.py + d.v*.5)
  // })
  // ctx1.strokeStyle = 'rgba(255,0,255,.5)'
  // ctx1.strokeStyle = '#f0f'
  // ctx1.stroke()


  dots = d3.range(1000).map(d => {
    var px = Math.random()*width
    var py = Math.random()*height

    age = Math.random()*100

    return {px, py}
  })

  if (window.timer) window.timer.stop()

  window.timer = d3.timer(t => {
    dots.forEach(d => {
      var px = Math.round(d.px)
      var py = Math.round(d.py)

      var v = grid[px + py*width]

      d.age++
      var inBounds = 0 <= d.px && d.px < width && 0 <= d.py && d.py < height
      if (!v || (v.v == 0 && v.u == 0) || !inBounds || age > 100){
        d.px = Math.random()*width
        d.py = Math.random()*height
        d.u = 0 
        d.v = 0
        d.age = 0
      } else {
        d.v = v.v/5
        d.u = v.u/5

        d.px += d.v 
        d.py += d.u 
      }
    })

    // ctx2.globalCompositeOperation = "destination-in";
    ctx2.fillStyle = 'rgba(0, 0, 0, .001)'
    ctx2.fillRect(0, 0, width, height)
    ctx2.globalCompositeOperation = 'source-over'

    ctx2.beginPath()
    dots.forEach(d => {
      ctx2.moveTo(d.px, d.py)
      ctx2.lineTo(d.px + d.u*5, d.py + d.v*5)
      // console.log(d.px, d.py)
    })
    ctx2.strokeStyle = '#f0f'
    ctx2.stroke()

  })

})