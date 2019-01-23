const fs = require('fs');
//var ffmpeg = require('fluent-ffmpeg');
var path = require('path');





//app.use(express.static(path.join(__dirname, 'ffmpeg')));

// ffmpeg.setFfmpegPath(path.join(__dirname, 'ffmpeg/bin/ffmpeg.exe'));
// ffmpeg.setFfprobePath(path.join(__dirname, 'ffmpeg/bin/ffprobe.exe'));

var findVideos = function (dir, fileList) {

    fileList = fileList || [];
    fs.readdir(dir, function (error, files) {

        if (error) throw error;
        files.forEach(function (fileElements) {
            //var innerPath = path.join(dir,'/',fileElements); 

            fs.readdir(dir + '/' + fileElements, function (error2, videoFiles) {

                if (error) throw error2;

                videoFiles.forEach(video => {
                    //if (!fs.statSync(fileElements+'/'+video).isDirectory()) {
                    //File list is not a directory, so we push to our list
                    
                    var splitter = video.split(".");
                    var mymeType = splitter[1];
                    if (mymeType === "db") {
                        // do nothing, cos we dont want to add non video files to our DB
                    } else {
                        fileList.push({ url: encodeURI(fileElements + '/' + video), name: fileElements });

                    }

                    //console.log("File -- " + fileElements + '/' + video)
                    //Get all Videos and store their thumbnails in a folder

                    //var path = require('path'), // Default node module

                    splitpath = video.split(".");
                    snapshot = splitpath[0];

                    pathToFile = path.join(__dirname, "videos", fileElements, video);
                    pathToSnapshot = path.join(__dirname, "thumbnails", `${snapshot}.jpg`);

                    // Also a default node module
                    require('child_process').exec(('ffmpeg -ss 00:00:25 -i ' + pathToFile + ' -vframes 1 -q:v 2 ' + pathToSnapshot), function () {
                        console.log('Saved the thumb to:', pathToSnapshot);

                    });

                });

            });

        });

    });


    return fileList;

};

function formatTxt(txt) {
    txt = path.basename(txt, '.mp4');
    txt = decodeURI(txt);
    return txt;
    //return txt.substring(0, 45);
}

module.exports = { findVideos };
