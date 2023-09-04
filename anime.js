class Anime {
	constructor(selector, props, duration, callback) {
		this.selector = selector;
		this.keys = Object.keys(props);
		this.values = Object.values(props);
		this.duration = duration;
		this.callback = callback;
		this.startTime = performance.now();
		this.isString = null;
		//인스턴스 복사시 props의 갯수만큼 반복을 돌면서 속성종류에 따라 value값을 보정해주는 getValue에 반복전달
		this.keys.forEach((key, idx) => this.getValue(key, this.values[idx]));
	}

	//반복돌면서 전달되는 key, value값을 활용에 속성에 맞게 값을 가공해서 run메서드에 보내줌
	getValue(key, value) {
		let currentValue = null;
		this.isString = typeof value === 'string';
		currentValue = parseFloat(getComputedStyle(this.selector)[key]);
		key === 'scroll'
			? (currentValue = this.selector.scrollY)
			: (currentValue = parseFloat(getComputedStyle(this.selector)[key]));

		if (this.isString) {
			const parentW = parseInt(getComputedStyle(this.selector.parentElement).width);
			const parentH = parseInt(getComputedStyle(this.selector.parentElement).height);
			const x = ['left', 'right', 'width'];
			const y = ['top', 'bottom', 'height'];
			if (key.includes('margin') || key.includes('padding'))
				return console.error('margin, padding값은 퍼센트 모션처리할 수 없습니다.');
			for (let cond of x) key === cond && (currentValue = (currentValue / parentW) * 100);
			for (let cond of y) key === cond && (currentValue = (currentValue / parentH) * 100);
			const percentValue = parseFloat(value);
			percentValue !== currentValue &&
				requestAnimationFrame((time) => this.run(time, key, currentValue, percentValue, true));
		} else {
			value !== currentValue && requestAnimationFrame((time) => this.run(time, key, currentValue, value, false));
		}
	}

	//getValue로 전달된 값을 requestAnimationFrame으로부터 전달받아서 내부의 getProgress메서드에 전달
	run(time, key, currentValue, value, isPercent) {
		let [progress, result] = this.getProgress(time, currentValue, value);
		//result값을 활용해서 실제적으로 DOM에 세팅
		this.setValue(key, result, isPercent);
		//progress값을 활용해서 반복유무를 결정
		progress < 1
			? requestAnimationFrame((time) => this.run(time, key, currentValue, value, isPercent ? true : false))
			: this.callback && this.callback();
	}

	//run메서드 안쪽에서 전달된 currentValue,value값을 가지고 속성별로 진행률과 진행률이 적용된 result값을 반환
	getProgress(time, currentValue, value) {
		let timelast = time - this.startTime;
		let progress = timelast / this.duration;
		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		let result = currentValue + (value - currentValue) * progress;
		return [progress, result];
	}

	//전달된 result값으로 실제적으로 돔의 변화 세팅
	setValue(key, result, isPercent) {
		if (isPercent) this.selector.style[key] = result + '%';
		else if (key === 'opacity') this.selector.style[key] = result;
		else if (key === 'scroll') this.selector.scroll(0, result);
		else this.selector.style[key] = result + 'px';
	}
}
