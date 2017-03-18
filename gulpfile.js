(() => {
    const gulp = require('gulp');
    const webserver = require('gulp-webserver');
    const pug = require('gulp-pug');
    const watch = require('gulp-watch');
    const exec = require('child_process').exec
    const base = __dirname;

    const fs = require('fs');

    

    const md = require('jstransformer')(require('jstransformer-markdown-it'));

    const options = {
        filters: {
            md: function(str) {
                return md.render(str).body;
            }
        }
    };
    // const pugFiles = '*.pug';

   

    const taskPug = () => {
        gulp.src(['*.pug','archive/*.pug','posts/*/*.pug'])
            .pipe(pug(options))
            .pipe(gulp.dest(file => file.base));
    }

    gulp.task('pug', taskPug);

    gulp.task('watch', ['pug'], (cb) => {
        watch(['*.pug', 'archive/*.pug', 'posts/*/*.pug', '*.md', 'posts/*/*.md', 'css/*.css'], {
            cwd: './',
            verbose: true
        }, taskPug);

        setTimeout(cb, 1);
    });


    gulp.task('webserver', function() {
        gulp.src('./')
            .pipe(webserver({
                port: 1874,
                livereload: true,
                directoryListing: false,
                open: true,
                fallback: 'index.html'
            }));
    });


    gulp.task('task', function(cb) {
        exec('node js/genData.js', function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });
    gulp.task('default', ['task', 'watch', 'webserver']);
})();