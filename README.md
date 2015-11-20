### What it is

Adds parallax effect to images and backgrounds.

### Installation

parallaxy.js is available as an [npm package](https://www.npmjs.com/package/parallaxy).

```
npm install parallaxy --save
```

Add **parallaxy.min.js** to the bottom of the `<body>` like this:

```html
		<script src="parallaxy.min.js"></script>
	</body>
```


### Note

This is an very early version of parallaxy. Docs and code are a bit premature and will soon get an update..



### Usage
In this example the image will have a parallaxy effect.

```html
<div data-parallaxy="true">
	<div data-parallaxy-ignore="true">
		<h1>Content above</h1>
	</div>
	<img src="image.jpg" />
</div>
```


### Options

Options can be passed via data attributes. Append the option name to `data-parallaxy-`, as in `data-parallaxy-speed=""`.

| Name       | Type     | Default | Description        |
|------------|----------|---------|--------------------|
|            |          |         |                    |

### Browser Support

Coming soon


### License

The code is available under the [MIT License](https://github.com/cferdinandi/smooth-scroll/blob/master/LICENSE.md).

