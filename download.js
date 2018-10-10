var { execSync } = require('child_process')
var fs = require('fs')


var cmdStr = `
curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f000&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006" -o raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100600
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data-f/2018100600.json raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100600

curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f003&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006" -o raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100600f3
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data-f/2018100600f3.json raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100600f3



curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f000&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006" -o raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100606
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data-f/2018100606.json raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100606

curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f003&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006" -o raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100606f3
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data-f/2018100606f3.json raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100606f3




curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f000&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006" -o raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100612
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data-f/2018100612.json raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100612

curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f003&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006" -o raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100612f3
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data-f/2018100612f3.json raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100612f3




curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f000&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006" -o raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100618
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data-f/2018100618.json raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100618

curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f003&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006" -o raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100618f3
../grib2json/target/grib2json-0.8.0-SNAPSHOT/bin/grib2json -d -n -o raw-data-f/2018100618f3.json raw-data-f/gfs.t00z.pgrb2.1p00.f000.2018100618f3


`


execSync(cmdStr.replace(/20181006/g, '20181007'))
execSync(cmdStr.replace(/20181006/g, '20181008'))
execSync(cmdStr.replace(/20181006/g, '20181009'))
execSync(cmdStr.replace(/20181006/g, '20181010'))



cmdStr2 = `
"http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t00z.pgrb2.1p00.f000&lev_10_m_above_ground=on&var_UGRD=on&var_VGRD=on&dir=%2Fgfs.2018100600"
"http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t00z.pgrb2.1p00.f003&lev_10_m_above_ground=on&var_UGRD=on&var_VGRD=on&dir=%2Fgfs.2018100600"
"http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f000&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006"
"http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f000&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006"
"http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=gfs.t06z.pgrb2.1p00.f003&lev_10_m_above_ground=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.2018101006"


`


// var out = ''

// out = out + cmdStr.replace(/20181006/g, '20181009')


// fs.writeFileSync(__dirname + '/download.sh', out)



