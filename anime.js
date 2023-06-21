const btn = document.querySelector('button');
const box = document.querySelector('#box');

btn.addEventListener('click', () => {
	anime(box, {
		prop: 'margin-left',
		value: 100,
		duration: 500,
	});
});

function anime(selector, option) {
	const startTime = performance.now();

	//selector요소의 현재 css에 적용되어 있는 값을 가져온뒤, parseInt를 활용해 숫자값으로 변경
	const currentValue = parseInt(getComputedStyle(selector)[option.prop]);

	if (option.value === currentValue) return;
	if (option.value > currentValue) requestAnimationFrame(plus);
	if (option.value < currentValue) requestAnimationFrame(minus);

	function plus(time) {
		let timelast = time - startTime;
		let progress = timelast / option.duration;

		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		progress < 1 ? requestAnimationFrame(plus) : option.callback && option.callback();

		let result = currentValue + (option.value - currentValue) * progress;
		selector.style[option.prop] = result + 'px';
	}
}
