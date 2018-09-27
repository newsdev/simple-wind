console.clear()

var times = '2018091418 2018091500 2018091506 2018091512 2018091518 2018091600 2018091606 2018091612 2018091618 2018091700 2018091706 2018091712 2018091718 2018091800 2018091806 2018091812 2018091818 2018091900 2018091906 2018091912 2018091918'
  .split(' ')

function load(cb){

  d3.loadData(
    '../00-arrows/earth.json', 
    ...times.map(d => `../raw-data/${d}.json`), 
    (err, res) => {
      [earth, ...gribs] = res

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
    layers: 'sccd'
  })

  ;[svg, ctx0, ctxBot, divSel] = c.layers
  var {width, height} = c

  var timeSel = divSel.append('div')
    .st({right: 10, top: 10, fontSize: 25, color: '#fff', position: 'absolute'})

  var extent = [[360 -83.028,28.2],[360 -75.59,46.2]]
  var proj = d3.geoTransverseMercator().rotate([-84, 0, -170])
    .fitSize([c.width, c.height], {type: "MultiPoint", coordinates: extent})    

  d3.geoPath().context(ctx0).projection(proj)
    (topojson.mesh(earth, earth.objects.coastline_50m))
  ctx0.strokeStyle = "rgba(255,255,0,.4)"
  ctx0.stroke()

  var s = 5
  console.time('parse gribs')
  frames = gribs.map((d, i) => makeGrid(width, height, s, proj, d, i))
  console.timeEnd('parse gribs')
  frames.forEach((d, i) => d.date = d3.timeParse('%Y%m%d%H')(times[i]))

  var pathStr = d => 'M 0 0 L' + [d.u*.8, -d.v*.8]

  // var pointsSel = svg.appendMany('g', t0.points)
  //   .translate(d => proj([d.lng, d.lat]))
  //   .append('circle')
  //   .at({r: 2,fill: 'none',strokeWidth: .5,stroke: '#f0f',})
  //   .parent().append('path').at({d: pathStr, stroke: '#f0f'})

  // gridSel = svg.appendMany('g', frames[0].grid)
  //   .translate(d => [d.px, d.py])
  //   .append('circle')
  //   .at({r: 2,fill: 'none',strokeWidth: .3, stroke: '#f0f',})
  //   .parent().append('path').at({d: pathStr, stroke: '#f0f'})

  var frameRate = 3000

  dots = d3.range(5000).map(d => randomDot())

  function randomDot(d = {}){
    d.px = Math.random()*width
    d.py = Math.random()*height
    d.u = d.v = 0 
    d.age = d.age ? 0 : Math.random()*100

    return d
  }

  var gridWidth = Math.ceil(width/s)

  if (window.timer) window.timer.stop()
  window.timer = d3.timer(t => {

    // vector fields to interpolate between
    var frameIndex = Math.floor(t/frameRate) % frames.length
    var frame0 = frames[frameIndex]
    var frameIndexNext = (frameIndex + 1) % frames.length
    var frame1 = frames[frameIndexNext]

    // how far we are between 0 and 1
    var gt = t/frameRate % 1

    var time = d3.interpolate(frame0.date, frame1.date)(gt)
    timeSel.text(d3.timeFormat('%Y-%m-%d %H:%M')(time))
    // timeSel.text([frame0.index, frame1.index, Math.round(gt*1000)/1000])

    var isLastFrame = frameIndex == frames.length - 1
    if (isLastFrame) ft = 1 // no animation on last frame

    // var gridBetween = frame0.grid.map((d, index) => {
    //   var v0 = frame0.grid[index]
    //   var v1 = frame1.grid[index]

    //   return {
    //     u: v0.u + gt*(v1.u - v0.u),
    //     v: v0.v + gt*(v1.v - v0.v),
    //   }
    // })

    // gridSel.data(gridBetween).at({d: pathStr, strokeWidth: 1})


    dots.forEach(d => {
      var px = Math.floor(d.px/s) % gridWidth
      var py = Math.floor(d.py/s)

      // A     B
      //
      //
      // D     C
      var [A, B, C, D] = [
        (px + 0) + (py + 0)*gridWidth,
        (px + 1) + (py + 0)*gridWidth,
        (px + 1) + (py + 1)*gridWidth,
        (px + 0) + (py + 1)*gridWidth,
      ].map(index => {
        var v0 = frame0.grid[index]
        var v1 = frame1.grid[index]

        if (!v0 || !v1) return null

        return {
          u: v0.u + gt*(v1.u - v0.u),
          v: v0.v + gt*(v1.v - v0.v),
        }
      })

      if (!A || !B || !C || !D || d.age++ > 100) return randomDot(d)

      // https://en.wikipedia.org/wiki/Bilinear_interpolation
      var tx = d.px/s - px
      var ty = d.py/s - py
      
      var u = A.u*(1 - tx)*(1 - ty) + B.u*(tx - 0)*(1 - ty) + C.u*(tx - 0)*(ty - 0) + D.u*(1 - tx)*(ty - 0) 
      var v = A.v*(1 - tx)*(1 - ty) + B.v*(tx - 0)*(1 - ty) + C.v*(tx - 0)*(ty - 0) + D.v*(1 - tx)*(ty - 0) 

      d.u = u/5
      d.v = v/5
      d.px += d.u
      d.py += -d.v
      d.mag = Math.sqrt(d.u*d.u + d.v*d.v)
    })

    ctxBot.globalCompositeOperation = 'destination-in'
    ctxBot.fillStyle = isLastFrame ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.93)'
    ctxBot.fillRect(0, 0, width, height)
    ctxBot.globalCompositeOperation = 'source-over'

    if (isLastFrame) return

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





}


init()