module.exports = function (grunt) {
	'use strict';

	var BANNER = '/* Swipe Video Gallery\n * By Anthony Law Liddle\n * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n*/\n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		sass: {
			dist: {
				options: {
					style: 'compressed',
					'sourcemap=none': true,
					banner: BANNER
				},
				files: {
					'dist/swipevideo.min.css' : 'test/styles/scss/base.scss',
					'test/styles/css/custom.min.css' : 'test/styles/scss/custom.scss'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: [
					'last 2 versions',
					'Safari >= 5.1.10',
					'Explorer >= 8',
					'Firefox >= 20',
					'iOS >= 6.1',
					'Android >= 4.1.1'
				]
			},
			dist: {
				files: {
					'dist/swipevideo.min.css' : 'dist/swipevideo.min.css'
				}
			}
		},

		uglify: {
			options: {
				banner: BANNER
			},
			build: {
				src: 'test/scripts/swipevideo.js',
				dest: 'dist/swipevideo.min.js'
			}
		},

		watch: {
			css: {
				files: ['test/styles/scss/*.scss'],
				tasks: ['sass']
			},
			js: {
				files: ['test/scripts/*.js'],
				tasks: ['uglify']
			}
		},

	});

	require('time-grunt')(grunt);

	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default', ['sass', 'autoprefixer', 'uglify']);

};
