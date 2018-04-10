

import header from "./common/header";
import { mixins } from "./common/mixin";

let {moduleName} = header;

$(() => {
	alert(moduleName);
	console.log($);
	let promise = new Promise((resolve, reject) => {
		resolve('resolve');
	});
	promise.then((res) => {
		console.log(res);
	});

	const Foo = {
		foo() {
			console.log('foo')
		}
	}

	// @mixins(Foo)
	class Num {
		constructor(num) {
			this.num = num;
		}
		sayNum() {
			alert(this.num);
		}
	}


	var num = new Num(123);
	// num.foo()
	setTimeout(() => {
		num.sayNum();
	}, 1000);

});

window.onerror = (msg, url, line, col, err) => {
    console.log(msg);
    console.log(url);
    console.log(line);
    console.log(col);
    console.log(err);
};

console.log(are)