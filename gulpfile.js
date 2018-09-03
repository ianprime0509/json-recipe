const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const json2ts = require('json-schema-to-typescript');
const through = require('through2');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', ['gen-schema-types'], () =>
  gulp
    .src('lib/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('dist')),
);

gulp.task('gen-schema-types', () =>
  gulp
    .src('recipe.schema.json')
    .pipe(
      through.obj((file, enc, callback) => {
        json2ts
          .compile(JSON.parse(file.contents.toString(enc)), 'JsonRecipe')
          .then(output => {
            file.contents = Buffer.from(output, enc);
            file.path = 'schema-types.d.ts';
            callback(null, file);
          });
      }),
    )
    .pipe(gulp.dest('lib')),
);

gulp.task('test', ['gen-schema-types'], () =>
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
