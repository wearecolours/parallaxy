### What it is

Adds parallax effect to images and videos.

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


## How to Use

### Usage

In this example the image will have a parallaxy effect.

```html
<div data-parallaxy>
	<img src="image.jpg">
	<div data-parallaxy-ignore>
		<h1>Content above</h1>
	</div>
</div>
```

### After DOM change

If the DOM has changed and you want to reset Parallaxy, just run;

```
Parallaxy.refresh();
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

