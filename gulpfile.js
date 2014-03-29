var gulp = require('gulp');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var react = require('react-tools');
var replace = require('gulp-replace');

var jsxy = function (name) {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-react', 'Streaming not supported'));
            return cb();
        }

        var str = file.contents.toString();

        if (path.extname(file.path) === '.jsx' && str.indexOf('/** @jsx') === -1) {
            str = '/** @jsx React.DOM */\n' + str;
        }

        try {
            file.contents = new Buffer(react.transform(str));
            file.path = gutil.replaceExtension(file.path, '.js');
        } catch (err) {
            err.fileName = file.path;
            this.emit('error', new gutil.PluginError('gulp-react', err));
        }

        this.push(file);
        cb();
    });
};


var html = ['app/index.html'];
var js = ['app/src/*.jsx','app/src/*.js'];
var sounds = ['app/sounds/*'];
var styles = ['app/styles/*'];
var external = ['app/lib/**/*'];
var copyStuff = ['app/manifest.json'];
var images =['app/imgs/*'];

gulp.task('js',function(){
   return gulp.src(js)
       .pipe(jsxy())
       .pipe(gulp.dest('dest/src'));
});

gulp.task('copy',function(){
   return gulp.src(copyStuff)
       .pipe(gulp.dest('dest/'));
});

gulp.task('images',function(){
    return gulp.src(images)
        .pipe(gulp.dest('dest/imgs/'));
});

gulp.task('sounds',function(){
    return gulp.src(sounds)
        .pipe(gulp.dest('dest/sounds/'));
});
gulp.task('styles',function(){
    return gulp.src(styles)
        .pipe(gulp.dest('dest/styles/'));
});
gulp.task('external',function(){
    return gulp.src(external)
        .pipe(gulp.dest('dest/lib/'));
});



gulp.task('html',function(){
    return gulp.src(html)
    .pipe(replace('<script src="lib/react-0.8.0/build/JSXTransformer.js"></script>'," "))
    .pipe(replace("<link href='http://fonts.googleapis.com/css?family=Lily+Script+One|Pontano+Sans' rel='stylesheet' type='text/css'>"," "))
        .pipe(replace('<script type="text/jsx" src="src/components.jsx"></script>','<script src="src/components.js"></script>'))
        .pipe(gulp.dest('dest/'));
});

gulp.task('watch',function(){
    gulp.watch(js,['js']);
    gulp.watch(copyStuff,['copy']);
    gulp.watch(styles,['styles']);
    gulp.watch(html,['html']);
});

gulp.task('default',['js','html','copy','images','sounds','styles','external','watch']);
