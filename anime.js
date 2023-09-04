class Anime {
	#defOpt = { duration: 500, callback: null, easeType: 'linear' };
	constructor(selector, props, opt) {
		this.selector = selector;
		this.defOpt = { ...this.#defOpt, ...opt };
		this.keys = Object.keys(props);
		this.values = Object.values(props);
		this.duration = this.defOpt.duration;
		this.callback = this.defOpt.callback;
		this.easeType = this.defOpt.easeType;
		this.startTime = performance.now();
		this.isString = null;
		this.isPercent = null;
		this.isBg = null;
		this.easingProgress = null;
		//인스턴스 복사시 props의 갯수만큼 반복을 돌면서 속성종류에 따라 value값을 보정해주는 getValue에 반복전달
		this.keys.forEach((key, idx) => {
			//반복도는 value값이 문자열이면 다시 조건처리
			typeof this.values[idx] === 'string'
				? this.values[idx].includes('%')
					? //문자열인데 %기호가 있으면 퍼센트처리
					  this.getValue(key, this.values[idx], 'percent')
					: //문자열인데 %기호가 없으면 색상처리
					  this.getValue(key, this.values[idx], 'color')
				: //문자값이 아니면 그냥 일반 연산처리
				  this.getValue(key, this.values[idx], 'basic');
		});
	}

	//반복돌면서 전달되는 key, value값을 활용에 속성에 맞게 값을 가공해서 run메서드에 보내줌
	//세번째 인수로 추가전달되는 type값에 따라 각각 percent, bg, basic분기 연산처리
	getValue(key, value, type) {
		let currentValue = null;
		this.isString = typeof value === 'string';
		currentValue = parseFloat(getComputedStyle(this.selector)[key]);
		key === 'scroll'
			? (currentValue = this.selector.scrollY)
			: (currentValue = parseFloat(getComputedStyle(this.selector)[key]));

		if (type === 'percent') {
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
				requestAnimationFrame((time) => this.run(time, key, currentValue, percentValue, type));
		}
		if (type === 'color') {
			value !== currentValue && requestAnimationFrame((time) => this.run(time, key, currentValue, value, type));
		}
		if (type === 'basic') {
			value !== currentValue && requestAnimationFrame((time) => this.run(time, key, currentValue, value, type));
		}
	}

	//getValue로 전달된 값을 requestAnimationFrame으로부터 전달받아서 내부의 getProgress메서드에 전달
	run(time, key, currentValue, value, type) {
		let [progress, result] = this.getProgress(time, currentValue, value);
		//run메서드의 type을 다시 setValue로 전달
		this.setValue(key, result, type);
		progress < 1
			? //진행률이 1에 도달하지 않으면 반복처리
			  //percent, color, basic조건을 반복돌면서
			  //run메서드를 통해서  전달되는 type값이 현재 반복도는 타입과 동일하면 해당 타입을 다시 run메서드의 마지막 인수로 전달해서 재귀적 호출
			  ['percent', 'color', 'basic'].map(
					(el) => type === el && requestAnimationFrame((time) => this.run(time, key, currentValue, value, type))
			  )
			: //1에 도달하면 반복중지하고 콜백함수 처리
			  this.callback && this.callback();
	}

	//run메서드 안쪽에서 전달된 currentValue,value값을 가지고 속성별로 진행률과 진행률이 적용된 result값을 반환
	getProgress(time, currentValue, value) {
		const easingPresets = {
			linear: [0, 0, 1, 1],
			ease1: [0.4, -0.61, 0.54, 1.61],
			ease2: [0, 1.82, 0.94, -0.73],
		};

		let timelast = time - this.startTime;
		let progress = timelast / this.duration;

		Object.keys(easingPresets).map((key) => {
			//easingPresets[key] : linear, ease1, ease2에 등록되어 있는 각각의 배열
			//옵션으로 전달한 easeType과 내부적으로 반복도는  key값이 동일할때 해당 조건의 배열값을 BezierEasing에 전달
			//매칭되는 배열값을 다시 순번에 맞게 뽑아서 BeizeEading에 각각 전달한후 반환되는 함수에 바로 progress를 인수로 전달해 호출
			if (this.easeType === key)
				this.easingProgress = BezierEasing(
					easingPresets[key][0],
					easingPresets[key][1],
					easingPresets[key][2],
					easingPresets[key][3]
				)(progress);
		});

		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		let result = currentValue + (value - currentValue) * this.easingProgress;
		return [progress, result];
	}

	//전달된 result값으로 실제적으로 돔의 변화 세팅
	setValue(key, result, type) {
		if (type === 'percent') this.selector.style[key] = result + '%';
		else if (type === 'color') this.selector.style[key] = result + '%';
		else if (key === 'opacity') this.selector.style[key] = result;
		else if (key === 'scroll') this.selector.scroll(0, result);
		else this.selector.style[key] = result + 'px';
	}
}
