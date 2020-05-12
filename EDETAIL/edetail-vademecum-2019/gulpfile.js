const config = {
    devMainFolder: './dev',
    sharedFolder: './_shared/**', //'_shared/**' Specially for shared resources
    templateSlide: './_template/**',
    templatePopUp: './_template_popup/**',
    ignoreFolders: '!./_*/**',
    zipsFolder: './_zips',
    bkgsFolder: './_bkg',
    bkgImage: 'bg.jpg', //Main image to create the thumbnail
    thumbSize: 1024 //Width in px
};

const fs = require('fs');
const readlineSync = require('readline-sync');
const gulp = require('gulp');
const debug = require('gulp-debug');
const gulp_multidest = require('gulp-multidest'); //Handle Array of destinations
const imageResize = require('gulp-image-resize');
const rename = require("gulp-rename");
const zip = require('gulp-zip');
const injectString = require('gulp-inject-string');
var outOfVeeva = fs.readFileSync('./dev/out_of_veeva.js', 'utf-8');
var folders = [];

const fileSystem = JSON.parse(getoFlows(outOfVeeva));

//console.log(fileSystem);

function getoFlows(data) {
    let sFlows = data;
    let sFlowsStart = sFlows.indexOf('var oFlows =');
    let sFlowsEnd = sFlows.indexOf('* Enable/disable');
    let aFlows = sFlows.substring(sFlowsStart, sFlowsEnd).replace(/\t/g, '').split(/\r?\n/g);
    let cleanFlows = [];

    for (let idx = 0; idx < aFlows.length; idx++) {
        const line = aFlows[idx];
        if (idx != 0 && line != '' && line != ' ' && line != '/**') {
            cleanFlows.push(line);
        }
    }

    return JSONize(cleanFlows.join('').slice(0, -1));
}

function JSONize(str) {
    return str
        // wrap keys without quote with valid double quote
        .replace(/([\$\w]+)\s*:/g, function (_, $1) { return '"' + $1 + '":' })
        // replacing single quote wrapped ones to double quote 
        .replace(/'([^']+)'/g, function (_, $1) { return '"' + $1 + '"' });
}

function traverseFileSystem(currentPath) {
    if (currentPath.indexOf('node_modules') === -1) {
        var files = fs.readdirSync(currentPath);

        for (var i in files) {
            var currentFile = currentPath + '/' + files[i];
            var stats = fs.statSync(currentFile);
            if (stats.isFile()) {
                if ((currentFile.indexOf('index.html') > 0) && currentFile.indexOf('_template') === -1) {
                    folders.push(currentPath);
                }
            }
            else if (stats.isDirectory()) {
                traverseFileSystem(currentFile);
            }
        }
    }
}

// Generating file system array with folders that has index.html 
traverseFileSystem(config.devMainFolder);


//$ gulp createSlides => Build Presentations and KMs as fileSystem variable
gulp.task('createSlides', gulp.series(function (done) {
    if (readlineSync.keyInYN('Do you want to generate all SLIDES? If exist, this will overwrite all content...')) {
        console.log('Generatin CLM structure ...');
        var currPresentation = '';

        Object.keys(fileSystem).forEach(function (presentation, idx) {

            currPresentation = presentation;

            fileSystem[presentation].forEach(function (km, idx) {
                var template = config.templateSlide;

                if (km.file.toLowerCase().indexOf('popup') > 0) {
                    template = config.templatePopUp;
                }
                console.log(template.slice(3, -2), ' => ', config.devMainFolder + '/' + currPresentation + '/' + km.file);
                gulp.src(template, { read: true })
                    .pipe(gulp.dest(config.devMainFolder + '/' + currPresentation + '/' + km.file));
            });
        });
        return done();
    }
    console.log('Ok, not building.');
    process.exit(1);
}));


//$ gulp copyShared => Copy _shared folder inside each KMs. Useful if "Shared Resources" not working
gulp.task('copyShared', function (done) {
    console.log('Coping shared folder to each slide');
    for (let idx = 0; idx < folders.length; idx++) {
        gulp.src(config.sharedFolder)
            .pipe(gulp.dest(folders[idx] + '/shared'));

        gulp.src(folders[idx] + '/index.html')
            .pipe(injectString.after('css/styles.css">', '\n\t<link rel="stylesheet" href="shared/css/shared.css">'))
            .pipe(injectString.after('out_of_veeva.js"></script>', '\n\t<script src="js/shared.js"></script>'))
            .pipe(gulp.dest(folders[idx]));
    }
    done();
});

