var {_, d3, jp, fs, glob, io} = require('scrape-stl')


var minDate = '2018100900'

var out = []
glob.sync(__dirname + '/raw-data-f/*.json')
  .forEach(path => {
    var date = _.last(path.split('/')).replace('.json', '')
    date = !date.includes('f3') ? date : +date.replace('f3', '') + 3

    if (date < minDate) return

    calculatePoints(path, date)
  })


io.writeDataSync(__dirname + '/03-trail-merged/points.csv', out)


function calculatePoints(path, date){
  var grib = io.readDataSync(path)


  var [[x0, y0], [x1, y1]] = [[258,18],[284,35]]

  // silly hack to fit on the screen
  x0 += -5
  x1 += +5
  y0 += -5
  y1 += +5

  var nx = x1 - x0
  var ny = y1 - y0
  var points = d3.range(0, nx*ny).map(i => {
    var lng = x0 + (i % nx)
    var lat = y0 + Math.floor(i/nx)
    var index = lng + (90 - lat)*360

    var u = grib[0].data[index]
    var v = grib[1].data[index]

    var rv = {lng, lat, u, v, date}

    return rv
  })


  out = out.concat(points)
}
