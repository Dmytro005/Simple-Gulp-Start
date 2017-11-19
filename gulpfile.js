var gulp 			= require('gulp'),
    sass 			= require('gulp-sass'),
    browserSync 	= require('browser-sync'),
    concat 			= require('gulp-concat'),
    uglify 			= require('gulp-uglify'),
    cleanCSS 		= require('gulp-clean-css'), //мініфікує css
    rename 			= require('gulp-rename'),
    autoprefixer 	= require('gulp-autoprefixer'),
    notify 			= require("gulp-notify"),
    imagemin 		= require("gulp-imagemin");
    del            	= require('del');

//шляхи до всіх js бібліотек 
var JSlibs = [
    'app/libs/jquery/dist/jquery.min.js',
]

// Сервер і автооновлення Browsersync
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    });
});

// Мнініфікація користувацьких скріптів пректу і JS бібліотек в один файл
gulp.task('js', () => {
    return gulp.src([
            JSlibs.toString(),
            'app/js/common.js', // Зaвджи в кінці
        ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify()) // мініфікувати весь js
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', () => {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer(['last 20 versions']))
        .pipe(cleanCSS())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], () => {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('image-min', () => {
    gulp.src('app/img/**.*')
        .pipe(imagemin({
            interlaced: true,
            progressive: false,
            optimizationLevel: 2,
            svgoPlugins: [{ removeViewBox: true }]
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['remove-dist', 'image-min', 'sass', 'js'],() => {

    var buildFiles = gulp.src([
        'app/*.html'
    ]).pipe(gulp.dest('dist'));

    var buildCss = gulp.src([
        'app/css/main.min.css',
    ]).pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src([
        'app/js/scripts.min.js',
    ]).pipe(gulp.dest('dist/js'));

    var buildFonts = gulp.src([
        'app/fonts/**/*',
    ]).pipe(gulp.dest('dist/fonts'));

});

//Видаляє попередній білд
gulp.task('remove-dist', function() { return del.sync('dist'); });

gulp.task('default', ['watch']);