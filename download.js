var { execSync } = require('child_process')
var fs = require('fs')

var cmdStr = `
curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t00z.pgrb2.1p00.f000&lev_10_m_above_ground=on&var_UGRD=on&var_VGRD=on&dir=%2Fgfs.2018091500" -o raw-data/gfs.t00z.pgrb2.1p00.f000.2018091500
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data/2018091500.json raw-data/gfs.t00z.pgrb2.1p00.f000.2018091500

curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f000&lev_10_m_above_ground=on&var_UGRD=on&var_VGRD=on&dir=%2Fgfs.2018091506" -o raw-data/gfs.t06z.pgrb2.1p00.f000.2018091506
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data/2018091506.json raw-data/gfs.t06z.pgrb2.1p00.f000.2018091506

curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t12z.pgrb2.1p00.f000&lev_10_m_above_ground=on&var_UGRD=on&var_VGRD=on&dir=%2Fgfs.2018091512" -o raw-data/gfs.t12z.pgrb2.1p00.f000.2018091512
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data/2018091512.json raw-data/gfs.t12z.pgrb2.1p00.f000.2018091512

curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t18z.pgrb2.1p00.f000&lev_10_m_above_ground=on&var_UGRD=on&var_VGRD=on&dir=%2Fgfs.2018091518" -o raw-data/gfs.t18z.pgrb2.1p00.f000.2018091518
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data/2018091518.json raw-data/gfs.t18z.pgrb2.1p00.f000.2018091518
`


execSync(cmdStr.replace(/20180915/g, '20181007'))
execSync(cmdStr.replace(/20180915/g, '20181008'))
execSync(cmdStr.replace(/20180915/g, '20181009'))
execSync(cmdStr.replace(/20180915/g, '20181010'))



// var out = ''

// out = out + cmdStr.replace(/20180915/g, '20181009')


// fs.writeFileSync(__dirname + '/download.sh', out)



