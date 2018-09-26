console.clear()

var times = '2018091418 2018091500 2018091506 2018091512 2018091518'
  .split(' ')

function load(cb){
  d3.loadData(`../raw-data/${times[0]}.json`, 'earth.json', (err, res) => {
    [grib, earth] = res

    cb()
  })
}

function init(){
  // load data if we haven't yet
  if (!window.earth) return load(init)

  var sel = d3.select('#graph').html('')

  var c = d3.conventions({
    sel, 
    margin: {top: 0, bottom: 0, left: 0, right: 0},
    layers: 'scc'
  })

  ;[svg, ctx0, ctxBot] = c.layers
  var {width, height} = c

  var extent = [[360 -83.028,28.2],[360 -75.59,46.2]]
  var proj = d3.geoTransverseMercator().rotate([-84, 0, -170])
    .fitSize([c.width, c.height], {type: "MultiPoint", coordinates: extent})    

  d3.geoPath().context(ctx0).projection(proj)
    (topojson.mesh(earth, earth.objects.coastline_50m))
  ctx0.strokeStyle = "rgba(255,255,0,.4)"
  ctx0.stroke()

  var s = 10
  var {grid, points} = makeGrid(width, height, s, proj)

  console.log(points.length)



  var pointsSel = svg.appendMany('g', points)
    .translate(d => proj([d.lng, d.lat]))
    .append('circle')
    .at({r: 2,fill: 'none',strokeWidth: .5,stroke: '#f0f',})
    .parent()
    .append('path')
    .at({d: d => 'M 0 0 L' + [d.u*.8, -d.v*.8], stroke: '#f0f'})

  var gridSel = svg.appendMany('g', grid)
    .translate(d => [d.px, d.py])
    .append('circle')
    .at({r: 2,fill: 'none',strokeWidth: .3,stroke: '#fff',})
    .parent()
    .append('path')
    .at({d: d => 'M 0 0 L' + [d.u*.8, -d.v*.8], stroke: '#fff'})
}


init()