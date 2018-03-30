import 'babel-polyfill';
import $ from 'jquery';
import header from "./common/header";


let {moduleName} = header;

(() => {
	// alert(moduleName);
	// console.log($);
	let promise = new Promise((resolve, reject) => {
		resolve('resolve');
	});
	promise.then((res) => {
		console.log(res);
	});


	class Num {
		constructor(num) {
			this.num = num;
		}
		sayNum() {
			alert(this.num);
		}
	}

	var num = new Num(123);

	setTimeout(() => {
		num.sayNum();
	}, 1000);

})();
