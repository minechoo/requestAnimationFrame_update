class Anime {
	constructor(selector, props, duration, callback) {
		this.selector = selector;
		this.keys = Object.keys(props);
		this.values = Object.values(props);
		this.duration = duration;
		this.callback = callback;
		this.startTime = performance.now();
		this.isString = null;
		//props객체어서 key, value값을 배열로 뽑고 인스턴스 객체로 넘긴다음
		//인스턴스 생성시 내부적으로 해당 배열의 값들을 setValue메서드를 반복호출하면서 인수로 전달
		this.keys.forEach((key, idx) => this.setValue(key, this.values[idx]));
	}

	//인수로 전달된 key값에 따라 value, currentValue값을 가공해서 run메서드에 전달하는 메서드
	setValue(key, value) {
		let currentValue = null;
		this.isString = typeof value === 'string';

		//일반적인 속성명일때 currentValue값 처리
		currentValue = parseFloat(getComputedStyle(this.selector)[key]);

		//속성명이 scroll일때 currentValue값 처리
		key === 'scroll'
			? (currentValue = this.selector.scrollY)
			: (currentValue = parseFloat(getComputedStyle(this.selector)[key]));

		//퍼센트일떄 currentValue값 처리
		if (this.isString) {
			const parentW = parseInt(getComputedStyle(this.selector.parentElement).width);
			const parentH = parseInt(getComputedStyle(this.selector.parentElement).height);
			const x = ['left', 'right', 'width'];
			const y = ['top', 'bottom', 'height'];
			if (key.includes('margin') || key.includes('padding'))
				return console.error('margin, padding값은 퍼센트 모션처리할 수 없습니다.');
			for (let cond of x) key === cond && (currentValue = (currentValue / parentW) * 100);
			for (let cond of y) key === cond && (currentValue = (currentValue / parentH) * 100);
			value = parseFloat(value);
			//속성값을 퍼센트로 동작해야 되는 progress값을 분리해야 되기 때문에 runPercent함수 호출
			value !== currentValue && requestAnimationFrame((time) => this.runPercent(time, key, currentValue, value));
		} else {
			//속성값을 퍼센트로 연산할 필요가 없을때 나머지 모든 속성들은 동일한 progress로직으로 동작가능하기 때문에 runBasic호출
			value !== currentValue && requestAnimationFrame((time) => this.runBasic(time, key, currentValue, value));
		}
	}

	//공통으로 실행할 진행률 반환하는 메서드
	getProgress(time, currentValue, value) {
		let timelast = time - this.startTime;
		let progress = timelast / this.duration;
		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		let result = currentValue + (value - currentValue) * progress;
		return [progress, result];
	}

	runBasic(time, key, currentValue, value) {
		//진행률 반환후
		let [progress, result] = this.getProgress(time, currentValue, value);
		progress < 1
			? requestAnimationFrame((time) => this.runBasic(time, key, currentValue, value))
			: this.callback && this.callback();

		//반환된 결과값으로 opcacity, scroll외에 모든 px요청값 적용
		if (key === 'opacity') this.selector.style[key] = result;
		else if (key === 'scroll') this.selector.scroll(0, result);
		else this.selector.style[key] = result + 'px';
	}

	runPercent(time, key, currentValue, value) {
		//진행률 반환후
		let [progress, result] = this.getProgress(time, currentValue, value);
		progress < 1
			? requestAnimationFrame((time) => this.runPercent(time, key, currentValue, value))
			: this.callback && this.callback();

		//반환된 결과값으로 오직 percent요청값 적용
		this.selector.style[key] = result + '%';
	}
}
