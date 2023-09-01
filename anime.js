/*
function anime(selector, option) {
	const startTime = performance.now();
	let currentValue = null;

	option.prop === 'scroll'
		? (currentValue = selector.scrollY)
		: (currentValue = parseFloat(getComputedStyle(selector)[option.prop]));

	const isString = typeof option.value;
	if (isString === 'string') {
		//option.value값이 문자열이면 기존의 currentValue값도 퍼센트 처리
		//퍼센트로 값을 변환하기 위해서는 부모요소의 전체넓이, 전체 높이값을 구함
		const parentW = parseInt(getComputedStyle(selector.parentElement).width);
		const parentH = parseInt(getComputedStyle(selector.parentElement).height);

		//가로나 세로축으로 퍼센트로 적용될만한 속성명을 배열로 그룹화
		const x = ['left', 'right', 'width'];
		const y = ['top', 'bottom', 'height'];
		const errProps = [
			'margin-left',
			'margin-right',
			'padding-left',
			'padding-right',
			'margin-top',
			'margin-bottom',
			'padding-top',
			'padding-bottom',
		];

		//퍼센트로 적용할수 없는 속성값이 들어오면 경고문구 출력하고 종료
		for (let cond of errProps)
			if (option.prop === cond) return console.error('margin, padding값은 퍼센트 모션처리할 수 없습니다.');

		//option.prop값으로 위의 배열로 설정한 속성이 들어오면 currentValue값을 부모요소의 크기대비 퍼센트로 변환
		for (let cond of x) option.prop === cond && (currentValue = (currentValue / parentW) * 100);
		for (let cond of y) option.prop === cond && (currentValue = (currentValue / parentH) * 100);

		option.value = parseFloat(option.value);
	}

	option.value !== currentValue && requestAnimationFrame(run);

	function run(time) {
		let timelast = time - startTime;
		let progress = timelast / option.duration;

		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		progress < 1 ? requestAnimationFrame(run) : option.callback && option.callback();

		let result = currentValue + (option.value - currentValue) * progress;

		if (isString === 'string') selector.style[option.prop] = result + '%';
		else if (option.prop === 'opacity') selector.style[option.prop] = result;
		else if (option.prop === 'scroll') selector.scroll(0, result);
		else selector.style[option.prop] = result + 'px';
	}
}
*/
class Anime {
	constructor(selector, props, duration, callback) {
		this.selector = selector;
		this.keys = Object.keys(props);
		this.values = Object.values(props);
		this.duration = duration;
		this.callback = callback;
		this.startTime = performance.now();
		this.isString - null;
		//props객체어서 key, value값을 배열로 뽑고 인스턴스 객체로 넘긴다음
		//인스턴스 생성시 내부적으로 해당 배열의 값들을 setValue메서드를 반복호출하면서 인수로 전달
		this.keys.forEach((key, idx) => this.setValue(key, this.values[idx]));
	}

	setValue(key, value) {
		console.log(key);
		let currentValue = null;
		this.isString = typeof value;
		//일반적인 속성명일때 currentValue값 처리
		currentValue = parseFloat(getComputedStyle(this.selector)[key]);
		//속성명이 scroll일때 currentValue값 처리
		key === 'scroll'
			? (currentValue = selector.scrollY)
			: (currentValue = parseFloat(getComputedStyle(this.selector)[key])); //scroll은 윈도우 객체라 컴퓨티드스타일 못가져옴

		if (this.isString === 'string') {
			const parentW = parseInt(getComputedStyle(this.selector.parentElement).width);
			const parentH = parseInt(getComputedStyle(this.selector.parentElement).height);

			const x = ['left', 'right', 'width'];
			const y = ['top', 'bottom', 'height'];
			const errProps = [
				'margin-left',
				'margin-right',
				'padding-left',
				'padding-right',
				'margin-top',
				'margin-bottom',
				'padding-top',
				'padding-bottom',
			];

			for (let cond of errProps)
				if (key === cond) return console.error('margin, padding값은 퍼센트 모션처리할 수 없습니다.');
			for (let cond of x) key === cond && (currentValue = (currentValue / parentW) * 100);
			for (let cond of y) key === cond && (currentValue = (currentValue / parentH) * 100);

			value = parseFloat(value);
		}
		console.log('curVal', currentValue, 'tarVal', value);
		value !== currentValue && requestAnimationFrame((time) => this.run(time, key, currentValue, value));
	}

	run(time, key, currentValue, value) {
		//console.log('time', time, 'key', key, 'currentValue', currentValue, 'value', value);
		let timelast = time - this.startTime;
		let progress = timelast / this.duration;

		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);

		progress < 1
			? requestAnimationFrame((time) => this.run(time, key, currentValue, value))
			: this.callback && this.callback();

		let result = currentValue + (value - currentValue) * progress;
		if (this.isString) this.selector.style[key] = result + '%';
		else if (key === 'opacity') this.selector.style[key] = result;
		else if (key === 'scroll') this.selector.scroll(0, result);
		else this.selector.style[key] = result + 'px';
	}
}
