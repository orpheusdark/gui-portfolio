<script lang="ts">
	const numeric_keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];
	const operator_keys = ['/', '*', '-', '+'];

	let display = $state('0');
	let accumulator = $state<number | null>(null);
	let pending_operator = $state<string | null>(null);
	let should_reset_display = $state(false);

	function formatNumber(value: number) {
		if (!Number.isFinite(value)) return 'Error';
		return value.toLocaleString('en-US', { maximumFractionDigits: 10 });
	}

	function parseDisplay() {
		return Number(display.replaceAll(',', ''));
	}

	function inputNumber(value: string) {
		if (display === 'Error') {
			display = value === '.' ? '0.' : value;
			return;
		}

		if (should_reset_display) {
			display = value === '.' ? '0.' : value;
			should_reset_display = false;
			return;
		}

		if (value === '.' && display.includes('.')) return;
		if (display === '0' && value !== '.') {
			display = value;
			return;
		}

		display += value;
	}

	function applyOperation(lhs: number, rhs: number, op: string) {
		switch (op) {
			case '+':
				return lhs + rhs;
			case '-':
				return lhs - rhs;
			case '*':
				return lhs * rhs;
			case '/':
				return rhs === 0 ? Number.NaN : lhs / rhs;
			default:
				return rhs;
		}
	}

	function inputOperator(op: string) {
		const current = parseDisplay();

		if (accumulator === null) {
			accumulator = current;
		} else if (pending_operator && !should_reset_display) {
			accumulator = applyOperation(accumulator, current, pending_operator);
			display = formatNumber(accumulator);
		}

		pending_operator = op;
		should_reset_display = true;
	}

	function calculate() {
		if (!pending_operator || accumulator === null) return;

		const result = applyOperation(accumulator, parseDisplay(), pending_operator);
		display = formatNumber(result);
		accumulator = result;
		pending_operator = null;
		should_reset_display = true;
	}

	function clearAll() {
		display = '0';
		accumulator = null;
		pending_operator = null;
		should_reset_display = false;
	}

	function toggleSign() {
		if (display === '0' || display === 'Error') return;
		display = display.startsWith('-') ? display.slice(1) : `-${display}`;
	}

	function percent() {
		if (display === 'Error') return;
		display = formatNumber(parseDisplay() / 100);
	}
</script>

<section class="container" aria-label="Calculator App">
	<div class="display" role="status" aria-live="polite">{display}</div>

	<div class="keys">
		<button class="key util" onclick={clearAll}>AC</button>
		<button class="key util" onclick={toggleSign}>+/-</button>
		<button class="key util" onclick={percent}>%</button>
		<button class="key op" onclick={() => inputOperator('/')}>/</button>

		{#each numeric_keys as key, index}
			{#if index > 0 && index % 3 === 0}
				<button class="key op" onclick={() => inputOperator(operator_keys[index / 3 - 1])}
					>{operator_keys[index / 3 - 1]}</button
				>
			{/if}

			<button class="key num {key === '0' ? 'zero' : ''}" onclick={() => inputNumber(key)}>{key}</button>
		{/each}

		<button class="key op" onclick={() => inputOperator('+')}>+</button>
		<button class="key op equals" onclick={calculate}>=</button>
		<button class="key spacer" disabled aria-hidden="true"></button>
	</div>
</section>

<style>
	.container {
		height: 100%;
		width: 100%;
		padding: 0.6rem;
		display: grid;
		grid-template-rows: auto 1fr;
		gap: 0.5rem;
		border-radius: inherit;
		background: linear-gradient(180deg, #2f2f31 0%, #1f1f21 100%);
		color: #f4f4f4;
	}

	.display {
		height: 3.3rem;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 0.65rem;
		font-size: 2rem;
		font-weight: 300;
		border-radius: 0.55rem;
		background: hsla(0, 0%, 100%, 0.07);
		overflow: hidden;
		white-space: nowrap;
	}

	.keys {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.45rem;
	}

	.key {
		height: 2.25rem;
		border-radius: 999px;
		font-size: 1rem;
		font-weight: 500;
		transition: transform 90ms ease, filter 120ms ease;

		&:hover:not(:disabled) {
			filter: brightness(1.08);
		}

		&:active:not(:disabled) {
			transform: scale(0.97);
		}
	}

	.key.num {
		background: #626266;
		color: #fff;
	}

	.key.util {
		background: #a5a5a8;
		color: #1b1b1b;
	}

	.key.op {
		background: #ff9f0a;
		color: #fff;
	}

	.key.zero {
		grid-column: span 2;
	}

	.key.equals {
		grid-row: span 2;
		height: 100%;
		border-radius: 1.1rem;
	}

	.key.spacer {
		visibility: hidden;
	}
</style>
