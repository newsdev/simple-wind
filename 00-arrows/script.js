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

  ;[svg, ctx0, ctxBot] = c.layers
  var {width, height} = c

  extent = [[360 -83.028,28.2],[360 -75.59,46.2]]
  proj = d3.geoTransverseMercator().rotate([-84, 0, -170])
    .fitSize([c.width, c.height], {type: "MultiPoint", coordinates: extent})    

  extent = [[0, c.height], [c.width, 0]]
    .map(proj.invert)
    .map(d => { d[0]+= 360; return d })

  d3.geoPath().context(ctx0).projection(proj)
    (topojson.mesh(earth, earth.objects.coastline_50m))
  ctx0.strokeStyle = "rgba(255,255,0,.4)"
  ctx0.stroke()

  // rounded extent
  ;[[x0, y0], [x1, y1]] = extent
    .map((d, i) => d.map(i ? Math.ceil : Math.floor).map(d => i ? d + 5 : d - 5))

  var nx = x1 - x0
  var ny = y1 - y0
  lnglat2uv = {}
  points = d3.range(0, nx*ny).map(i => {
    var lng = x0 + (i % nx)
    var lat = y0 + Math.floor(i/nx)
    var index = lng + (90 - lat)*360

    var u = grib[0].data[index]
    var v = grib[1].data[index]

    var pos = proj([lng, lat])
    var rv = {lng, lat, u, v, pos}

    lnglat2uv[lng + '' + lat] = rv
    return rv
  })

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

    if (!x0y0 || !x1y0 || !x1y1 || !x0y1) return {px, py, lng, lat, u: 0, v: 0}

    // https://en.wikipedia.org/wiki/Bilinear_interpolation
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

  dots = d3.range(5000).map(d => randomDot())

  function randomDot(d = {}){
    d.px = Math.random()*width
    d.py = Math.random()*height
    d.u = d.v = 0 
    d.age = d.age ? 0 : Math.random()*100

    return d
  }

  if (window.timer) window.timer.stop()
  window.timer = d3.timer(t => {
    xOffset += 0
    dots.forEach(d => {
      var px = Math.round(d.px + xOffset) % width
      var py = Math.round(d.py)

      var v = grid[px + py*width]
      if (!v || d.age++ > 100) return randomDot(d)
        
      d.u = v.u/5
      d.v = v.v/5
      d.px += d.u
      d.py += -d.v
      d.mag = Math.sqrt(d.u*d.u + d.v*d.v)
    })

    ctxBot.globalCompositeOperation = 'destination-in'
    ctxBot.fillStyle = 'rgba(0, 0, 0, 0.97)'
    ctxBot.fillRect(0, 0, width, height)
    ctxBot.globalCompositeOperation = 'source-over'

    var opacityScale = d3.scaleLinear().domain([0, 10]).range([.15, 1])
    d3.nestBy(dots, d => Math.round(d.mag)).forEach(bucket => {
      ctxBot.beginPath()
      bucket.forEach(d => {
        ctxBot.moveTo(d.px, d.py)
        ctxBot.lineTo(d.px + d.u, d.py + -d.v)
      })
      ctxBot.strokeStyle = `rgba(255,255,255,${opacityScale(bucket.key)})`
      ctxBot.stroke()
    })
  })







  // svg.appendMany('g', points)
  //   .st({opacity: .5})
  //   .translate(d => proj([d.lng, d.lat]))
  //   .append('circle')
  //   .at({
  //     r: 2,
  //     fill: 'none',
  //     strokeWidth: .5,
  //     stroke: '#f0f',
  //   })
  //   .parent()
  //   .append('path')
  //   .at({
  //     d: d => 'M 0 0 L' + [d.u*.8, -d.v*.8],
  //     stroke: '#f0f'
  //   })


})