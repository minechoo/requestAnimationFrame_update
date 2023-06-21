const btn = document.querySelector('button');
const box = document.querySelector('#box');

btn.addEventListener('click', () => {
	anime(box, {
		prop: 'margin-left',
		value: 500,
		duration: 500,
		callback: () => console.log('end'),
	});
});

function anime(selector, option) {
	let startTime = performance.now();
	requestAnimationFrame(move);

	function move(time) {
		let timelast = time - startTime;
		let progress = timelast / option.duration;

		//progress값이 시작이 음수로 떨어지거나 혹은 종료시 1이 넘어서는 경우를 각각 0, 1로 보정
		//progress값이 적용되는 targetValue값도 딱 정수로 떨어짐 (px단위에서 중요함)
		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		progress < 1 ? requestAnimationFrame(move) : option.callback && option.callback();
		/*
		if (progress < 1) {
			requestAnimationFrame(move);
		} else {
			if(option.callback) option.callback();
		}
		*/

		selector.style[option.prop] = option.value * progress + 'px';
	}
}
