module.exports = function(grunt) {

	// CONFIGURATION
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// https://github.com/gruntjs/grunt-contrib-uglify
		uglify: {
			dist: {
				files: {
					'dist/parallaxy.min.js': ['src/parallaxy.js']
				}
			}
		},

		// Minify CSS
		// https://github.com/gruntjs/grunt-contrib-cssmin
		cssmin: {
			dist: {
				files: {
					'dist/parallaxy.min.css': ['src/parallaxy.css']
				}
			},
		},

		// https://github.com/gruntjs/grunt-contrib-copy
		copy: {
			demo: {
				expand: true,
				flatten: true,
				src: [
					'src/parallaxy.js',
					'src/parallaxy.css'
				],
    			dest: 'demo/',
			}
		},

		// http://www.browsersync.io/docs/grunt/
		browserSync: {
			bsFiles: {
				src : [
					'demo/parallaxy.js',
					'demo/parallaxy.css',
				]
			},
			options: {
				watchTask: true,
				server: {
					baseDir: "./demo"
				}
			},
		},

		// https://github.com/gruntjs/grunt-contrib-watch
		watch: {
			demo: {
				files: [
					'src/parallaxy.js',
					'src/parallaxy.css'
				],
				tasks: ['copy']
			}
        },
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-notify'); // https://github.com/dylang/grunt-notify

	// Task to run when doing 'grunt' in terminal.
	grunt.registerTask('default', [
		'uglify',
		'cssmin',
		'copy',
		'browserSync',
		'watch'
	]);
};
