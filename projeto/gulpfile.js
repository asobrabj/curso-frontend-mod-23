const gulp       = require('gulp')
const concat     = require('gulp-concat')
const cssmin     = require('gulp-cssmin')
const rename     = require('gulp-rename')
const scripts    = require('gulp-strip-comments')
const scriptscss = require('gulp-strip-css-comments')
const uglify     = require('gulp-uglify')
const image      = require('gulp-image')
const sass       = require('gulp-sass')(require('node-sass'))
const htmlmin    = require('gulp-htmlmin')
const { series, parallel } = require('gulp')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload


function tarefasCSS(callback){
                     
        gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.css',
             './vendor/jquery-ui/jquery-ui.css',
             './src/css/style.css'
             ])  
    
        .pipe(scriptscss())                 // Remove os comentários     
        .pipe(concat('libs.css'))            // Mescla os arquivos     
        .pipe(cssmin())                     // Minifica os css
        .pipe(rename({ suffix: '.min'} ))   // Cria este libs.min.css 
        .pipe(gulp.dest('./dist/css'))      // Cria o arquivo no diretório ./dist

    return callback()
}


function tarefasJS(callback){

    gulp.src(['./node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './vendor/jquery-ui/jquery-ui.js'
        ])

    .pipe(scripts())                    // Remove os comentários
    .pipe(concat('libs.js'))            // Mescla os arquivos
    .pipe(uglify())                     // Minifica os js
    .pipe(rename({ suffix: '.min'} ))   // Cria este libs.min.js 
    .pipe(gulp.dest('./dist/js'))       // Cria o arquivo no diretório ./dist

    return callback()
}

function tarefasImagem(){

    return gulp.src('./src/images/*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true
        }))
        .pipe(gulp.dest('./dist/images')) 
            
}

function tarefasSASS(cb){

        gulp.src('./src/scss/**/*scss')
        .pipe(sass())               // transforma o sass em css
        .pipe(gulp.dest('./dist/css')) 
    cb()        
}

function tarefasHtml(callback){
    gulp.src('./src/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'))

    return callback()
}

gulp.task('serve',function(){

    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })
    gulp.watch('.src/**/*').on('change',process)   // repete processos
    gulp.watch('./dist/**/*').on('change', reload) // serve 
})

function end(cbe){
    console.log('Tarefas concluídas!')
    return cbe()
}


const process = series(tarefasHtml, tarefasCSS, tarefasJS, tarefasSASS, end )

exports.styles  = tarefasCSS
//exports.scripts = tarefasJS
exports.images  = tarefasImagem
//exports.sass    = tarefasSASS
exports.html    = tarefasHtml

exports.default = process

 


