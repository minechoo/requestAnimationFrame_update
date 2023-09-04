class Anime {
	constructor(selector, props, duration, callback) {
		this.selector = selector;
		this.keys = Object.keys(props);
		this.values = Object.values(props);
		this.duration = duration;
		this.callback = callback;
		this.startTime = performance.now();
		this.isString = null;
		this.keys.forEach((key, idx) => this.setValue(key, this.values[idx]));
	}

	setValue(key, value) {
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
			percentValue !== currentValue && requestAnimationFrame((time) => this.run(time, key, currentValue, value, true));
		} else {
			value !== currentValue && requestAnimationFrame((time) => this.run(time, key, currentValue, value, false));
		}
	}

	getProgress(time, currentValue, value) {
		let timelast = time - this.startTime;
		let progress = timelast / this.duration;
		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		let result = currentValue + (value - currentValue) * progress;
		return [progress, result];
	}

	run(time, key, currentValue, value, isPercent) {
		let [progress, result] = this.getProgress(time, currentValue, value);
		//진행률이 1에 도달하지 않으면 계속 반복처리
		progress < 1
			? //진행률이 1에 도달하지 않은상태에서 isPercent가 true면 퍼센트 로직으로 run반복호출 , 그렇지 않으면 일반로직으로 run 반복호출
			  requestAnimationFrame((time) =>
					isPercent ? this.run(time, key, currentValue, value, true) : this.run(time, key, currentValue, value, false)
			  )
			: //1에 도달하면 반복을 멈추고 콜백이 있을떄 콜백함수 실행
			  this.callback && this.callback();
		if (isPercent) this.selector.style[key] = result + '%';
		else if (key === 'opacity') this.selector.style[key] = result;
		else if (key === 'scroll') this.selector.scroll(0, result);
		else this.selector.style[key] = result + 'px';
	}
}
