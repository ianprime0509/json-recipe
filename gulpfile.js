const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () =>
  gulp
    .src('lib/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('dist')),
);

gulp.task('test', () =>
  gulp.src('spec/**/*.spec.ts').pipe(
    jasmine({
      config: {
        spec_dir: 'spec',
        spec_files: ['**/*.spec.ts'],
        helpers: ['helpers/**/*.helper.js'],
      },
    }),
  ),
);