//$ gulp overwriteFile => Copy _custom/any_file.xxx to each slide. If exist it will overwrite
gulp.task('overwriteFile', function (done) {
    console.log('Overwriting file to each slide');
    for (let idx = 0; idx < folders.length; idx++) {
        const copyThis = './_overwrite/styles.css';
        const destinationFolder = folders[idx] + '/css/';
        gulp.src(copyThis)
            .pipe(gulp_multidest(destinationFolder));
    }
    done();
});


//$ gulp addCustomCss => Copy _custom/custom_styles.css to each slide. If exist it will overwrite
gulp.task('addCustomCss', function (done) {
    console.log('Adding custom CSS to each slide');
    for (let idx = 0; idx < folders.length; idx++) {
        const copyThis = './_custom/custom_styles.css';
        const destinationFolder = folders[idx] + '/css/';
        gulp.src(copyThis)
            .pipe(gulp_multidest(destinationFolder));

        gulp.src(folders[idx] + '/index.html')
            .pipe(injectString.before('</head>', '\t<link rel="stylesheet" href="css/custom_styles.css">\n'))
            .pipe(gulp.dest(folders[idx]));
    }
    done();
});

//$ gulp addCustomJs => Copy _custom/custom_scripts.js to each slide. If exist it will overwrite
gulp.task('addCustomJs', function (done) {
    console.log('Adding custom CSS to each slide');
    for (let idx = 0; idx < folders.length; idx++) {
        const copyThis = './_custom/custom_scripts.js';
        const destinationFolder = folders[idx] + '/js/';
        gulp.src(copyThis)
            .pipe(gulp_multidest(destinationFolder));

        gulp.src(folders[idx] + '/index.html')
            .pipe(injectString.before('</body>', '\t<script src="js/custom_scripts.js"></script>\n'))
            .pipe(gulp.dest(folders[idx]));
    }
    done();
});

//$ gulp moveBkgs => Move background-images in _bkg folder to each slide by order
gulp.task('moveBkgs', function (done) {
    console.log('Moving Backgrounds to each Slide');
    //Format images is: 
    // limit 10 => 1.jpg, 2.jpg ....
    // limit 99 => 01.jpg, 02.jpg ....
    // limit 999 => 001.jpg, 002.jpg ....
    // Los bkgs deben ordenarse según orden de presentación Indesign y formato ....01.jpg 

    var order = 0;
    var bkgSource = fs.readdirSync(config.bkgsFolder);

    bkgSource = bkgSource.sort(function (a, b) {
        // Ej: 01.jpg, en esta configuracion nos vale (0, 2). Ej2: bkg01.jpg (2, 5). 
        return a.slice(0, 2) - b.slice(0, 2);
    });

    console.log('Backgrounds to move: ', bkgSource);

    for (let i = 0; i < bkgSource.length; i++) {
        const bkg = config.bkgsFolder + '/' + bkgSource[i];
        const bkgDest = bkgDestination();
        gulp.src(bkg)
            .pipe(rename('content.jpg'))
            .pipe(gulp.dest(bkgDest));
        console.log('Moving from ' + bkg, ' to ' + bkgDest);
    }

    function bkgDestination() {
        var currentFolder = '';
        for (let idx = 0; idx < folders.length; idx++) {
            currentFolder = folders[order] + '/images/';
        }
        order++;
        return currentFolder;
    }

    done();
});


//$ gulp thumb => Generating thumbnails from bkg image
gulp.task('thumb', function (done) {
    console.log('Generating Thumbnails');
    for (let idx = 0; idx < folders.length; idx++) {
        const folder = folders[idx];
        gulp.src(folder + '/images/' + config.bkgImage, { allowEmpty: true })
            .pipe(imageResize({
                width: config.thumbSize,
                format: 'png'
            }))
            .pipe(rename('thumb.png'))
            .pipe(gulp.dest(folder));
    }
    done();
});


//$ gulp zipSlides => Zip slides and send to zips folder
gulp.task('zipSlides', function (done) {
    console.log('Zipping slides');
    for (let idx = 0; idx < folders.length; idx++) {
        const folder = folders[idx] + '/**/*';
        const folderSplit = folder.split('/');
        const folderDest = config.zipsFolder;
        //folderDest = folderSplit[0] + '/' + folderSplit[1] + '/' + folderSplit[2]; //Zips inside each presentation
        gulp.src(folder)
            .pipe(zip(folderSplit[3] + '.zip'))
            .pipe(gulp.dest(folderDest));
    }
    done();
});


//$ gulp => Default Gulp task
gulp.task('default', gulp.series('thumb', 'zipSlides'), function (done) {
    done();
});