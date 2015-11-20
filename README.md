### What it is

Adds parallax effect to images.

### Installation

parallaxy.js is available as an [npm package](https://www.npmjs.com/package/parallaxy).

```
npm install parallaxy --save
```

Add **parallaxy.min.js** to the bottom of the `<body>` like this:

```
<script src="parallaxy.min.js"></script>
```


### Note

This is an very early version of parallaxy.


### Usage 1

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

Options must be passed via data-attributes. Append the option name to `data-parallaxy-`, as in `data-parallaxy-speed="0.25"`.

| Name                   | Type      | Default     | Description                                   |
|------------------------|-----------|-------------|-----------------------------------------------|
| data-parallaxy-speed	 | Float     | 0.5         | Adjust parallaxy effect from 0-1 (none-max)   |
| data-parallaxy-ignore	 | Boolean   | false       | Ignore parallaxy effect on this element       |


### Browser Support

Coming soon. Uses CSS translate2D to scale and position images.


### License

The code is available under the [MIT License](https://github.com/cferdinandi/smooth-scroll/blob/master/LICENSE.md).

